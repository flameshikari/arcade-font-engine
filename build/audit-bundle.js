import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { unsupported } from './compatibility.js';

const traverse = traverseModule.default || traverseModule;
const APIs = {
    ResizeObserver: ['resizeobserver', 'resizeObserver'],
    PointerEvent: ['pointer', 'pointerEvents'],
    IntersectionObserver: ['intersectionobserver'],
    AbortController: ['abortcontroller'],
    fetch: ['fetch'],
    MutationObserver: ['mutationobserver'],
    requestAnimationFrame: ['requestanimationframe'],
    matchMedia: ['matchmedia'],
    Worker: ['webworkers'],
    WebSocket: ['websockets'],
};

// Inspect the final bundle, so browser APIs in dependencies are checked too.
export function auditBundle(code, profile) {
    const used = new Set();
    traverse(parse(code, { sourceType: 'script' }), {
        ReferencedIdentifier(path) {
            const name = path.node.name;
            if (APIs[name] && !path.scope.hasBinding(name)) used.add(name);
        },
        MemberExpression(path) {
            const { object, property, computed } = path.node;
            if (object.type !== 'Identifier' || !['window', 'globalThis', 'self'].includes(object.name)) return;
            const name = computed && property.type === 'StringLiteral' ? property.value : property.name;
            if (APIs[name]) used.add(name);
        },
    });
    for (const name of used) {
        const [feature, polyfill] = APIs[name];
        const affected = unsupported(profile.browsers, feature);
        if (affected.length && !(polyfill && profile[polyfill])) {
            throw new Error(`Bundle uses ${name} without a polyfill for: ${affected.join(', ')}`);
        }
    }
    return [...used];
}
