window.$ = window.jQuery = require('jquery');
require('jquery-ui-dist/jquery-ui');
import fonts from './fonts.js';
import title from '../images/title.png';

const endpoint = '/api';

const _refreshValue = $.ui.slider.prototype._refreshValue;
$.ui.slider.prototype._refreshValue = function () {
    _refreshValue.call(this);
    const handle = this.handle[0];
    const trackW = this.element[0].clientWidth;
    const handleW = handle.offsetWidth;
    const pct = (this.value() - this.options.min) / (this.options.max - this.options.min);
    handle.style.left = `${pct * (trackW - handleW)}px`;
};

const indexes = Object.values(fonts);
const fontKeys = Object.keys(fonts);
const fontTotal = fontKeys.length;

const preset = {
    size: 3,
    bubble: 25,
    font: 'arcade',
};

const previews = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    symbols: `0123456789!?@$%^'&*~+=-_.,`,
};

const sanitizeString = () => {
    const value = $('#input').val();
    $('#input').val(value.replace(/[\u{0080}-\u{FFFF}]/gu, ''));
};

const createParticle = (x, y, dx, dy) => {
    const dot = document.createElement('div');
    Object.assign(dot.style, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: '2px',
        height: '2px',
        background: '#fff',
        pointerEvents: 'none',
        zIndex: '9999',
        transition: 'all 0.35s ease-out',
        opacity: '1',
    });
    document.body.appendChild(dot);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        dot.style.left = `${x + dx}px`;
        dot.style.top = `${y + dy}px`;
        dot.style.opacity = '0';
    }));
    setTimeout(() => dot.remove(), 400);
};

const sparks = (el) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i;
        const dist = 12 + Math.random() * 16;
        createParticle(cx, cy, Math.cos(angle) * dist, Math.sin(angle) * dist);
    }
};

const textSparks = (el) => {
    const rect = el.getBoundingClientRect();
    const cy = rect.top + rect.height / 2;
    const count = Math.max(4, Math.round(rect.width / 8));
    for (let i = 0; i < count; i++) {
        createParticle(
            rect.left + (i / (count - 1)) * rect.width, cy,
            (Math.random() - 0.5) * 8,
            (Math.random() > 0.5 ? -1 : 1) * (8 + Math.random() * 12)
        );
    }
};

const blink = (selector) => {
    const el = $(selector)[0];
    if (!el) return;
    el.style.setProperty('color', '#0000ff', 'important');
    setTimeout(() => el.style.removeProperty('color'), 100);
};

const blinkHandle = ($slider) => {
    const handle = $slider.find('.ui-slider-handle');
    handle.css('background', '#0000ff');
    setTimeout(() => handle.css('background', ''), 100);
};

const shake = () => {
    const intensity = 1 + 2 * Math.random();
    const x = intensity * (Math.random() > 0.5 ? -1 : 1);
    const y = intensity * (Math.random() > 0.5 ? -1 : 1);
    const el = document.getElementById('content');
    el.style.transform = `translate(${x}px, ${y}px)`;
    setTimeout(() => { el.style.transform = ''; }, 75);
};

const compileUrl = (options) => {
    let url = endpoint;
    const input = options?.input || $('#input').val() || 'SAMPLE TEXT';
    const size = options?.size || $('#size').slider('value');
    const style = options?.style || $('#style').val();
    const font = options?.font || $('#fonts').val();
    if (options?.glyphs) {
        url += '/dbl-3';
    } else {
        if (options?.bubble || $('#bubble').is(':checked')) {
            const bubbleFlip = $('#bubble-flip').is(':checked');
            const bubbleTheme = $('#bubble-theme').is(':checked');
            const bubblePosition = $('#bubble-position').slider('value');
            url += `${bubbleFlip ? '/b-u' : '/b-d'}${bubbleTheme ? '/bt-d' : '/bt-l'}/bp-${bubblePosition}`;
        }
        if (size >= 2) url += `/dbl-${size}`;
    }
    url += `/y-${font}/z-${style}/x-${input}`;
    return url;
};

const preload = (urls) => new Promise(resolve => {
    let loaded = 0;
    const images = urls.map(url => {
        const img = new Image();
        img.onload = img.onerror = () => { if (++loaded >= urls.length) resolve(images); };
        img.src = url;
        return img;
    });
});

