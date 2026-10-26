// Use load events instead of Image.decode(), which older Safari lacks.
const decodedImages = new Map();
let sourceBytes = 0;

export function loadImage(src) {
    if (decodedImages.has(src)) {
        const image = decodedImages.get(src);
        decodedImages.delete(src); decodedImages.set(src, image);
        return image;
    }
    const promise = new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = event => {
            if (decodedImages.get(src) === promise) {
                decodedImages.delete(src); sourceBytes -= src.length * 2;
            }
            reject(event);
        };
        image.src = src;
    });
    decodedImages.set(src, promise);
    sourceBytes += src.length * 2;
    while (decodedImages.size > 24 || sourceBytes > 8 * 1024 * 1024) {
        const oldest = decodedImages.keys().next().value;
        sourceBytes -= oldest.length * 2;
        decodedImages.delete(oldest);
    }
    return promise;
}

export function onMediaChange(query, listener) {
    if (typeof query.addEventListener === 'function') query.addEventListener('change', listener);
    else query.addListener(listener);
}
