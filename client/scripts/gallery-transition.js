import { transitionDuration } from './output-transition.js';

const mediaEffects = new WeakMap();
const sourceEffects = new WeakMap();

function createMosaic(source, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    const snapshot = document.createElement('canvas');
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    const snapshotContext = snapshot.getContext('2d');
    snapshotContext.imageSmoothingEnabled = false;
    snapshotContext.drawImage(source, 0, 0, snapshot.width, snapshot.height);
    const size = Math.max(2, Math.round(canvas.height / 8));
    const columns = Math.ceil(canvas.width / size);
    const tiles = Array.from({ length: columns * Math.ceil(canvas.height / size) }, (_, i) => i);
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    let visible = 0;
    return {
        canvas,
        paint(progress) {
            const target = Math.floor(tiles.length * Math.floor(progress * 8) / 8);
            if (target === tiles.length) {
                context.drawImage(snapshot, 0, 0);
                visible = target;
                return;
            }
            while (visible !== target) {
                const adding = target > visible;
                const tile = tiles[adding ? visible++ : --visible];
                const x = (tile % columns) * size;
                const y = Math.floor(tile / columns) * size;
                const width = Math.min(size, canvas.width - x);
                const height = Math.min(size, canvas.height - y);
                if (adding) context.drawImage(snapshot, x, y, width, height, x, y, width, height);
                else context.clearRect(x, y, width, height);
            }
        },
    };
}

function createPixelTransfer(source, origin, destination, viewport, pixelSize) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.ceil(viewport.width));
    canvas.height = Math.max(1, Math.ceil(viewport.height));
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    const readback = document.createElement('canvas');
    readback.width = source.naturalWidth;
    readback.height = source.naturalHeight;
    const readContext = readback.getContext('2d');
    readContext.drawImage(source, 0, 0);
    const data = readContext.getImageData(0, 0, readback.width, readback.height).data;
    const size = pixelSize * Math.max(1, Math.ceil(Math.sqrt(
        source.naturalWidth * source.naturalHeight / (pixelSize * pixelSize * 4096))));
    const parts = [];
    for (let y = 0; y < source.naturalHeight; y += size) {
        for (let x = 0; x < source.naturalWidth; x += size) {
            const width = Math.min(size, source.naturalWidth - x);
            const height = Math.min(size, source.naturalHeight - y);
            let opaque = false;
            for (let row = y; row < y + height && !opaque; row++) {
                for (let col = x; col < x + width; col++) {
                    if (data[(row * source.naturalWidth + col) * 4 + 3]) { opaque = true; break; }
                }
            }
            if (opaque) parts.push({ x, y, width, height, delay: Math.random() * 0.3, arc: (Math.random() - 0.5) * 32 });
        }
    }
    readback.width = readback.height = 0;
    let lastStep;
    return {
        canvas,
        paint(progress) {
            const step = Math.max(0, Math.min(12, Math.floor(progress * 12)));
            if (step === lastStep) return;
            lastStep = step;
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (const part of parts) {
                const t = Math.max(0, Math.min(1, (step / 12 - part.delay) / (1 - part.delay)));
                const eased = t * t * (3 - 2 * t);
                const startX = origin.left + part.x / source.naturalWidth * origin.width;
                const startY = origin.top + part.y / source.naturalHeight * origin.height;
                const endX = destination.left + part.x / source.naturalWidth * destination.width;
                const endY = destination.top + part.y / source.naturalHeight * destination.height;
                const width = part.width / source.naturalWidth * (origin.width + (destination.width - origin.width) * eased);
                const height = part.height / source.naturalHeight * (origin.height + (destination.height - origin.height) * eased);
                context.drawImage(source, part.x, part.y, part.width, part.height,
                    Math.round(startX + (endX - startX) * eased - viewport.left),
                    Math.round(startY + (endY - startY) * eased + Math.sin(t * Math.PI) * part.arc - viewport.top),
                    Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
            }
        },
    };
}

export function showSourceImmediately(image) {
    const previous = sourceEffects.get(image);
    if (previous) {
        cancelAnimationFrame(previous.frame);
        previous.canvas.remove();
        sourceEffects.delete(image);
    }
    image.classList.remove('gallery-source-hidden');
    const sibling = image.previousElementSibling;
    if (sibling?.classList.contains('output-transition')) sibling.classList.remove('gallery-source-hidden');
}