const updatePreviews = (glyphs = false) => {
    shake();
    if (glyphs) {
        const keys = Object.keys(previews);
        const urls = Object.values(previews).map(v => compileUrl({ input: v, glyphs: true }));
        preload(urls).then(images => {
            keys.forEach((key, i) => $(`#${key}`).attr('src', images[i].src));
        });
    }
    const url = compileUrl();
    preload([url]).then(() => { $('#output').attr('src', url); });
    $('#blank').attr('href', url);
};

const updateTitle = () => {
    const font = fontKeys[Math.floor(Math.random() * fontTotal)];
    const style = Math.floor(Math.random() * fonts[font].styles);
    const url = `${endpoint}/y-${font}/z-${style}/dbl-5/x-ARCADE FONT ENGINE`;
    preload([url]).then(() => { $('#title').attr('src', url); });
};

const navigateFont = (dir) => {
    const $sel = $('#fonts');
    const len = $sel[0].options.length;
    const next = ($sel.prop('selectedIndex') + dir + len) % len;
    $sel.prop('selectedIndex', next).trigger('change');
    $sel.selectmenu('refresh');
    preset.font = $sel.val();
    fontSelected();
    const textEl = document.querySelector('.ui-selectmenu-text');
    if (textEl) textSparks(textEl);
};

const setStyle = (next) => {
    $('#style').val(next);
    $('#styles-legend').html(String.fromCharCode(65 + next));
    $('.style').removeClass('style-selected');
    const $el = $('#styles .style').eq(next);
    $el.addClass('style-selected');
    const container = $('#styles')[0];
    const cRect = container.getBoundingClientRect();
    const eRect = $el[0].getBoundingClientRect();
    if (eRect.left < cRect.left) {
        container.scrollLeft += eRect.left - cRect.left;
    } else if (eRect.right > cRect.right) {
        container.scrollLeft += eRect.right - cRect.right;
    }
    sparks($el[0]);
    updatePreviews(true);
};

const cycleStyle = (dir) => {
    const len = $('#styles')[0].children.length;
    const current = Number($('#style').val());
    setStyle((current + dir + len) % len);
};

const updateSliderLabel = ($slider, val) => {
    if ($slider.is('#size')) {
        $('#size-legend').html(`X${val}`);
    } else if ($slider.is('#bubble-position')) {
        $('#bubble-legend').html(`${val}%`);
    }
};

const stepSize = (dir) => {
    const $slider = $('#size');
    const current = $slider.slider('value');
    const next = ((current - 1 + dir + 6) % 6) + 1;
    $slider.slider('value', next);
    $('#size-legend').html(`X${next}`);
    blinkHandle($slider);
    updatePreviews();
};

const stepBubble = (dir) => {
    const $slider = $('#bubble-position');
    const current = $slider.slider('value');
    let next = current + dir * 5;
    if (next > 100) next = 0;
    else if (next < 0) next = 100;
    $slider.slider('value', next);
    $('#bubble-legend').html(`${next}%`);
    blinkHandle($slider);
    updatePreviews();
};

const fontSelected = (ui) => {
    const font = ui ? ui.item.value : preset.font;
    const index = indexes.indexOf(fonts[font]) + 1;
    const styles = fonts[font].styles;
    $('#style').val(0);
    $('#styles-legend').html('A');
    $('#styles-legend-total').html(String.fromCharCode(64 + styles));
    $('#dev-legend').html(fonts[font].dev ? `by <span class="legend">${fonts[font].dev}</span>` : '');
    const hasNotes = !!fonts[font].notes;
    $('#notes-popup').html(fonts[font].notes);
    $('#glyphs-legend').toggleClass('no-notes', !hasNotes);
    if (hasNotes && $('#glyphs-legend').is(':hover')) {
        $('#notes-popup').show();
    } else {
        $('#notes-popup').hide();
    }

    const urls = [];
    const wraps = [];
    for (let i = 0; i < styles; i++) {
        const url = `${endpoint}/dbl-2/y-${font}/z-${i}/x-${previews.uppercase.charAt(i)}`;
        urls.push(url);
        const $wrap = $('<span>', {
            class: 'shake pointer style style-wrap',
            value: i,
            click: (e) => {
                const $el = $(e.currentTarget);
                if ($el.hasClass('style-selected')) return;
                setStyle(Number($el.attr('value')));
            },
        }).append($('<img>', { src: url }));
        $wrap[0].style.setProperty('--style-src', `url(${url})`);
        wraps.push($wrap);
    }
    preload(urls).then(() => {
        const $styles = $('#styles').empty().scrollLeft(0);
        wraps.forEach($w => $styles.append($w));
        $styles.find('.style').first().addClass('style-selected');
    });
    $('#style-prev, #style-next').toggleClass('glyph-disabled', styles <= 1);
    $('#font-legend').html(index);
    $('#font-legend-total').html(fontTotal);
    if (ui) {
        const textEl = document.querySelector('.ui-selectmenu-text');
        if (textEl) textSparks(textEl);
    }
    updatePreviews(true);
};

