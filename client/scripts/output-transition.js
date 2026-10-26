import { loadImage } from './compat.js';

export const transitionDuration = 330;
const transitions = new WeakMap();

export async function transitionOutput(image, src) {
    if (!transitions.has(image)) {
        transitions.set(image, { frame: null, surface: null, generation: 0 });
    }
    const state = transitions.get(image);
    const current = ++state.generation;
    const next = await loadImage(src);
    if (current !== state.generation) return;

    if (!state.surface && (!image.complete || !image.naturalWidth || image.src === src)) {
        image.src = src;
        return;
    }

    const previous = document.createElement('canvas');
    const source = state.surface || image;
    previous.width = source.naturalWidth || source.width;
    previous.height = source.naturalHeight || source.height;
    const previousContext = previous.getContext('2d');
    previousContext.imageSmoothingEnabled = false;
    previousContext.drawImage(source, 0, 0);
    cancelAnimationFrame(state.frame);

    if (!state.surface) {
        state.surface = document.createElement('canvas');
        state.surface.className = 'output-transition';
        if (image.classList.contains('littleshake')) state.surface.classList.add('littleshake');
        if (image.id === 'title') state.surface.classList.add('output-transition-title');
        if (image.classList.contains('pointer')) state.surface.classList.add('pointer');
        state.surface.setAttribute('aria-hidden', 'true');
        image.before(state.surface);
        image.style.display = 'none';
    }
    const canvas = state.surface;
    canvas.width = Math.max(previous.width, next.width);
    canvas.height = Math.max(previous.height, next.height);
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    const blockSize = Math.max(2, Math.round(Math.min(previous.height, next.height) / 8));
    const columns = Math.ceil(canvas.width / blockSize);
    const rows = Math.ceil(canvas.height / blockSize);
    const tiles = Array.from({ length: columns * rows }, (_, index) => index);
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    const oldX = Math.floor((canvas.width - previous.width) / 2);
    const oldY = Math.floor((canvas.height - previous.height) / 2);
    const newX = Math.floor((canvas.width - next.width) / 2);
    const newY = Math.floor((canvas.height - next.height) / 2);
    context.drawImage(previous, oldX, oldY);
    const started = performance.now();
    let revealed = 0;

    const tick = now => {
        const progress = Math.max(0, Math.min(1, (now - started) / transitionDuration));
        if (progress === 1) {
            image.src = src;
            image.style.removeProperty('display');
            canvas.remove();
            state.surface = null;
            state.frame = null;
            return;
        }
        // Eight discrete stages, matching a pixel-mask reveal rather than a fade.
        const count = Math.floor(tiles.length * Math.floor(progress * 8) / 8);
        while (revealed < count) {
            const tile = tiles[revealed++];
            const x = (tile % columns) * blockSize;
            const y = Math.floor(tile / columns) * blockSize;
            context.clearRect(x, y, blockSize, blockSize);
            context.save();
            context.beginPath();
            context.rect(x, y, blockSize, blockSize);
            context.clip();
            context.drawImage(next, newX, newY);
            context.restore();
        }
        state.frame = requestAnimationFrame(tick);
    };
    tick(started);
}
