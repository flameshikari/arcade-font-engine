window.$ = window.jQuery = require('jquery');
require('jquery-ui-dist/jquery-ui')
import fonts from './fonts.js'
import title from '../images/title.png'

const endpoint = '/api'

const indexes = Object.values(fonts)

const preset = {
    size: 3,
    bubble: 25,
    font: 'arcade',
}

const previews = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    symbols: `0123456789!?@$%^'&*~+=-_.,`,
}

const sanitizeString = () => {
    const value = $('#input').val();
    $('#input').val(value.replace(/[\u{0080}-\u{FFFF}]/gu, ''));
};

const shake = () => {
    const intensity = 1 + 2 * Math.random();
    const x = intensity * (Math.random() > 0.5 ? -1 : 1);
    const y = intensity * (Math.random() > 0.5 ? -1 : 1);
    document.body.style.marginLeft = x + 'px';
    document.body.style.marginTop = y + 'px';
    setTimeout(() => {
        document.body.style.marginLeft = '';
        document.body.style.marginTop = '';
    }, 75);
};


const compileUrl = (options) => {
    let url = endpoint;
    const input = options?.input || $('#input').val() || 'SAMPLE TEXT';
    const size = options?.size || $('#size').slider('value');
    const style = options?.style || $('#style').val();
    const font = options?.font || $('#fonts').val();
    const glyphs = options?.glyphs || false;
    if (glyphs) {
        url += '/dbl-3'
    } else {
        const bubble = options?.bubble || $('#bubble').is(':checked');
        if (bubble) {
            const bubbleFlip = $('#bubble-flip').is(':checked');
            const bubblePosition = $('#bubble-position').slider('value');
            url += (bubbleFlip ? '/b-u' : '/b-d') + '/bp-' + bubblePosition;
        };
        if (size >= 2) url += '/dbl-' + size;
    };
    url += '/y-' + font + '/z-' + style + '/x-' + input;
    return url;
};

const updatePreviews = (glyphs = false) => {
    shake()
    if (glyphs) {
        for (const [key, value] of Object.entries(previews)) {
            const options = { input: value, glyphs: true };
            $(`#${key}`).attr('src', compileUrl(options))
        }
    };
    const url = compileUrl();
    $('#output').attr('src', url);
    $('#blank').attr('href', url);
};


const updateTitle = () => {
    const keys = Object.keys(fonts);
    const font = keys[Math.floor(Math.random() * keys.length)];
    const style = Math.floor(Math.random() * fonts[font].styles);
    const url = `${endpoint}/y-${font}/z-${style}/dbl-5/x-ARCADE FONT ENGINE`;
    $('#title').attr('src', url)
};


const fontSelected = (ui) => {
    const font = ui ? ui.item.value : preset.font
    const total = Object.keys(fonts).length
    const index = indexes.indexOf(fonts[font]) + 1
    const style = 0
    $('#style').val(style)
    const styles = fonts[font].styles

    $('#styles-legend').html(style + 1)
    $('#styles-legend-total').html(styles)
    $('#styles').empty()
    $('#dev-legend').html(fonts[font].dev ? `by <span class="legend">${fonts[font].dev}</span>` : '')
    $('#notes-legend').html(fonts[font].notes ? `by <span class="rainbow">NFG</span>` : '')
    $('#notes').html(fonts[font].notes || 'No notes for this font.')

    for (let i = 0; i < styles; i++) {
        const url = `${endpoint}/dbl-2/y-${font}/z-${i}/x-${previews.uppercase.charAt(i)}`
        $('#styles').append($('<img>', {
            src : url,
            class: 'shake pointer style',
            value: i,
            click: function () {
                const style = Number($(this).attr('value'))
                $('#style').val(style)
                $('#styles-legend').html(style + 1)
                $('#styles-legend-total').html(styles)
                updatePreviews(true)
            },
        }));
    };
    $('#font-legend').html(index);
    $('#font-legend-total').html(total);
    updatePreviews(true);
}

window.onload = () => {
    $('#title').attr('src', title)
    $('#bubble, #bubble-flip').click(() => updatePreviews())
    $('#change').click(() => updatePreviews())

    $('#title').click(() => {
        updateTitle();
    });

    for (const [key, value] of Object.entries(fonts)) {
        $('#fonts').append(`<option ${ key == preset.font ? 'selected' : '' } value="${key}">${value.name}</option>`)
    }

    $('#fonts').selectmenu({
        // focus: (event, ui) => fontSelected(ui),
        change: (event, ui) => {
            fontSelected(ui)
        }
    });

    $('#bubble-position').slider({
        value: preset.bubble,
        min: 0,
        max: 100,
        step: 5,
        slide: (event, ui) => $('#bubble-legend').html(ui.value + '%'),
        change: (event, ui) => updatePreviews(),
    });

    $('#size').slider({
        value: preset.size,
        min: 1,
        max: 6,
        step: 1,
        start: (event, ui) => $('#size-legend').html('X' + ui.value),
        slide: (event, ui) => $('#size-legend').html('X' + ui.value),
        stop: () => {
            updatePreviews();
        },
    });

    $('#input')
        .keypress((event) => {
            if (event.repeat) return;
            if (event.which > 127) event.preventDefault();
            sanitizeString();
        })
        .bind('paste', async (event) => {
            await new Promise(resolve => setTimeout(() => {
                resolve(sanitizeString());
            }, 0));
        })
        .change(() => {
            sanitizeString();
            updatePreviews();
        })
        .focus(() => {
            $('#input')
                .removeClass('blinker')
                .attr('placeholder', '');

        })
        .blur(() => {
            $('#input')
                .addClass('blinker')
                .attr('placeholder', 'TYPE HERE!');

        });

    $("#bubble").checkboxradio({ icon: false });
    $("#bubble-flip").checkboxradio({ icon: false });
    $('#bubble-legend').html(preset.bubble + '%')
    $('#size-legend').html('X' + preset.size)
    fontSelected()
};