const leet = () => {
    const target = document.getElementById('leet');
    if (!target) return;
    const baseText = target.textContent;
    const leetMap = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' };
    setInterval(() => {
        target.textContent = baseText.split('').map(ch => {
            const mapped = leetMap[ch.toLowerCase()];
            return mapped && Math.random() < 0.4 ? mapped : ch;
        }).join('');
    }, 150);
};

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        switch (event.code) {
            case 'KeyF': {
                event.preventDefault();
                const $input = $('#input');
                if ($input.is(':focus')) {
                    $input.blur();
                } else {
                    $input.focus();
                    const el = $input[0];
                    el.setSelectionRange(el.value.length, el.value.length);
                }
                break;
            }
            case 'KeyL':
                event.preventDefault();
                $('#input').val('').trigger('change');
                break;
            case 'KeyM': {
                event.preventDefault();
                const menu = $('#fonts').selectmenu('menuWidget');
                if (menu.is(':visible')) {
                    $('#fonts').selectmenu('close');
                } else {
                    $('#fonts').selectmenu('open');
                    $('.ui-selectmenu-button').focus();
                }
                break;
            }
        }
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                if ($('.ui-selectmenu-button').is(':focus') || $('#fonts').selectmenu('menuWidget').is(':visible')) break;
                event.preventDefault();
                blink(event.key === 'ArrowUp' ? '#font-prev' : '#font-next');
                navigateFont(event.key === 'ArrowUp' ? -1 : 1);
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                if ($('#styles')[0].children.length <= 1) break;
                event.preventDefault();
                blink(event.key === 'ArrowLeft' ? '#style-prev' : '#style-next');
                cycleStyle(event.key === 'ArrowLeft' ? -1 : 1);
                break;
            case '-':
            case '=':
            case '+':
                event.preventDefault();
                blink(event.key === '-' ? '#size-dec' : '#size-inc');
                stepSize(event.key === '-' ? -1 : 1);
                break;
            case '\\':
                event.preventDefault();
                $('#bubble').click();
                break;
            case '[':
            case ']':
                if (!$('#bubble').is(':checked')) break;
                event.preventDefault();
                stepBubble(event.key === '[' ? -1 : 1);
                break;
            case "'":
                if (!$('#bubble').is(':checked')) break;
                event.preventDefault();
                $('#bubble-flip').click();
                break;
            case ';':
                if (!$('#bubble').is(':checked')) break;
                event.preventDefault();
                $('#bubble-theme').click();
                break;
        }
    }
    if (event.key === 'Escape') {
        if ($('#fonts').selectmenu('menuWidget').is(':visible')) $('#fonts').selectmenu('close');
        $('#input').blur();
    }
});

