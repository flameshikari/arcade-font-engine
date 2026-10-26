function createColorPanel(container) {
    const panel = document.createElement('div');
    panel.className = 'gallery-color';
    const swatch = document.createElement('span');
    swatch.className = 'gallery-color-swatch';
    const checker = document.createElement('span');
    checker.className = 'gallery-color-checker';
    checker.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 9; i++) checker.append(document.createElement('span'));
    const chip = document.createElement('span');
    chip.className = 'gallery-color-chip';
    swatch.append(checker, chip);
    const hex = document.createElement('span');
    hex.className = 'gallery-color-hex';
    hex.textContent = '#000000';
    const alpha = document.createElement('span');
    alpha.className = 'gallery-color-alpha';
    alpha.textContent = 'A: 0%';
    panel.append(swatch, hex, alpha);
    container.append(panel);
    return panel;
}

export function createColorPicker(container, loadedImages) {
    const panel = createColorPanel(container);
    let item;
    let pointer;
    let frame;
    let sampledSource;
    let pixels;
    let lastColor = '';
    const chip = panel.querySelector('.gallery-color-chip');
    const swatch = panel.querySelector('.gallery-color-swatch');
    const hexText = panel.querySelector('.gallery-color-hex');
    const alphaText = panel.querySelector('.gallery-color-alpha');
    const displayColor = (r, g, b, a) => {
        const key = `${r},${g},${b},${a}`;
        if (key !== lastColor) {
            const hex = '#' + [r, g, b].map(value => value.toString(16).padStart(2, '0')).join('').toUpperCase();
            const alpha = Math.round(a / 255 * 100);
            chip.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
            swatch.setAttribute('aria-label', `Alpha ${alpha}%`);
            hexText.textContent = hex;
            alphaText.textContent = `A: ${alpha}%`;
            lastColor = key;
        }
        panel.classList.add('is-visible');
    };
    const clear = () => displayColor(0, 0, 0, 0);
    clear();
    const sample = () => {
        frame = undefined;
        if (!pointer || !item || document.hidden) return clear();
        const hit = document.elementFromPoint(pointer.x, pointer.y);
        const media = hit?.closest('.bp-img');
        if (!media || !container.contains(media) || media.classList.contains('gallery-media-masked')) return clear();
        const image = media.querySelector('img');
        const src = image?.currentSrc || image?.getAttribute('srcset');
        if (src !== item.img) return clear();
        const source = loadedImages.get(src);
        if (!source) return clear();
        const rect = image.getBoundingClientRect();
        const x = Math.floor((pointer.x - rect.left) * source.naturalWidth / rect.width);
        const y = Math.floor((pointer.y - rect.top) * source.naturalHeight / rect.height);
        if (x < 0 || y < 0 || x >= source.naturalWidth || y >= source.naturalHeight) return clear();
        if (source !== sampledSource) {
            const canvas = document.createElement('canvas');
            canvas.width = source.naturalWidth;
            canvas.height = source.naturalHeight;
            const context = canvas.getContext('2d');
            context.drawImage(source, 0, 0);
            pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
            canvas.width = canvas.height = 0;
            sampledSource = source;
        }
        const index = (y * source.naturalWidth + x) * 4;
        displayColor(pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]);
    };
    const queue = () => {
        if (frame === undefined) frame = requestAnimationFrame(sample);
    };
    const move = event => {
        pointer = { x: event.clientX, y: event.clientY };
        queue();
    };
    const leave = () => { pointer = null; clear(); };
    // Watch actual image transforms so the color stays correct during zoom.
    const observer = new MutationObserver(records => {
        if (pointer && records.some(record => record.type === 'childList' ||
            record.target.classList?.contains('bp-img'))) queue();
    });
    observer.observe(container, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] });
    container.addEventListener('mousemove', move);
    container.addEventListener('mouseleave', leave);
    window.addEventListener('blur', leave);
    return {
        setItem(next) { item = next; clear(); queue(); },
        refresh: queue,
        destroy() {
            observer.disconnect();
            cancelAnimationFrame(frame);
            container.removeEventListener('mousemove', move);
            container.removeEventListener('mouseleave', leave);
            window.removeEventListener('blur', leave);
            sampledSource = pixels = null;
            leave();
            panel.remove();
        },
    };
}
