import { resolveCompatibility } from '../../build/compatibility.js';
import coreCompat from 'core-js-compat';
import { test, expect } from '@playwright/test';

test('built page, gallery and menu work with the selected polyfills', async ({ page }, testInfo) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
        window.compatibilityCSP = [];
        document.addEventListener('securitypolicyviolation', event => {
            window.compatibilityCSP.push(`${event.violatedDirective}: ${event.blockedURI}`);
        });
    });
    const legacy = testInfo.project.name === 'legacy-ios-apis';
    const profile = resolveCompatibility();
    const selected = coreCompat({ targets: profile.browsers }).list;
    const missing = {
        resize: profile.resizeObserver, pointer: profile.pointerEvents,
        fromEntries: selected.includes('es.object.from-entries'),
        flat: selected.includes('es.array.flat'), any: selected.includes('es.promise.any'),
    };
    if (legacy) {
        test.skip(!missing.resize && !missing.pointer, 'Selected targets need no legacy DOM shims');
        await page.addInitScript(missing => {
            // Newer lightbox releases use these APIs; old iOS needs fallbacks.
            delete HTMLImageElement.prototype.decode;
            delete Element.prototype.getAnimations;
            if (missing.resize) delete window.ResizeObserver;
            if (missing.pointer) delete window.PointerEvent;
            if (missing.fromEntries) delete Object.fromEntries;
            if (missing.flat) delete Array.prototype.flat;
            if (missing.any) delete Promise.any;
            // Suppress real pointer events from this modern engine, leaving PEP's
            // synthesized events to exercise the old-iOS touch path.
            for (const name of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) {
                document.addEventListener(name, event => {
                    if (missing.pointer && event.isTrusted) event.stopImmediatePropagation();
                }, true);
            }
        }, missing);
    }
    await page.goto('/');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#content')).opacity === '1');
    await expect(page.locator('#page-background')).toBeAttached();
    if (legacy) {
        expect(await page.evaluate(() => [
            typeof ResizeObserver, typeof PointerEvent, typeof Object.fromEntries,
            typeof Array.prototype.flat, typeof Promise.any,
        ])).toEqual(Array(5).fill('function'));
    }
    await page.locator('#uppercase').dispatchEvent('click');
    await page.waitForFunction(() => document.querySelector('.bp-img img')?.naturalWidth > 0);
    await page.waitForTimeout(400);
    const initial = await page.locator('.bp-img').boundingBox();
    const x = initial.x + initial.width / 2;
    const y = initial.y + initial.height / 2;
    if (legacy && missing.pointer) {
        await page.evaluate(({ x, y }) => {
            const target = document.elementFromPoint(x, y);
            const send = (name, dx, dy, ended = false) => {
                const touch = { identifier: 7, target, clientX: x + dx, clientY: y + dy,
                    pageX: x + dx, pageY: y + dy, screenX: x + dx, screenY: y + dy };
                const event = new Event(name, { bubbles: true, cancelable: true });
                Object.defineProperties(event, {
                    changedTouches: { value: [touch] }, touches: { value: ended ? [] : [touch] },
                });
                target.dispatchEvent(event);
            };
            send('touchstart', 0, 0);
            send('touchmove', 90, 40);
            send('touchend', 90, 40, true);
        }, { x, y });
    } else {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 90, y + 40, { steps: 8 });
        await page.mouse.up();
    }
    await expect.poll(async () => (await page.locator('.bp-img').boundingBox()).x).toBeCloseTo(initial.x + 90, 0);
    const previousMedia = await page.locator('.bp-img').elementHandle();
    await page.keyboard.press('ArrowRight');
    // The outgoing image remains mounted during its mosaic outro. Wait for
    // that specific node to leave, rather than assuming CI finishes in 500ms.
    await page.waitForFunction(element => !element.isConnected, previousMedia);
    await previousMedia.dispose();
    await expect(page.locator('.bp-img')).toHaveCount(1);
    await page.waitForFunction(() => document.querySelector('.bp-img img')?.naturalWidth > 0);
    await expect.poll(async () => (await page.locator('.bp-img').boundingBox()).x).toBeCloseTo(initial.x + 90, 0);
    await expect.poll(async () => (await page.locator('.bp-img').boundingBox()).y).toBeCloseTo(initial.y + 40, 0);
    await expect(page.locator('.gallery-color')).toBeVisible();
    await page.locator('.bp-x').dispatchEvent('click');
    await expect(page.locator('.bp-wrap')).toHaveCount(0);
    await page.evaluate(() => window.$('#fonts').selectmenu('open'));
    await page.waitForTimeout(450);
    await expect(page.locator('.ui-selectmenu-menu')).toBeVisible();
    await page.evaluate(() => window.$('#fonts').selectmenu('close'));
    await page.waitForTimeout(450);
    await expect(page.locator('.ui-selectmenu-menu')).not.toBeVisible();
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => window.compatibilityCSP)).toEqual([]);
});

