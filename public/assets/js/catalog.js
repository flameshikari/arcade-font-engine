var counter = 0
for (const [key, value] of Object.entries(fonts)) {
  $.get(`/assets/notes/${key}.txt`, function(comment) {
      counter += 1
      $('.content_catalog').append(`
      <input type="hidden" value="${key}" name="fontchoice">
      <input type="hidden" value="${value.name}" name="string">
      <input style="margin: 10px 0 15px 0;" type="image" src="/api.php/y-${key}/x-${counter}. ${value.name}/dbl-2">
      <br>
      <div class="indent">
      ${comment}
      </div>
      <br>
      <br>
    `)
  })
}