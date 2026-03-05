const CHAR_W = 8;
const CHAR_H = 8;
const CHAR_OFFSET = 32;

const fontCache = new Map();
const imageCache = new Map();

function loadImage(src) {
    if (imageCache.has(src)) return imageCache.get(src);
    const p = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
    imageCache.set(src, p);
    return p;
}

export async function getFontImage(name) {
    if (fontCache.has(name)) return fontCache.get(name);
    const img = await loadImage(`/images/fonts/${name}.png`);
    fontCache.set(name, img);
    return img;
}

function renderText(fontImg, text, style) {
    const canvas = document.createElement('canvas');
    canvas.width = CHAR_W * text.length;
    canvas.height = CHAR_H;
    if (canvas.width === 0) return canvas;
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        if (code < CHAR_OFFSET || code > 126) continue;
        ctx.drawImage(
            fontImg,
            (code - CHAR_OFFSET) * CHAR_W, style * CHAR_H, CHAR_W, CHAR_H,
            i * CHAR_W, 0, CHAR_W, CHAR_H,
        );
    }
    return canvas;
}

function scale(src, factor) {
    if (factor <= 1) return src;
    const canvas = document.createElement('canvas');
    canvas.width = src.width * factor;
    canvas.height = src.height * factor;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
    return canvas;
}

async function loadBubblePart(theme, name) {
    return loadImage(`/images/bubble/${theme}/${name}`);
}

async function applyBubble(src, flip, theme, pos) {
    const t = theme ? 'd' : 'l';
    const dir = flip ? 'top' : 'bot';
    const side = pos <= 40 ? 'l' : pos >= 60 ? 'r' : 'c';

    const [pointer, bg, lEnd, rEnd] = await Promise.all([
        loadBubblePart(t, `${side}-${dir}.png`),
        loadBubblePart(t, 'bg.png'),
        loadBubblePart(t, 'l-end.png'),
        loadBubblePart(t, 'r-end.png'),
    ]);

    const w = src.width;
    const h = src.height;

    // Step 1: stretch bg, overlay text
    const s1 = document.createElement('canvas');
    s1.width = w + 4;
    s1.height = h + 8;
    const c1 = s1.getContext('2d');
    c1.imageSmoothingEnabled = false;
    c1.drawImage(bg, 0, 0, s1.width, s1.height);
    c1.drawImage(src, 2, 4);

    // Step 2: add end caps
    const s2 = document.createElement('canvas');
    s2.width = s1.width + 8;
    s2.height = s1.height;
    const c2 = s2.getContext('2d');
    c2.drawImage(s1, 4, 0);
    c2.drawImage(lEnd, 0, 0, 4, 16);
    c2.drawImage(rEnd, s1.width + 4, 0, 4, 16);

    // Step 3: add pointer
    const s3 = document.createElement('canvas');
    s3.width = s2.width;
    s3.height = s2.height + 8;
    const c3 = s3.getContext('2d');
    const voff = flip ? 8 : 0;
    const poff = flip ? 0 : s2.height - 2;
    const xpos = Math.floor(w * pos / 100) + 4;
    c3.drawImage(s2, 0, voff);
    c3.drawImage(pointer, xpos, poff);

    return s3;
}

async function renderCanvas(opts) {
    const { text, font, style = 0, size = 1, bubble = false, bubbleFlip = false, bubbleTheme = false, bubblePos = 25 } = opts;
    const fontImg = await getFontImage(font);
    let canvas = renderText(fontImg, text || 'SAMPLE TEXT', style);

    if (bubble) {
        canvas = await applyBubble(canvas, bubbleFlip, bubbleTheme, bubblePos);
    }

    return { canvas, size };
}

export async function render(opts) {
    const { canvas, size } = await renderCanvas(opts);
    return scale(canvas, size).toDataURL('image/png');
}

function canvasToSVG(canvas, pixelSize) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;

    // Group pixels by color with horizontal run-length encoding
    const rects = [];
    for (let y = 0; y < height; y++) {
        let x = 0;
        while (x < width) {
            const i = (y * width + x) * 4;
            const a = data[i + 3];
            if (a === 0) { x++; continue; }
            const r = data[i], g = data[i + 1], b = data[i + 2];
            let run = 1;
            while (x + run < width) {
                const j = (y * width + x + run) * 4;
                if (data[j] === r && data[j + 1] === g && data[j + 2] === b && data[j + 3] === a) run++;
                else break;
            }
            const hex = '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
            const opacity = a < 255 ? ` opacity="${(a / 255).toFixed(3)}"` : '';
            rects.push(`<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${run * pixelSize}" height="${pixelSize}" fill="${hex}"${opacity}/>`);
            x += run;
        }
    }

    const svgW = width * pixelSize;
    const svgH = height * pixelSize;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" shape-rendering="crispEdges">\n${rects.join('\n')}\n</svg>`;
}

export async function renderToSVG(opts) {
    const { canvas, size } = await renderCanvas(opts);
    return canvasToSVG(canvas, Math.max(1, size));
}