test('wheel zoom keeps the source position, zoomed navigation and sampled colors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#content')).opacity === '1');
    const source = page.locator('#uppercase');
    const home = await source.boundingBox();
    const nextHome = await page.locator('#lowercase').boundingBox();
    const point = { clientX: home.x + home.width / 2, clientY: home.y + home.height / 2 };
    await source.dispatchEvent('wheel', { deltaY: -150, ...point });
    const media = page.locator('.bp-img');
    await expect(media).toHaveCount(1);
    await page.waitForFunction(() => document.querySelector('.bp-img img')?.naturalWidth > 0);
    await expect.poll(async () => (await media.boundingBox()).width).toBeCloseTo(home.width * 1.5, 0);
    await expect.poll(async () => (await media.boundingBox()).x).toBeCloseTo(home.x - home.width * .25, 0);
    const zoomed = await media.boundingBox();
    const previous = await media.elementHandle();
    await page.locator('.bp-next').dispatchEvent('click');
    await page.waitForFunction(element => !element.isConnected, previous);
    await previous.dispose();
    await expect(media).toHaveCount(1);
    await page.waitForFunction(() => document.querySelector('.bp-img img')?.naturalWidth > 0);
    for (const key of ['x', 'y', 'width', 'height']) {
        await expect.poll(async () => (await media.boundingBox())[key]).toBeCloseTo(zoomed[key], 0);
    }
    // Pick an opaque source pixel and hover its actual scaled position.
    const pixel = await media.locator('img').evaluate(image => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const offset = data.findIndex((value, index) => index % 4 === 3 && value === 255);
        if (offset < 0) throw new Error('No opaque glyph pixels');
        const index = (offset - 3) / 4;
        const rect = image.getBoundingClientRect();
        return {
            x: rect.left + (index % canvas.width + .5) * rect.width / canvas.width,
            y: rect.top + (Math.floor(index / canvas.width) + .5) * rect.height / canvas.height,
            hex: '#' + Array.from(data.slice(offset - 3, offset)).map(value => value.toString(16).padStart(2, '0')).join('').toUpperCase(),
        };
    });
    await page.mouse.move(pixel.x, pixel.y);
    await expect(page.locator('.gallery-color-hex')).toHaveText(pixel.hex);
    await expect(page.locator('.gallery-color-alpha')).toHaveText('A: 100%');
    await page.mouse.move(2, 2);
    await expect(page.locator('.gallery-color-alpha')).toHaveText('A: 0%');
    await media.dispatchEvent('wheel', { deltaY: 300, ...point });
    for (const key of ['x', 'y', 'width', 'height']) {
        await expect.poll(async () => (await media.boundingBox())[key]).toBeCloseTo(nextHome[key], 0);
    }
    // Reaching base size must not close the viewer during the same scroll.
    await expect(page.locator('.bp-wrap')).toHaveCount(1);
    await page.waitForTimeout(300);
    await media.dispatchEvent('wheel', { deltaY: 100, ...point });
    await expect(page.locator('.bp-wrap')).toHaveCount(0);
    await expect(source).toBeVisible();
    expect(errors).toEqual([]);
});
