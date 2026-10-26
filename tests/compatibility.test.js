import { auditBundle } from '../build/audit-bundle.js';
import { describe, test, expect } from 'bun:test';
import { transformAsync } from '@babel/core';
import postcss from 'postcss';
import presetEnv from 'postcss-preset-env';
import { resolveCompatibility, browserPolyfills } from '../build/compatibility.js';

describe('Browserslist-driven compatibility', () => {
    test('old iOS receives observer and touch/pointer shims', () => {
        const profile = resolveCompatibility(['ios_saf 10.3']);
        expect(profile.resizeObserver).toBe(true);
        expect(profile.pointerEvents).toBe(true);
        expect(browserPolyfills(profile)).toContain('resize-observer-polyfill');
        expect(browserPolyfills(profile)).toContain('pepjs');
    });
    test('modern-only targets omit obsolete DOM shims', () => {
        const profile = resolveCompatibility(['Chrome 140']);
        expect(browserPolyfills(profile)).toBe('');
    });
    test('older DOM manipulation methods are supplied when necessary', () => {
        expect(browserPolyfills(resolveCompatibility(['Safari 9.1']))).toContain('dom4');
    });
    test('impossible native capabilities fail explicitly', () => {
        expect(() => resolveCompatibility(['IE 11'])).toThrow('css-variables');
        expect(() => resolveCompatibility([])).toThrow('no browsers');
    });
    test('core-js entry and syntax transforms follow the selected browser', async () => {
        const compile = targets => transformAsync(
            "import 'core-js/stable'; const value = globalThis.sample?.text ?? 'fallback'; async function run() { return Promise.any([value]); }",
            { configFile: false, babelrc: false, presets: [['@babel/preset-env', {
                targets, useBuiltIns: 'entry', corejs: '3.51.0', modules: false,
            }]] },
        );
        const old = (await compile(['ios_saf 10.3'])).code;
        const modern = (await compile(['Chrome 140'])).code;
        expect(old).toContain('core-js/modules/es.promise.any.js');
        expect(modern).not.toContain('core-js/modules/es.promise.any.js');
        expect(old).not.toContain('?.');
        expect(old).not.toContain('async function run');
        expect(modern).toContain('?.');
    });
    test('final dependency bundles cannot introduce unpolyfilled browser APIs', () => {
        const old = resolveCompatibility(['ios_saf 10.3']);
        expect(() => auditBundle('new ResizeObserver(function () {});', old)).not.toThrow();
        expect(() => auditBundle('new IntersectionObserver(function () {});', old)).toThrow('IntersectionObserver');
        expect(() => auditBundle('new IntersectionObserver(function () {});', resolveCompatibility(['Chrome 140']))).not.toThrow();
    });
    test('CSS prefixes and fallbacks follow Browserslist', async () => {
        const source = '.sample { user-select: none; color: rgb(0 0 0 / 50%); }';
        const compile = browsers => postcss([presetEnv({ browsers, stage: 2, preserve: true })])
            .process(source, { from: undefined });
        expect((await compile(['ios_saf 10.3'])).css).toContain('-webkit-user-select');
        expect((await compile(['Chrome 140'])).css).not.toContain('-webkit-user-select');
    });
});
