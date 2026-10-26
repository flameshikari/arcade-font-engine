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
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    const next = await page.locator('.bp-img').boundingBox();
    expect(next.x).toBeCloseTo(initial.x + 90, 0);
    expect(next.y).toBeCloseTo(initial.y + 40, 0);
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
