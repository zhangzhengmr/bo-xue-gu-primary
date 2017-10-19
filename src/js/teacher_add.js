console.log('aaa')
requirejs(['jquery'], function ($) {

  $('#form').on('submit', function (e) {
    e.preventDefault()
    var forms = $(this).serialize()
    $.ajax({
      url: '/api/teacher/add',
      data: forms,
      dataType: 'json',
      success: function (data) {
        if (data.code == 200) {
          window.location.href = '/teacher_list.html'
        }
      }
    })
  })
})
