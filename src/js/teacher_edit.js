var queryString = {
  parse: function (searchStr) {
    var startSubIndex = searchStr.indexOf('?') === 0 ? 1 : 0
    searchStr = searchStr.substr(startSubIndex)
    var paris = searchStr.split('&')
    var obj = {}
    paris.forEach(function (item) {
     
      item = item.split('=')
      obj[item[0]] = item[1]
    })
    return obj
  }
}


requirejs(['jquery', 'template'], function ($, template) {
  var id = queryString.parse(window.location.search).id
  var form = $('#form')
  $.ajax({
    url: '/api/teacher/edit',
    data: {
      tc_id: id
    },
    dataType: 'json',
    success: function (data) {
      if (data.code == 200) {
        var htmlStr = template('tpl', {
          teacher: data.result
        })
        form.html(htmlStr)
      }
    },
    error: function () {
    }
  })

  
  form.on('submit', function (e) {
    e.preventDefault()
    var formData = $(this).serialize()
    $.ajax({
      url: '/api/teacher/update',
      type: 'post',
      data: formData,
      dataType: 'json',
      success: function (data) {
        if (data.code == 200) {
          window.alert('更新成功！')
          window.location.href= '/teacher_list.html'
         
        }
      }
    })
  })
})