window.onload = () => {
    $('body').append('<div id="dropdown-overlay"></div>');
    leet();
    $('#title').attr('src', title);

    $('#bubble, #bubble-flip, #bubble-theme').click(() => updatePreviews());
    $('#bubble').change(() => {
        const disabled = !$('#bubble').is(':checked');
        $('.bubble-toggle, .bubble-slider').toggleClass('disabled', disabled);
        $('#bubble-legend').css('color', disabled ? '#222' : '');
    });

    $('#title').click(() => {
        shake();
        $('#title').css('filter', 'invert(1)');
        setTimeout(() => $('#title').css('filter', ''), 100);
        updateTitle();
    });

    for (const [key, value] of Object.entries(fonts)) {
        $('#fonts').append(`<option ${key === preset.font ? 'selected' : ''} value="${key}">${value.name}</option>`);
    }

    let marksAdded = false;
    $('#fonts').selectmenu({
        change: (event, ui) => fontSelected(ui),
        appendTo: '.fonts',
        open: () => {
            const wrapper = $('.ui-selectmenu-menu')[0];
            const menu = wrapper.querySelector('.ui-menu');
            const items = menu.querySelectorAll('.ui-menu-item');
            const activeLi = menu.querySelector('.ui-state-active')?.closest('.ui-menu-item');
            const isMobile = !matchMedia('(hover: hover)').matches;

            if (activeLi && items.length) {
                const index = Array.from(items).indexOf(activeLi);
                const itemH = items[0].offsetHeight;
                const visible = 15;
                const center = 7;
                const menuH = visible * itemH;
                const overscroll = center * itemH;

                menu.style.height = `${menuH}px`;
                menu.style.maxHeight = `${menuH}px`;
                menu.style.setProperty('--overscroll', `${overscroll}px`);
                menu.scrollTop = index * itemH;

                if (isMobile) {
                    wrapper.style.setProperty('top', '50%', 'important');
                } else {
                    const btnRect = document.querySelector('.ui-selectmenu-text').getBoundingClientRect();
                    const fontsEl = document.querySelector('.fonts');
                    const cellRect = fontsEl.getBoundingClientRect();
                    const btnCenterInCell = btnRect.top + btnRect.height / 2 - cellRect.top;
                    const cellBorder = parseFloat(getComputedStyle(fontsEl).borderTopWidth);
                    const menuBorder = parseFloat(getComputedStyle(menu).borderTopWidth);
                    const top = btnCenterInCell - cellBorder - menuBorder - center * itemH - itemH / 2;
                    wrapper.style.setProperty('top', `${top}px`, 'important');
                }
            }

            if (!marksAdded) {
                items.forEach((li, i) => {
                    if (fonts[fontKeys[i]]?.notes) {
                        $(li).find('.ui-menu-item-wrapper').append('<span class="font-notes-mark">#</span>');
                    }
                });
                marksAdded = true;
            }

            $('.font-current').removeClass('font-current');
            if (activeLi) $(activeLi).find('.ui-menu-item-wrapper').addClass('font-current');

            $('.fonts').addClass('dropdown-open');
            $('.fonts > legend').hide();
            $('#dropdown-overlay').show();
        },
        close: () => {
            $('.fonts').removeClass('dropdown-open');
            $('.fonts > legend').show();
            $('#dropdown-overlay').hide();
            $('.ui-selectmenu-button').blur();
        },
    });

    const menuWidget = $('#fonts').selectmenu('menuWidget');
    menuWidget.menu('instance')._scrollIntoView = function (item) {
        if (!item || !item.length) return;
        const el = this.element[0];
        const itemEl = item[0];
        if (itemEl.offsetTop < el.scrollTop) {
            el.scrollTop = itemEl.offsetTop;
        } else if (itemEl.offsetTop + itemEl.offsetHeight > el.scrollTop + el.clientHeight) {
            el.scrollTop = itemEl.offsetTop + itemEl.offsetHeight - el.clientHeight;
        }
    };

    $('#bubble-position').slider({
        value: preset.bubble,
        min: 0,
        max: 100,
        step: 5,
        slide: (event, ui) => $('#bubble-legend').html(`${ui.value}%`),
        stop: () => updatePreviews(),
    });

    $('#size').slider({
        value: preset.size,
        min: 1,
        max: 6,
        step: 1,
        start: (event, ui) => $('#size-legend').html(`X${ui.value}`),
        slide: (event, ui) => $('#size-legend').html(`X${ui.value}`),
        stop: () => updatePreviews(),
    });

    const placeholders = ['Type here!', 'Hover over the blue text!', 'Click the title!'];
    let placeholderIndex = 0;
    let placeholderTimer = null;
    let blinkTimer = null;

    const startBlink = () => {
        stopBlink();
        blinkTimer = setInterval(() => { $('#input').toggleClass('blinker-hidden'); }, 500);
    };

    const stopBlink = () => {
        clearInterval(blinkTimer);
        $('#input').removeClass('blinker-hidden');
    };

    const rotatePlaceholder = () => {
        clearTimeout(placeholderTimer);
        placeholderTimer = setTimeout(() => {
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            if (!$('#input').is(':focus')) {
                $('#input').attr('placeholder', placeholders[placeholderIndex]);
            }
            rotatePlaceholder();
        }, 4000);
    };
    rotatePlaceholder();
    startBlink();

    $('.input').on('click', (e) => {
        if ($(e.target).is('#input') || $(e.target).is('#shortcuts-trigger')) return;
        $('#input').focus();
        const el = $('#input')[0];
        el.setSelectionRange(el.value.length, el.value.length);
    });

    $('#input')
        .keypress((event) => {
            if (event.repeat) return;
            if (event.which > 127) event.preventDefault();
            else shake();
            sanitizeString();
        })
        .on('paste', () => setTimeout(sanitizeString, 0))
        .change(() => { sanitizeString(); updatePreviews(); })
        .focus(() => {
            clearTimeout(placeholderTimer);
            stopBlink();
            $('#input').attr('placeholder', '');
        })
        .blur(() => {
            placeholderIndex = 0;
            $('#input').attr('placeholder', placeholders[0]);
            startBlink();
            rotatePlaceholder();
        });

    $('#bubble, #bubble-flip, #bubble-theme').prop('checked', false);
    $('#bubble').checkboxradio({ icon: false });
    $('#bubble-flip').checkboxradio({ icon: false });
    $('#bubble-theme').checkboxradio({ icon: false });
    $('.bubble-toggle, .bubble-slider').addClass('disabled');
    $('#bubble-legend').css('color', '#222');

    const touchRepeat = ($el, fn) => {
        let timer = null;
        $el.on('touchstart', (e) => {
            e.preventDefault();
            $el.addClass('glyph-active');
            fn();
            timer = setTimeout(() => { timer = setInterval(fn, 200); }, 250);
        }).on('touchend touchcancel', () => {
            $el.removeClass('glyph-active');
            clearTimeout(timer);
            clearInterval(timer);
        });
    };

    $('#font-prev').click(() => navigateFont(-1));
    $('#font-next').click(() => navigateFont(1));
    touchRepeat($('#font-prev'), () => navigateFont(-1));
    touchRepeat($('#font-next'), () => navigateFont(1));

    const guardStyle = (fn) => () => { if (!$('#style-prev').hasClass('glyph-disabled')) fn(); };
    $('#style-prev').click(guardStyle(() => cycleStyle(-1)));
    $('#style-next').click(guardStyle(() => cycleStyle(1)));
    touchRepeat($('#style-prev'), guardStyle(() => cycleStyle(-1)));
    touchRepeat($('#style-next'), guardStyle(() => cycleStyle(1)));

    $('.ui-selectmenu-button').on('wheel', (e) => {
        e.preventDefault();
        const dir = e.originalEvent.deltaY > 0 ? 1 : -1;
        blink(dir > 0 ? '#font-next' : '#font-prev');
        navigateFont(dir);
    });

    $('#styles').on('wheel', (e) => {
        e.preventDefault();
        if ($('#styles')[0].children.length <= 1) return;
        const dir = e.originalEvent.deltaY > 0 ? 1 : -1;
        blink(dir > 0 ? '#style-next' : '#style-prev');
        cycleStyle(dir);
    });

    const sliderStep = ($slider, dir) => {
        const step = $slider.slider('option', 'step');
        const min = $slider.slider('option', 'min');
        const max = $slider.slider('option', 'max');
        let next = $slider.slider('value') + dir * step;
        if (next > max) next = min;
        else if (next < min) next = max;
        $slider.slider('value', next);
        updateSliderLabel($slider, next);
        updatePreviews();
    };

    $('.ui-slider').on('wheel', (e) => {
        e.preventDefault();
        const $slider = $(e.currentTarget);
        const dir = e.originalEvent.deltaY < 0 ? 1 : -1;
        const prefix = $slider.is('#size') ? '#size' : '#bubble';
        blink(dir > 0 ? `${prefix}-inc` : `${prefix}-dec`);
        sliderStep($slider, dir);
    });

    const touchToValue = ($slider, touchX) => {
        const rect = $slider[0].getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (touchX - rect.left) / rect.width));
        const min = $slider.slider('option', 'min');
        const max = $slider.slider('option', 'max');
        const step = $slider.slider('option', 'step');
        return Math.round((min + pct * (max - min)) / step) * step;
    };

    let activeSlider = null;
    let activeHandle = null;

    $('.ui-slider').on('touchstart', (e) => {
        e.preventDefault();
        activeSlider = $(e.currentTarget);
        activeHandle = activeSlider.find('.ui-slider-handle');
        activeHandle.css('background', '#0000ff');
        const val = touchToValue(activeSlider, e.originalEvent.touches[0].clientX);
        activeSlider.slider('value', val);
        updateSliderLabel(activeSlider, val);
    });

    $(document).on('touchmove.slider', (e) => {
        if (!activeSlider) return;
        e.preventDefault();
        const val = touchToValue(activeSlider, e.originalEvent.touches[0].clientX);
        activeSlider.slider('value', val);
        updateSliderLabel(activeSlider, val);
    }).on('touchend.slider touchcancel.slider', () => {
        if (!activeSlider) return;
        activeHandle.css('background', '');
        activeSlider = null;
        activeHandle = null;
        updatePreviews();
    });

    $('#size-dec').click(() => stepSize(-1));
    $('#size-inc').click(() => stepSize(1));
    touchRepeat($('#size-dec'), () => stepSize(-1));
    touchRepeat($('#size-inc'), () => stepSize(1));
    $('#bubble-dec').click(() => stepBubble(-1));
    $('#bubble-inc').click(() => stepBubble(1));
    touchRepeat($('#bubble-dec'), () => stepBubble(-1));
    touchRepeat($('#bubble-inc'), () => stepBubble(1));

    $('#shortcuts-trigger').on('mouseenter', () => {
        $('#shortcuts-popup').show();
    }).on('mouseleave', () => {
        $('#shortcuts-popup').hide();
    }).on('mousemove', (e) => {
        $('#shortcuts-popup').css({ left: e.clientX + 12, top: e.clientY + 12 });
    });

    const $glyphsLegend = $('#glyphs-legend');
    $glyphsLegend.on('mouseenter', () => {
        if (!$glyphsLegend.hasClass('no-notes')) $('#notes-popup').show();
    }).on('mouseleave', () => {
        $('#notes-popup').hide();
    }).on('mousemove', (e) => {
        if (!$glyphsLegend.hasClass('no-notes')) $('#notes-popup').css({ left: e.clientX + 12, top: e.clientY + 12 });
    });

    let popupLock = false;
    const popupTap = ($trigger, $popup, $other, guard) => {
        let startY = null;
        $trigger.on('touchstart', (e) => {
            e.preventDefault();
            startY = e.originalEvent.touches[0].clientY;
        }).on('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (startY === null) return;
            const dy = Math.abs(e.originalEvent.changedTouches[0].clientY - startY);
            startY = null;
            if (dy > 10 || popupLock) return;
            popupLock = true;
            setTimeout(() => popupLock = false, 300);
            if (guard && guard()) return;
            if ($popup.is(':visible')) { $popup.hide(); return; }
            $other.hide();
            const rect = $trigger[0].getBoundingClientRect();
            $popup.css({ left: rect.left, top: rect.bottom + 8 }).show();
        });
    };
    popupTap($('#shortcuts-trigger'), $('#shortcuts-popup'), $('#notes-popup'));
    popupTap($glyphsLegend, $('#notes-popup'), $('#shortcuts-popup'), () =>
        $glyphsLegend.hasClass('no-notes')
    );

    $('#shortcuts-popup, #notes-popup').each((_, el) => {
        const $el = $(el);
        let startX, startY, origLeft, origTop, dragged;
        $el.on('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragged = false;
            const touch = e.originalEvent.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            origLeft = parseFloat($el.css('left'));
            origTop = parseFloat($el.css('top'));
        }).on('touchmove', (e) => {
            e.preventDefault();
            const touch = e.originalEvent.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragged = true;
            $el.css({ left: origLeft + dx, top: origTop + dy });
        }).on('touchend', (e) => {
            e.stopPropagation();
            if (!dragged) $el.hide();
        });
    });

    let docTouchY = null;
    $(document).on('touchstart.popup', (e) => {
        docTouchY = e.originalEvent.touches[0].clientY;
    }).on('touchend.popup', (e) => {
        if (docTouchY === null) return;
        const dy = Math.abs(e.originalEvent.changedTouches[0].clientY - docTouchY);
        docTouchY = null;
        if (dy > 10) return;
        if (!$(e.target).closest('#shortcuts-popup, #notes-popup, #shortcuts-trigger, #glyphs-legend').length) {
            $('#shortcuts-popup, #notes-popup').hide();
        }
    });

    $('#bubble-legend').html(`${preset.bubble}%`);
    $('#size-legend').html(`X${preset.size}`);
    fontSelected();
    const steps = [0, 0.33, 0.66, 1];
    let step = 0;
    $('#content').css({ visibility: 'visible', opacity: 0 });
    const fadeIn = setInterval(() => {
        step++;
        $('#content').css('opacity', steps[step]);
        if (step >= steps.length - 1) clearInterval(fadeIn);
    }, 400);
};
