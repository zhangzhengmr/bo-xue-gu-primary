define(['jquery'],function($){
  $('#logout').on('click',function(){
    $.ajax({
      url:'/api/logout',
      type:'post',
      success:function(data){
        console.log(data)
        // if(data.code == 200){
          window.location.herf= '/login.html'
        //}
      }
    })
  })
  // 处理导航栏切换
  $('.navs ul').prev('a').on('click', function () {
    $(this).next().slideToggle();
  })

  var pathname = window.location.pathname
  if (pathname === '/') {
    pathname = '/index.html'
  }

  $('.navs a').each(function (index, item) {
    var $item = $(item)
    var itemHref = $item.attr('href')
    
    if (itemHref.indexOf( pathname) !== -1) {
      $item.addClass('active')
      $item.closest('ul').show()
    }
  })

})