export function mediaMosaic(node, entering, loadedImages, transferItems) {
    const media = node.querySelector('.bp-img');
    const image = media?.querySelector('img');
    const thumb = media?.style.backgroundImage || '';
    const thumbSrc = thumb.startsWith('url("') ? thumb.slice(5, -2) : thumb.slice(4, -1);
    const source = loadedImages.get(image?.currentSrc || image?.getAttribute('srcset') || thumbSrc);
    if (!source) return { duration: 0, tick() {} };
    const previous = mediaEffects.get(node);
    previous?.canvas.remove();
    const rect = media.getBoundingClientRect();
    const item = transferItems?.find(item => item.img === source.src && (!image || item.alt === image.alt));
    const origin = item?.origin || item?.element.getBoundingClientRect();
    const transferring = origin && origin.width > 0 && origin.height > 0;
    const atOrigin = transferring && ['left', 'top', 'width', 'height'].every(key => Math.abs(rect[key] - origin[key]) <= 2);
    if (!entering && atOrigin) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(rect.width));
        canvas.height = Math.max(1, Math.round(rect.height));
        canvas.className = 'gallery-exit-layer gallery-exit-still';
        canvas.style.left = rect.left + 'px';
        canvas.style.top = rect.top + 'px';
        const context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        document.body.append(canvas);
        media.classList.add('gallery-media-masked');
        const effect = { canvas };
        mediaEffects.set(node, effect);
        return {
            duration: transitionDuration,
            tick(progress) {
                if (progress === 0 && mediaEffects.get(node) === effect) {
                    canvas.remove();
                    showSourceImmediately(item.element);
                    mediaEffects.delete(node);
                }
            },
        };
    }
    const effect = transferring ?
        createPixelTransfer(source, origin, rect, node.getBoundingClientRect(), item.pixelSize || 3) :
        createMosaic(source, rect.width, rect.height);
    effect.canvas.className = 'gallery-media-mosaic' + (transferring ? ' gallery-pixel-transfer' : '');
    if (!entering && transferring) {
        effect.canvas.classList.add('gallery-exit-layer');
        document.body.append(effect.canvas);
    } else (transferring ? node : media).append(effect.canvas);
    media.classList.add('gallery-media-masked');
    mediaEffects.set(node, effect);
    return {
        duration: transitionDuration,
        tick(progress) {
            if (mediaEffects.get(node) !== effect) return;
            effect.paint(progress);
            if ((entering && progress === 1) || (!entering && progress === 0)) {
                effect.canvas.remove();
                if (entering) media.classList.remove('gallery-media-masked');
                else if (transferring) {
                    showSourceImmediately(item.element);
                }
                mediaEffects.delete(node);
            }
        },
    };
}

export function setSourceVisibility(image, visible) {
    const previous = sourceEffects.get(image);
    if (previous) {
        cancelAnimationFrame(previous.frame);
        previous.canvas.remove();
    }
    const sibling = image.previousElementSibling;
    const transition = sibling?.classList.contains('output-transition') ? sibling : null;
    const source = transition || image;
    const rect = source.getBoundingClientRect();
    if (!rect.width || !rect.height) {
        image.classList.toggle('gallery-source-hidden', !visible);
        return;
    }
    const effect = createMosaic(source, rect.width, rect.height);
    effect.canvas.className = 'gallery-source-mosaic';
    effect.canvas.style.left = rect.left + 'px';
    effect.canvas.style.top = rect.top + 'px';
    document.body.append(effect.canvas);
    image.classList.add('gallery-source-hidden');
    transition?.classList.add('gallery-source-hidden');
    sourceEffects.set(image, effect);
    const started = performance.now();
    const tick = now => {
        const progress = Math.max(0, Math.min(1, (now - started) / transitionDuration));
        effect.paint(visible ? progress : 1 - progress);
        if (progress < 1) effect.frame = requestAnimationFrame(tick);
        else {
            effect.canvas.remove();
            image.classList.toggle('gallery-source-hidden', !visible);
            transition?.classList.toggle('gallery-source-hidden', !visible);
            sourceEffects.delete(image);
        }
    };
    tick(started);
}
