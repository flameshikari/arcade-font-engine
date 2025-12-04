#!/usr/bin/env node

import esbuild from 'esbuild';
import esbuildBabel from '@chialab/esbuild-plugin-babel';
import esbuildBrowserlist from 'browserslist-to-esbuild';
import htmlPlugin from '@chialab/esbuild-plugin-html';

const isProd = process.env.NODE_ENV === 'production';

const babelOpts = {
    presets: [
        [
            '@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: '3.47.0',
                modules: false,
            },
        ],
    ],
};

const esbuildOpts = {
    target: esbuildBrowserlist(),
    minify: isProd ? true : false,
    outdir: 'public',
    splitting: true,
    loader: {
        '.ttf': 'dataurl',
        '.png': 'dataurl',
        '.gif': 'dataurl',
    },
    format: 'esm',
    bundle: true,
    treeShaking: isProd ? true : false,
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
        esbuildBabel(
            isProd ? babelOpts : {},
        ),
        htmlPlugin({
            minifyOptions: isProd ? minifyOptions : {},
        }),
    ],
});
