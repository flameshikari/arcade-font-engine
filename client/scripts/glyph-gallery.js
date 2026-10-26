import BiggerPicture from 'bigger-picture';
import { render } from './renderer.js';
import { loadImage } from './compat.js';
import { mediaMosaic, setSourceVisibility, showSourceImmediately } from './gallery-transition.js';
import { captionMosaic } from './menu-transition.js';
import { createColorPicker } from './color-picker.js';
import { setBackdrop } from './backdrop-transition.js';
import { transitionDuration } from './output-transition.js';

let viewer;
let request = 0;
let hiddenSource;
let colorPicker;
let interfaceFrame;
let interfaceProgress = 0;

function animateInterface(container, entering) {
    cancelAnimationFrame(interfaceFrame);
    const elements = [...container.querySelectorAll('.bp-controls button, .gallery-color')];
    const effects = elements.map(element => captionMosaic(element, entering, 4));
    const start = interfaceProgress;
    const target = entering ? 1 : 0;
    const started = performance.now();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = now => {
        const progress = reduced ? 1 : Math.min(1, (now - started) / transitionDuration);
        interfaceProgress = start + (target - start) * progress;
        effects.forEach(effect => effect.tick(interfaceProgress));
        if (progress < 1) interfaceFrame = requestAnimationFrame(tick);
    };
    tick(started);
}

const restoreSource = (animate = true) => {
    if (hiddenSource) {
        if (animate) setSourceVisibility(hiddenSource, true);
        else showSourceImmediately(hiddenSource);
    }
    hiddenSource = undefined;
};

const setActiveSource = (container, item, transferring = false) => {
    if (hiddenSource === item.element) return;
    restoreSource();
    hiddenSource = item.element;
    if (transferring) {
        hiddenSource.classList.add('gallery-source-hidden');
        const sibling = hiddenSource.previousElementSibling;
        if (sibling?.classList.contains('output-transition')) sibling.classList.add('gallery-source-hidden');
    } else setSourceVisibility(hiddenSource, false);
};

