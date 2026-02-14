window.$ = window.jQuery = require('jquery');
require('jquery-ui-dist/jquery-ui')
import fonts from './fonts.js'
import title from '../images/title.png'

const endpoint = '/api'

const indexes = Object.values(fonts)

const preset = {
    size: 3,
    bubble: 25,
    mode: 'l',
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


document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
        switch (event.key) {

            case 'ArrowUp':
            case 'ArrowDown': {
                event.preventDefault();
                const $sel = $('#fonts');
                const len = $sel[0].options.length;
                const int = event.key === 'ArrowUp' ? -1 : 1;
                const next = ($sel.prop('selectedIndex') + int + len) % len;
                $sel.prop('selectedIndex', next).trigger('change');
                $sel.selectmenu('refresh');
                preset.font = $('#fonts option:selected').val();
                fontSelected();
                break;
            }

            case 'ArrowLeft':
            case 'ArrowRight':{
                event.preventDefault();
                const $sel = $('#styles');
                const len  = $sel[0].children.length;
                const int  = event.key === 'ArrowLeft' ? -1 : 1;
                const current = Number($('#style').val());
                const next = (current + int + len) % len;
                $('#style').val(next);
                $('#styles-legend').html(next + 1)
                updatePreviews(true);
                break;
            }

            case '-':
            case '=':
            case '+': {
                event.preventDefault();
                const step = event.key === '-' ? -1 : 1;
                const len = 6;
                const current = $('#size').slider('value');
                const next = ((current - 1 + step + len) % len) + 1;
                $('#size').slider('value', next);
                $('#size-legend').html('X' + next);
                updatePreviews(true);
                break;
            }

        }
    }
});


const leet = function () {
  const target = document.getElementById('leet');
  if (!target) return;
  const baseText = target.textContent;
  const leetMap = {
    a: '4',
    e: '3',
    i: '1',
    o: '0',
    s: '5',
    t: '7'
  };
  function step() {
    const chars = baseText.split('');
    const newText = chars.map(ch => {
      const lower = ch.toLowerCase();
      if (leetMap[lower] && Math.random() < 0.4) {
        return leetMap[lower];
      }
      return ch;
    }).join('');
    target.textContent = newText;
  }
  setInterval(step, 150);
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
            const bubbleTheme = $('#bubble-theme').is(':checked');
            const bubblePosition = $('#bubble-position').slider('value');
            url += (bubbleFlip ? '/b-u' : '/b-d') + (bubbleTheme ? '/bt-d' : '/bt-l') + `/bp-${bubblePosition}`;
        }
        if (size >= 2) url += '/dbl-' + size;
    }
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
    $('#notes-legend').html(fonts[font].notes ? `` : '')
    $('#notes').html(fonts[font].notes || 'No notes for this font.')

    // $('#glyphs-legend').html(fonts[font].notes ? $('#glyphs-legend')[0].classList.add('rainbow') : $('#glyphs-legend')[0].classList.remove('rainbow'))

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
    }
    $('#font-legend').html(index);
    $('#font-legend-total').html(total);
    updatePreviews(true);
}

window.onload = () => {
    leet();
    $('#title').attr('src', title)
    $('#bubble, #bubble-flip, #bubble-theme').click(() => updatePreviews())
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
        .on('paste', () => {
            setTimeout(() => sanitizeString(), 0);
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
    $("#bubble-theme").checkboxradio({ icon: false });
    $('#bubble-legend').html(preset.bubble + '%')
    $('#size-legend').html('X' + preset.size)
    fontSelected()
};
