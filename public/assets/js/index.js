const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const abc = 'abcdefghijklmnopqrstuvwxyz'
const misc = '0123456789()!@$*#'

function makeFontURL(p1, preview) {
  var furl = endpoint
  if (preview) {
    if ($('#bubble').attr('checked')) {
      if ($('#bubflip').attr('checked')) { furl += '/b-u' }
      else { furl += '/b-d' }
      furl += '/bp-' + $('#bubpos').slider('value')
    }
  }
  furl += '/y-'+$('#pickfont').val()
  furl += '/z-'+$('#zdepth').val()
  if ($('#fsize').val()> 0) {
    if (preview) furl += '/dbl-' + $('#fsize').val()
    else furl += '/dbl-3'
  }
  furl += '/x-'
  if (p1 == 'no') { furl += $('#input').val() }
  else if (p1 == 'caps') { furl += ABC }
  else if (p1 == 'lows') { furl += abc }
  else if (p1 == 'nums') { furl += misc }
  return furl
}

function updatePreview () {
  var url = makeFontURL('no', true)
  $('#generated').attr('src', url)
  $('#blank').attr('href', url)
}

$(document).ready(function() {
  var counter = 0
  for (const [key, value] of Object.entries(fonts)) {
    counter += 1
    $('#pickfont').append(`<option variants="${value.variants}" value="${key}">${counter}. ${value.name}</option>`)
  }
  $('.box').corner({antiAlias: false})
  $('#pickfont').val("arcade")
  $('#bubpos').slider({
    value: 25,
    min: 0,
    max: 100,
    step: 5,
    slide: function(event, ui) { $('#pos').html(ui.value + '%') },
    change: function(event, ui) {
      updatePreview()
      $('#pos').html(ui.value + '%')
    }
  })

  // checking for bubbles / flipping side
  $('#bubble,#bubflip').click(function(){
    updatePreview()
  })

  $('#doit').click(function() {
    updatePreview()
  })

  $('#fontsize a').bind('click', function() {
    $('#fsize').val($(this).attr('value'))
    updatePreview()
  })

  $('#pickfont').change(function() {
    // read the number of variants
    var curvars = $('#pickfont option:selected').attr("variants")
    var curfont = $('#pickfont').val()
    if (Number($('#zdepth').val()) >= curvars) $('#zdepth').val('0')
    // clear the container
    $('#fontsel').empty()
    $('#notes').empty()
    $('#notes').load('/assets/notes/' + curfont + '.txt').error($('#notes').html('No notes for this font.'))
    // now do a loop
    for (var i=0; i < curvars; i++) { // The WOO! loop
      var woo = '<a id="zd'+ i +`"><img class="shake pointer" style="margin-right: 10px;" src="${endpoint}/dbl-2/y-` + curfont +'/z-' + i + '/x-'+ ABC.charAt(i) +'" /></a>'
      $('#fontsel').append(woo)
      $('#fontsel a').bind('click', function() {
        $('#zdepth').val($(this).attr('id').replace('zd',''))
        updatePreview()
        $('#generated2').attr('src',makeFontURL('caps'))
        $('#generated3').attr('src',makeFontURL('lows'))
        $('#generated4').attr('src',makeFontURL('nums'))
      })
      updatePreview()
      $('#generated2').attr('src',makeFontURL('caps'))
      $('#generated3').attr('src',makeFontURL('lows'))
      $('#generated4').attr('src',makeFontURL('nums'))
    }
  })
  $('#input').change(function() {
    var value = $('#input').val()
    $('#input').val(value.replace(/[\u{0080}-\u{FFFF}]/gu, ''))
    updatePreview()
  })
})