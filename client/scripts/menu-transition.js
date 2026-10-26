import { loadImage } from './compat.js';
import { transitionDuration } from './output-transition.js';

let generation = 0;
let frame;

function getMasks(width, height, disappearing, initial) {
    const pending = (async () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        const size = Math.max(4, Math.round(height / 24));
        const columns = Math.ceil(width / size);
        const tiles = Array.from({ length: columns * Math.ceil(height / size) }, (_, i) => i);
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
        if (disappearing) {
            if (initial) context.drawImage(initial, 0, 0, width, height);
            else context.fillRect(0, 0, width, height);
        }
        const urls = [canvas.toDataURL('image/png')];
        let count = 0;
        for (let stage = 1; stage <= 8; stage++) {
            const target = Math.floor(tiles.length * stage / 8);
            while (count < target) {
                const tile = tiles[count++];
                const x = (tile % columns) * size;
                const y = Math.floor(tile / columns) * size;
                if (disappearing) context.clearRect(x, y, size, size);
                else context.fillRect(x, y, size, size);
            }
            urls.push(canvas.toDataURL('image/png'));
        }
        // Decode every mask before use; create a fresh random order on every opening.
        const images = await Promise.all(urls.map(loadImage));
        return images;
    })();
    return pending;
}

export function cancelMenuReveal(element) {
    generation++;
    cancelAnimationFrame(frame);
    element.style.removeProperty('visibility');
    element.classList.remove('menu-closing');
    for (const name of ['mask-image', '-webkit-mask-image', 'mask-size', '-webkit-mask-size']) {
        element.style.removeProperty(name);
    }
}

async function animateMenu(element, visible, onStart) {
    const previousMask = element.style.maskImage || element.style.webkitMaskImage;
    const wasHidden = element.style.visibility === 'hidden';
    cancelMenuReveal(element);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || (!visible && wasHidden)) { onStart?.(); return; }
    const current = generation;
    if (visible) element.style.visibility = 'hidden';
    else {
        element.classList.add('menu-closing');
        if (previousMask) {
            element.style.setProperty('mask-image', previousMask);
            element.style.setProperty('-webkit-mask-image', previousMask);
        }
    }
    const rect = element.getBoundingClientRect();
    let images;
    try {
        const initial = !visible && previousMask?.startsWith('url("') ?
            await loadImage(previousMask.slice(5, -2)) : undefined;
        images = await getMasks(Math.ceil(rect.width), Math.ceil(rect.height), !visible, initial);
    } catch {
        if (current === generation) { cancelMenuReveal(element); onStart?.(); }
        return;
    }
    if (current !== generation) return;
    const apply = stage => {
        const value = `url("${images[stage].src}")`;
        element.style.setProperty('mask-image', value);
        element.style.setProperty('-webkit-mask-image', value);
    };
    element.style.setProperty('mask-size', '100% 100%');
    element.style.setProperty('-webkit-mask-size', '100% 100%');
    apply(0);
    element.style.removeProperty('visibility');
    onStart?.();
    const started = performance.now();
    let lastStage = 0;
    const tick = now => {
        if (current !== generation) return;
        const progress = Math.max(0, Math.min(1, (now - started) / transitionDuration));
        const stage = Math.floor(progress * 8);
        if (stage !== lastStage) { apply(stage); lastStage = stage; }
        if (progress < 1) frame = requestAnimationFrame(tick);
        else cancelMenuReveal(element);
    };
    frame = requestAnimationFrame(tick);
}

export const revealMenu = (element, onStart) => animateMenu(element, true, onStart);
export const concealMenu = (element, onStart) => animateMenu(element, false, onStart);

// Clip live text into hard-edged tiles without rasterizing it or shifting layout.
export function captionMosaic(element, entering, blockSize) {
    const rect = element.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const size = blockSize || Math.max(2, Math.round(height / 8));
    const columns = Math.ceil(width / size);
    const tiles = Array.from({ length: columns * Math.ceil(height / size) }, (_, i) => i);
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    const paths = ['polygon(0px 0px, 0px 0px, 0px 0px)'];
    const points = ['0px 0px'];
    let count = 0;
    for (let stage = 1; stage < 8; stage++) {
        const target = Math.floor(tiles.length * stage / 8);
        while (count < target) {
            const tile = tiles[count++];
            const x = (tile % columns) * size;
            const y = Math.floor(tile / columns) * size;
            const right = Math.min(width, x + size);
            const bottom = Math.min(height, y + size);
            // Each rectangle returns along the same zero-area bridge to the origin.
            points.push(`${x}px ${y}px`, `${right}px ${y}px`, `${right}px ${bottom}px`,
                `${x}px ${bottom}px`, `${x}px ${y}px`, '0px 0px');
        }
        paths.push('polygon(' + points.join(',') + ')');
    }
    paths.push('none');
    let lastStage;
    return {
        duration: transitionDuration,
        tick(progress) {
            const stage = Math.max(0, Math.min(8, Math.floor(progress * 8)));
            if (stage === lastStage) return;
            element.style.setProperty('clip-path', paths[stage]);
            element.style.setProperty('-webkit-clip-path', paths[stage]);
            if (entering && stage === 8) {
                element.style.removeProperty('clip-path');
                element.style.removeProperty('-webkit-clip-path');
            }
            lastStage = stage;
        },
    };
}
