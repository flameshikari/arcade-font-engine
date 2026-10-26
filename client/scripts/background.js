import { getFontImage } from './renderer.js';
import { onMediaChange } from './compat.js';

const revealDuration = 660;
const columns = 64;
const rows = 32;
const cellSize = 16;
const tileWidth = columns * cellSize;
const tileHeight = rows * cellSize;

export async function randomizeBackground() {
    const font = await getFontImage('arcade');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const values = crypto.getRandomValues(new Uint8Array(columns * rows));
    const alphabet = '0123456789ABCDEF';

    // Scale the sixteen glyphs once, then copy ready-made cells during updates.
    const atlas = document.createElement('canvas');
    atlas.width = alphabet.length * cellSize;
    atlas.height = cellSize;
    const atlasContext = atlas.getContext('2d');
    atlasContext.imageSmoothingEnabled = false;
    for (let i = 0; i < alphabet.length; i++) {
        atlasContext.drawImage(font, (alphabet.charCodeAt(i) - 32) * 8, 0, 8, 8,
            i * cellSize, 0, cellSize, cellSize);
    }

    const full = document.createElement('canvas');
    full.width = tileWidth;
    full.height = tileHeight;
    const fullContext = full.getContext('2d', { alpha: false });
    const tile = document.createElement('canvas');
    tile.width = tileWidth;
    tile.height = tileHeight;
    const tileContext = tile.getContext('2d', { alpha: false });
    const drawCell = (context, i) => {
        context.fillRect((i % columns) * cellSize, Math.floor(i / columns) * cellSize, cellSize, cellSize);
        context.drawImage(atlas, (values[i] & 15) * cellSize, 0, cellSize, cellSize,
            (i % columns) * cellSize, Math.floor(i / columns) * cellSize, cellSize, cellSize);
    };
    for (let i = 0; i < values.length; i++) drawCell(fullContext, i);

    const surface = document.createElement('canvas');
    surface.id = 'page-background';
    surface.setAttribute('aria-hidden', 'true');
    document.body.prepend(surface);
    const context = surface.getContext('2d', { alpha: false });
    let resizeFrame;
    const paintAll = () => {
        for (let y = 0; y < surface.height; y += tileHeight) {
            for (let x = 0; x < surface.width; x += tileWidth) context.drawImage(tile, x, y);
        }
    };
    const resize = () => {
        const width = document.documentElement.clientWidth;
        const height = window.innerHeight;
        if (surface.width === width && surface.height === height) return;
        // One canvas pixel per CSS pixel: extra DPR resolution adds no detail here.
        surface.width = width;
        surface.height = height;
        context.imageSmoothingEnabled = false;
        paintAll();
    };
    resize();
    window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
            resize();
            queueGlow();
        });
    });

    // Only copy changed rectangles, including repetitions of the same tile.
    const paintRegion = (x, y, width, height) => {
        for (let top = y; top < surface.height; top += tileHeight) {
            for (let left = x; left < surface.width; left += tileWidth) {
                context.drawImage(tile, x, y, width, height, left, top, width, height);
            }
        }
    };
    const hoverMedia = matchMedia('(hover: hover) and (pointer: fine)');
    const brightness = [1, 0.65, 0.35];
    const ringRadiiSquared = [1, 4, 9]; // Five-glyph plus, then two circular rings.
    const outerRadius = 3;
    const glowSize = (outerRadius * 2 + 1) * cellSize;
    const hoveredGlyphs = new Set();
    let pointer;
    let glow;
    let glowContext;
    let glowFrame;
    const hideGlow = () => {
        pointer = null;
        hoveredGlyphs.clear();
        if (glow) glow.style.display = 'none';
    };
    const panels = [...document.querySelectorAll('#content .cell')];
    let panelRects;
    const invalidatePanels = () => { panelRects = undefined; if (pointer) queueGlow(); };
    window.addEventListener('resize', invalidatePanels);
    if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(invalidatePanels);
        panels.forEach(panel => observer.observe(panel));
        observer.observe(document.querySelector('#content .grid'));
    }
    const paintGlow = () => {
        if (!pointer || !hoverMedia.matches || !revealed || document.hidden) return hideGlow();
        if (!glow) {
            glow = document.createElement('canvas');
            glow.id = 'page-background-glow';
            glow.setAttribute('aria-hidden', 'true');
            surface.after(glow);
            glowContext = glow.getContext('2d');
        }
        const width = Math.min(glowSize, surface.width);
        const height = Math.min(glowSize, surface.height);
        if (glow.width !== width) glow.width = width;
        if (glow.height !== height) glow.height = height;
        const originX = Math.max(0, Math.min((pointer.column - outerRadius),
            Math.floor((surface.width - width) / cellSize))) * cellSize;
        const originY = Math.max(0, Math.min((pointer.row - outerRadius),
            Math.floor((surface.height - height) / cellSize))) * cellSize;
        glow.style.transform = `translate(${originX}px, ${originY}px)`;
        glow.style.display = 'block';
        glowContext.clearRect(0, 0, width, height);
        glowContext.imageSmoothingEnabled = false;
        hoveredGlyphs.clear();
        for (let y = 0; y < height; y += cellSize) {
            for (let x = 0; x < width; x += cellSize) {
                const dx = (originX + x) / cellSize - pointer.column;
                const dy = (originY + y) / cellSize - pointer.row;
                const distanceSquared = dx * dx + dy * dy;
                const ring = ringRadiiSquared.findIndex(radius => distanceSquared <= radius);
                if (ring < 0) continue;
                const index = ((originY + y) / cellSize % rows) * columns + ((originX + x) / cellSize % columns);
                hoveredGlyphs.add(index);
                glowContext.globalAlpha = brightness[ring];
                glowContext.drawImage(atlas, (values[index] & 15) * cellSize, 0, cellSize, cellSize,
                    x, y, cellSize, cellSize);
            }
        }
        // Keep gaps and the logo transparent; mask only the actual interface panels.
        if (!panelRects) panelRects = panels.map(panel => panel.getBoundingClientRect());
        for (const rect of panelRects) {
            const left = Math.floor(rect.left - originX);
            const top = Math.floor(rect.top - originY);
            glowContext.clearRect(left, top, Math.ceil(rect.right - originX) - left, Math.ceil(rect.bottom - originY) - top);
        }
    };
    const queueGlow = () => {
        if (glowFrame !== undefined) return;
        glowFrame = requestAnimationFrame(() => {
            glowFrame = undefined;
            paintGlow();
        });
    };
    document.addEventListener('mousemove', event => {
        if (!hoverMedia.matches || !revealed) return;
        const column = Math.floor(event.clientX / cellSize);
        const row = Math.floor(event.clientY / cellSize);
        if (pointer && pointer.column === column && pointer.row === row) return;
        pointer = { column, row };
        queueGlow();
    });
    document.addEventListener('mouseout', event => {
        if (!event.relatedTarget) hideGlow();
    });
    window.addEventListener('blur', hideGlow);
    window.addEventListener('scroll', invalidatePanels, { passive: true });
    onMediaChange(hoverMedia, hideGlow);

    const changed = new Set();
    const updateGlyphs = () => {
        changed.clear();
        while (changed.size < 20) changed.add(Math.floor(Math.random() * values.length));
        let refreshGlow = false;
        for (const i of changed) {
            if (hoveredGlyphs.has(i)) refreshGlow = true;
            values[i] = ((values[i] & 15) + 1 + Math.floor(Math.random() * 15)) & 15;
            drawCell(tileContext, i);
            paintRegion((i % columns) * cellSize, Math.floor(i / columns) * cellSize, cellSize, cellSize);
        }
        if (pointer && refreshGlow) queueGlow();
    };

    let timer;
    let revealed = false;
    const scheduleUpdates = () => {
        clearInterval(timer);
        timer = undefined;
        if (document.hidden) hideGlow();
        if (revealed && !document.hidden && !reducedMotion.matches) {
            timer = setInterval(updateGlyphs, 1000);
        }
    };
    document.addEventListener('visibilitychange', scheduleUpdates);
    onMediaChange(reducedMotion, scheduleUpdates);
    window.addEventListener('pagehide', () => { clearInterval(timer); hideGlow(); });
    window.addEventListener('pageshow', scheduleUpdates);

    const blockSize = 8;
    const tileColumns = tileWidth / blockSize;
    const blocks = Uint16Array.from({ length: tileColumns * tileHeight / blockSize }, (_, i) => i);
    for (let i = blocks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }
    const started = performance.now();
    let count = 0;
    const tick = now => {
        const progress = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, (now - started) / revealDuration));
        const target = Math.floor(blocks.length * Math.floor(progress * 8) / 8);
        const changed = count < target;
        while (count < target) {
            const block = blocks[count++];
            const x = (block % tileColumns) * blockSize;
            const y = Math.floor(block / tileColumns) * blockSize;
            tileContext.drawImage(full, x, y, blockSize, blockSize, x, y, blockSize, blockSize);
        }
        if (changed) paintAll();
        if (progress < 1) requestAnimationFrame(tick);
        else {
            // The full reveal source is no longer needed after the initial animation.
            full.width = full.height = 0;
            revealed = true;
            scheduleUpdates();
        }
    };
    requestAnimationFrame(tick);
}
