#!/usr/bin/env node

import esbuild from 'esbuild';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, unlink, mkdir } from 'node:fs/promises';
import path from 'node:path';
import esbuildBabel from '@chialab/esbuild-plugin-babel';
import esbuildBrowserlist from 'browserslist-to-esbuild';
import htmlPlugin from '@chialab/esbuild-plugin-html';

const assetName = (file, content) =>
    'assets/' + createHash('sha256').update(content).digest('hex').slice(0, 8) + path.extname(file).toLowerCase();
const listFiles = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async entry => {
        const file = path.posix.join(dir, entry.name);
        return entry.isDirectory() ? listFiles(file) : [file];
    }));
    return files.flat();
};

// Assign static URLs before bundling so dynamically loaded fonts and bubble parts
// use the same names as the server-side renderer.
const assetMap = Object.fromEntries(await Promise.all((await listFiles('client/static')).map(async file => {
    const original = file.slice('client/static/'.length);
    return [original, assetName(original, await readFile(file))];
})));

const isProd = process.env.NODE_ENV === 'production';

const babelOpts = {
    presets: [
        [
            '@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: '3.51.0',
                modules: false,
            },
        ],
    ],
};

const esbuildOpts = {
    target: esbuildBrowserlist(),
    minify: isProd,
    outdir: 'public',
    splitting: true,
    loader: {
        '.ttf': 'dataurl',
        '.png': 'dataurl',
        '.gif': 'dataurl',
    },
    format: 'esm',
    bundle: true,
    treeShaking: isProd,
    write: true,
    legalComments: 'none',
    assetNames: '[name]',
    chunkNames: 'assets/[name]-[hash]',
};

const minifyOptions = {
    normalizeAttributeValues: true,
    removeEmptyAttributes: true,
    collapseAttributeWhitespace: true,
    removeRedundantAttributes: false,
    deduplicateAttributeValues: true,
    minifyUrls: true,
    sortAttributes: true,
    sortAttributesWithLists: 'alphabetical',
    collapseWhitespace: 'conservative',
    removeComments: 'safe',
    minifyConditionalComments: true,
    removeOptionalTags: true,
    removeAttributeQuotes: true,
};


await esbuild.build({
    ...esbuildOpts,
    entryPoints: ['./client/index.html'],
    plugins: [
        {
            name: 'static-asset-map',
            setup(build) {
                build.onResolve({ filter: /^#assets$/ }, () => ({ path: '#assets', namespace: 'asset-map' }));
                build.onLoad({ filter: /.*/, namespace: 'asset-map' }, () => ({
                    contents: 'export default ' + JSON.stringify(assetMap),
                    loader: 'js',
                }));
            },
        },
        esbuildBabel(
            babelOpts,
        ),
        htmlPlugin({
            minifyOptions: isProd ? minifyOptions : {},
        }),
    ],
});

// Hash final output bytes, resolving referenced assets before hashing their parent.
const outputs = new Map(await Promise.all((await listFiles('public')).map(async file => [
    file.slice('public/'.length), await readFile(file),
])));
const finalFiles = new Map();
const resolving = new Set();
const escapeRegExp = value => value.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&');
const finalize = (file) => {
    if (finalFiles.has(file)) return finalFiles.get(file);
    if (resolving.has(file)) throw new Error('Circular asset references: ' + file);
    resolving.add(file);
    let content = outputs.get(file);
    if (/\.(html|css|js)$/.test(file)) {
        const text = content.toString('utf8');
        const references = new Map();
        for (const original of outputs.keys()) {
            if (original === file || original === 'index.html') continue;
            // Dynamic image paths are resolved by the bundled static asset map.
            if (file.endsWith('.js') && original.startsWith('images/')) continue;
            const relative = path.posix.relative(path.posix.dirname(file), original);
            references.set('/' + original, { original, prefix: '/' });
            references.set('./' + relative, { original, prefix: './' });
            references.set(relative, { original, prefix: './' });
        }
        if (references.size) {
            const pattern = new RegExp([...references.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp).join('|'), 'g');
            content = Buffer.from(text.replace(pattern, match => {
                const { original, prefix } = references.get(match);
                const target = finalize(original).name;
                if (prefix === '/') return '/' + target;
                const destinationDir = file === 'index.html' ? '.' : 'assets';
                return './' + path.posix.relative(destinationDir, target);
            }));
        }
    }
    const name = file === 'index.html' ? file : assetName(file, content);
    const result = { name, content };
    finalFiles.set(file, result);
    resolving.delete(file);
    return result;
};
for (const file of outputs.keys()) finalize(file);
const byName = new Map();
for (const [original, { name, content }] of finalFiles) {
    if (byName.has(name) && !byName.get(name).equals(content)) {
        throw new Error('Asset SHA-256 prefix collision: ' + name);
    }
    byName.set(name, content);
    if (original !== 'index.html') assetMap[original] = name;
}
for (const original of outputs.keys()) await unlink('public/' + original);
await mkdir('public/assets', { recursive: true });
for (const [name, content] of byName) await writeFile('public/' + name, content);
await writeFile('public/asset-manifest.json', JSON.stringify(assetMap));
