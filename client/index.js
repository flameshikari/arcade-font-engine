#!/usr/bin/env node

import esbuild from 'esbuild';
import esbuildBabel from '@chialab/esbuild-plugin-babel';
import esbuildBrowserlist from 'browserslist-to-esbuild';
import htmlPlugin from '@chialab/esbuild-plugin-html';


const babelOpts = {
    presets: [
        [
            '@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: '3.37.1',
                modules: false,
            },
        ],
    ],
};

const esbuildOpts = {
    target: esbuildBrowserlist(),
    minify: true,
    outdir: 'public',
    splitting: true,
    loader: {
        '.ttf': 'dataurl',
        '.png': 'dataurl',
        '.gif': 'dataurl',
    },
    format: 'esm',
    bundle: true,
    treeShaking: true,
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
        esbuildBabel(babelOpts),
        htmlPlugin({
            minifyOptions: minifyOptions,
        }),
    ],
});
