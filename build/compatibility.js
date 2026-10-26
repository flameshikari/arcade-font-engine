import browserslist from 'browserslist';
import esbuildTargets from 'browserslist-to-esbuild';
import { feature } from 'caniuse-lite';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// Native primitives used by the UI that cannot be faithfully polyfilled.
const primitives = [
    'canvas', 'canvas-text', 'flexbox', 'css-variables', 'css-masks',
    'css-clip-path', 'mutationobserver', 'requestanimationframe', 'matchmedia',
    'css-supports-api',
];

export function unsupported(browsers, name) {
    const stats = feature(require(`caniuse-lite/data/features/${name}.js`)).stats;
    return browsers.filter(browser => {
        const [engine, version] = browser.split(' ');
        // Partial/prefixed support is handled by our explicit CSS/JS fallbacks.
        return !/^[ya]/.test(stats[engine]?.[version] || '');
    });
}

export function resolveCompatibility(query) {
    const browsers = browserslist(query);
    if (!browsers.length) throw new Error('Browserslist selected no browsers.');
    const missing = primitives.flatMap(name => {
        const affected = unsupported(browsers, name);
        return affected.length ? [`${name}: ${affected.join(', ')}`] : [];
    });
    if (missing.length) {
        throw new Error('Selected browsers lack required native capabilities:\n' + missing.join('\n'));
    }
    return {
        browsers,
        targets: esbuildTargets(browsers),
        resizeObserver: unsupported(browsers, 'resizeobserver').length > 0,
        pointerEvents: unsupported(browsers, 'pointer').length > 0,
        domMethods: unsupported(browsers, 'dom-manip-convenience').length > 0,
    };
}

export function browserPolyfills(profile) {
    const imports = [];
    if (profile.resizeObserver) imports.push(
        "import ResizeObserver from 'resize-observer-polyfill';",
        "if (!window.ResizeObserver) window.ResizeObserver = ResizeObserver;",
    );
    if (profile.domMethods) imports.unshift("import 'dom4';");
    if (profile.pointerEvents) imports.push("import 'pepjs';");
    return imports.join('\n');
}
