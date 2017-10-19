var queryString = {
  parse: function (searchStr) {
    var startSubIndex = searchStr.indexOf('?') === 0 ? 1 : 0
    searchStr = searchStr.substr(startSubIndex)
    var paris = searchStr.split('&')
    var obj = {}
    paris.forEach(function (item) {
      // item xxx=xxx
      item = item.split('=')
      obj[item[0]] = item[1]
    })
    return obj
  }
}



requirejs(['jquery'],function($){
  $('#form').on('submit',function(e){
    e.preventDefault()
    var formData = $(this).serialize()
    $.ajax({
        url:'/api/login',
        type:'post',
        data:formData,
        dataType:'json',
        success:function(data){
          window.location.href = queryString.parse(window.location.search).return_to || '/'
        },
        error:function(e){
          var res = e.responseJSON
          if (res.code === 404) {
            window.alert('用户名或者密码错误')
          }
        }

    })
  })
})