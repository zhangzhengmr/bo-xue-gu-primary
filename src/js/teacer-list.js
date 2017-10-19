requirejs(['jquery','template'],function($,template){
  $('body').on('click','[name="logoff"]',function () {
    var ts =$(this)
    var id = ts.parent().data('id')
    var status = ts.hasClass('btn-success') ? 1 : 0
    $.ajax({
      url:'/api/teacher/handle',
      type:'post',
      data:{
        tc_id:id,
        tc_status:status
      },
      success:function (data) {
        if(data.code==200){
          if(data.result.tc_status==0){
            ts
              .html('注销')
              .removeClass('btn-success')
              .addClass('btn-warning')
          }else if(data.result.tc_status==1){
            ts
            .html('启用')
            .removeClass('btn-warning')
            .addClass('btn-success')
          }
        }
      }
    })

 })

  $.get('/api/teacher',function(data){
    if(data.code == 200){
      var htmls= template('tpl',{
        list: data.result
      })
      $('#tbody').html(htmls)
    //   $('[name=="logoff"]').on('click',function () {
    
    //  })
    } 
  })
  
})