import { normalizeText } from './renderer.js';
const key = 'arcade-font-engine.session.v1';

export function readSessionState(fonts) {
    let saved;
    try {
        saved = JSON.parse(sessionStorage.getItem(key));
    } catch {
        saved = null;
    }
    if (!saved || typeof saved !== 'object') saved = {};
    const integer = (value, min, max, fallback) =>
        Number.isInteger(value) && value >= min && value <= max ? value : fallback;
    const font = Object.prototype.hasOwnProperty.call(fonts, saved.font) ? saved.font : 'arcade';
    const logo = saved.logo && Object.prototype.hasOwnProperty.call(fonts, saved.logo.font) &&
        Number.isInteger(saved.logo.style) && saved.logo.style >= 0 &&
        saved.logo.style < fonts[saved.logo.font].styles ? saved.logo : null;
    return {
        font,
        style: integer(saved.style, 0, fonts[font].styles - 1, 0),
        size: integer(saved.size, 1, 9, 3),
        bubblePosition: integer(saved.bubblePosition, 0, 100, 25),
        bubble: saved.bubble === true,
        bubbleFlip: saved.bubbleFlip === true,
        bubbleTheme: saved.bubbleTheme === true,
        text: typeof saved.text === 'string' ? normalizeText(saved.text) : '',
        logo,
    };
}

export function writeSessionState(state) {
    try {
        sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
        // Storage may be disabled; keep the controls usable for this page.
    }
}


export function clearSessionState() {
    try {
        sessionStorage.removeItem(key);
    } catch {
        // The page can still reload when storage is unavailable.
    }
}