export function initGlyphGallery(previews, getOptions, getOutputOptions) {
    const glyphs = document.getElementById('glyphs');
    const images = Object.keys(previews).map(id => document.getElementById(id));
    for (const image of images) {
        image.tabIndex = 0;
        image.setAttribute('role', 'button');
        image.alt = image.id + ' glyphs';
        image.classList.add('littleshake');
    }

    const output = document.getElementById('output');
    output.alt = 'Output';
    output.classList.add('littleshake');
    const outputLink = document.getElementById('blank');
    outputLink.removeAttribute('target');
    outputLink.setAttribute('role', 'button');
    outputLink.setAttribute('aria-haspopup', 'dialog');

    const open = async (image, sources = images, options = getOptions(), wheel) => {
        const current = ++request;
        document.body.classList.add('glyph-gallery-opening');
        try {
            const loadedImages = new Map();
            const origins = new Map(sources.map(element => {
                const sibling = element.previousElementSibling;
                const source = sibling?.classList.contains('output-transition') ? sibling : element;
                const rect = source.getBoundingClientRect();
                return [element, { left: rect.left, top: rect.top, width: rect.width, height: rect.height }];
            }));
            const items = await Promise.all(sources.map(async element => {
                const src = await render({ ...options, text: previews[element.id] || options.text });
                const loaded = await loadImage(src);
                loadedImages.set(src, loaded);
                return {
                    img: src,
                    thumb: src,
                    element,
                    width: loaded.naturalWidth,
                    height: loaded.naturalHeight,
                    alt: element.alt,
                    caption: element.id === 'output' ? options.text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character])) : element.alt,
                    upscale: 8,
                    pixelSize: options.size,
                    origin: origins.get(element),
                };
            }));
            if (current !== request) return;
            if (!viewer) {
                const target = document.createElement('div');
                target.className = 'glyph-gallery';
                document.body.append(target);
                viewer = BiggerPicture({ target });
            }
            let baseArmedAt = performance.now();
            let lastWheelAt = 0;
            let viewedItem;
            viewer.open({
                items,
                position: sources.indexOf(image),
                clickZoom: 2,
                maxZoom: 8,
                zoomDuration: transitionDuration,
                transitionDuration: 0,
                intro: 'pixels',
                freePan: true,
                captionTransition: captionMosaic,
                mediaTransition: (node, entering, transferring) => {
                    if (entering && transferring) return { duration: 0, tick() {} };
                    return mediaMosaic(node, entering, loadedImages, transferring ? items : undefined);
                },
                onOpen: (container, item) => {
                    viewedItem = item;
                    // PEP uses this attribute to enable touch dragging on older iOS.
                    container.setAttribute('touch-action', 'none');
                    document.body.classList.add('glyph-gallery-open');
                    setBackdrop(container.firstElementChild, true);
                    setActiveSource(container, item, true);
                    colorPicker?.destroy();
                    colorPicker = createColorPicker(container, loadedImages);
                    colorPicker.setItem(item);
                    if (wheel) {
                        baseArmedAt = null;
                        lastWheelAt = performance.now();
                        requestAnimationFrame(() => {
                            item.zoomBy(Math.max(0.1, Math.min(1, -wheel.deltaY / 300)), wheel);
                        });
                    }
                    for (const [selector, text] of [['.bp-prev', '‹'], ['.bp-next', '›'], ['.bp-x', '×']]) {
                        const button = container.querySelector(selector);
                        if (button) button.textContent = text;
                    }
                    interfaceProgress = 0;
                    animateInterface(container, true);
                },
                onWheel: (event, item) => {
                    const now = performance.now();
                    const gap = now - lastWheelAt;
                    lastWheelAt = now;
                    if (event.deltaY < 0) { baseArmedAt = null; return false; }
                    if (event.deltaY <= 0) return false;
                    const ratio = item.zoomRatio;
                    if (ratio <= 1.01) {
                        if (baseArmedAt === null) baseArmedAt = now;
                        else if (now - baseArmedAt >= 250 && gap >= 180) viewer.close();
                        return true;
                    }
                    if (ratio * (1 - event.deltaY / 300) <= 1.01 && baseArmedAt === null) baseArmedAt = now;
                    return false;
                },
                onUpdate: (container, item) => {
                    const rect = viewedItem?.viewRect;
                    if (viewedItem !== item && rect) {
                        item.initialViewRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
                    }
                    viewedItem = item;
                    baseArmedAt = performance.now();
                    lastWheelAt = 0;
                    setActiveSource(container, item);
                    colorPicker?.setItem(item);
                },
                onClose: container => {
                    animateInterface(container, false);
                    setBackdrop(container.firstElementChild, false);
                },
                onClosed: () => {
                    cancelAnimationFrame(interfaceFrame);
                    colorPicker?.destroy();
                    colorPicker = undefined;
                    restoreSource(false);
                    document.body.classList.remove('glyph-gallery-open');
                },
            });
        } finally {
            if (current === request) document.body.classList.remove('glyph-gallery-opening');
        }
    };
    let wheelOpening = false;
    const wheelOpen = async (event, image, sources, options) => {
        if (event.deltaY >= 0 || event.ctrlKey) return;
        event.preventDefault();
        if (wheelOpening) return;
        wheelOpening = true;
        try {
            await open(image, sources, options, {
                deltaY: event.deltaY,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        } finally {
            wheelOpening = false;
        }
    };
    outputLink.addEventListener('wheel', event => wheelOpen(event, output, [output], getOutputOptions()), { passive: false });
    glyphs.addEventListener('wheel', event => {
        const image = images.includes(event.target) ? event.target :
            event.target.classList.contains('output-transition') ? event.target.nextElementSibling : null;
        if (images.includes(image)) wheelOpen(event, image, images, getOptions());
    }, { passive: false });
    outputLink.addEventListener('click', event => {
        event.preventDefault();
        open(output, [output], getOutputOptions());
    });
    outputLink.addEventListener('keydown', event => {
        if (event.key === ' ') {
            event.preventDefault();
            open(output, [output], getOutputOptions());
        }
    });
    glyphs.addEventListener('click', event => {
        const image = images.includes(event.target) ? event.target :
            event.target.classList.contains('output-transition') ? event.target.nextElementSibling : null;
        if (images.includes(image)) open(image);
    });
    glyphs.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && images.includes(event.target)) {
            event.preventDefault();
            open(event.target);
        }
    });
}
