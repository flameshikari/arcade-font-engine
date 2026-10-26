import { transitionDuration } from './output-transition.js';

const effects = new WeakMap();
const fullDuration = transitionDuration;
const stepSize = 0.2;

export function setBackdrop(element, visible) {
    let effect = effects.get(element);
    if (!effect) {
        effect = { value: 0 };
        effects.set(element, effect);
    }
    cancelAnimationFrame(effect.frame);
    element.classList.add('stepped-backdrop');
    const start = effect.value;
    const target = visible ? 1 : 0;
    const steps = Math.round(Math.abs(target - start) / stepSize);
    const duration = steps ? fullDuration : 0;
    const direction = visible ? 1 : -1;
    const instant = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const started = performance.now();
    const tick = now => {
        const progress = instant || !duration ? 1 : Math.max(0, Math.min(1, (now - started) / duration));
        const value = progress === 1 ? target :
            Number((start + direction * Math.floor(progress * steps) * stepSize).toFixed(1));
        if (value !== effect.value || !element.style.getPropertyValue('--backdrop-step')) {
            effect.value = value;
            element.style.setProperty('--backdrop-step', String(value));
        }
        if (progress < 1) effect.frame = requestAnimationFrame(tick);
    };
    tick(started);
}
