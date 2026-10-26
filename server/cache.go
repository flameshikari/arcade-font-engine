package main

import (
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"sync"
	"time"
)

const cacheMaxBytes int64 = 64 << 20
const cacheMaxFiles = 1024
const cacheTTL = 24 * time.Hour

// Recognize only the old application's generated filenames during migration.
var legacyCacheName = regexp.MustCompile(`^[a-zA-Z0-9_]+-[0-9]+-[1-9]-(?:[ud][0-9]+[ld]-)?[a-f0-9]{16}\.(png|svg)$`)
var temporaryCacheName = regexp.MustCompile(`^\.afe-[0-9]+$`)
var cacheName = regexp.MustCompile(`^v2-[a-f0-9]{64}\.(png|svg)$`)

type cacheEntry struct {
	name     string
	size     int64
	modified time.Time
}
type diskCache struct {
	mu      sync.Mutex
	dir     string
	entries map[string]cacheEntry
	size    int64
}

func newDiskCache(dir string) *diskCache {
	c := &diskCache{dir: dir, entries: make(map[string]cacheEntry)}
	files, _ := os.ReadDir(dir)
	for _, file := range files {
		if (legacyCacheName.MatchString(file.Name()) || temporaryCacheName.MatchString(file.Name())) && file.Type().IsRegular() {
			os.Remove(filepath.Join(dir, file.Name()))
			continue
		}
		if !cacheName.MatchString(file.Name()) {
			continue
		}
		info, err := file.Info()
		if err != nil || !info.Mode().IsRegular() {
			continue
		}
		c.entries[file.Name()] = cacheEntry{file.Name(), info.Size(), info.ModTime()}
		c.size += info.Size()
	}
	c.prune(0, false)
	return c
}

// Only application-owned regular cache files can be read or removed.
func (c *diskCache) remove(name string) {
	if entry, ok := c.entries[name]; ok {
		if err := os.Remove(filepath.Join(c.dir, name)); err == nil || os.IsNotExist(err) {
			c.size -= entry.size
			delete(c.entries, name)
		}
	}
}
func (c *diskCache) prune(incoming int64, adding bool) {
	entries := make([]cacheEntry, 0, len(c.entries))
	for _, entry := range c.entries {
		entries = append(entries, entry)
	}
	sort.Slice(entries, func(i, j int) bool { return entries[i].modified.Before(entries[j].modified) })
	limit := cacheMaxFiles
	if adding {
		limit--
	}
	for _, entry := range entries {
		if time.Since(entry.modified) >= cacheTTL || c.size+incoming > cacheMaxBytes || len(c.entries) > limit {
			c.remove(entry.name)
		}
	}
}
func (c *diskCache) read(name string) ([]byte, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if !cacheName.MatchString(name) {
		return nil, false
	}
	entry, ok := c.entries[name]
	if !ok {
		return nil, false
	}
	if time.Since(entry.modified) >= cacheTTL {
		c.remove(name)
		return nil, false
	}
	path := filepath.Join(c.dir, name)
	info, err := os.Lstat(path)
	if err != nil || !info.Mode().IsRegular() || info.Size() > cacheMaxBytes {
		return nil, false
	}
	data, err := os.ReadFile(path)
	return data, err == nil
}
func (c *diskCache) write(name string, data []byte) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	if !cacheName.MatchString(name) || int64(len(data)) > cacheMaxBytes {
		return nil
	}
	c.remove(name)
	c.prune(int64(len(data)), true)
	if c.size+int64(len(data)) > cacheMaxBytes || len(c.entries) >= cacheMaxFiles {
		return nil
	}
	f, err := os.CreateTemp(c.dir, ".afe-*")
	if err != nil {
		return err
	}
	defer os.Remove(f.Name())
	if _, err = f.Write(data); err != nil {
		f.Close()
		return err
	}
	if err = f.Close(); err != nil {
		return err
	}
	if err = os.Rename(f.Name(), filepath.Join(c.dir, name)); err != nil {
		return err
	}
	c.entries[name] = cacheEntry{name, int64(len(data)), time.Now()}
	c.size += int64(len(data))
	return nil
}
