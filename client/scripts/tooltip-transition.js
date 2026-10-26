import { captionMosaic } from './menu-transition.js';

const duration = 150;
const effects = new WeakMap();

export function setTooltip(element, visible) {
    let state = effects.get(element);
    if (!state) {
        state = { value: 0, wanted: false };
        effects.set(element, state);
    }
    if (state.wanted === visible) return;
    state.wanted = visible;
    cancelAnimationFrame(state.frame);
    const target = visible ? 1 : 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        state.value = target;
        element.style.display = visible ? 'block' : 'none';
        return;
    }
    element.style.display = 'block';
    const effect = captionMosaic(element, visible, 16);
    const start = state.value;
    const started = performance.now();
    const tick = now => {
        const progress = Math.max(0, Math.min(1, (now - started) / duration));
        state.value = start + (target - start) * progress;
        effect.tick(state.value);
        if (progress < 1) state.frame = requestAnimationFrame(tick);
        else {
            element.style.display = visible ? 'block' : 'none';
            element.style.removeProperty('clip-path');
            element.style.removeProperty('-webkit-clip-path');
            state.frame = undefined;
        }
    };
    tick(started);
}
