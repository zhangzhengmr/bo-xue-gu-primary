requirejs(['jquery','template','./data/region'],function ($,template,region) {
 
  $.ajax({
    url:'/api/teacher/profile',
    type:'get',
    success:function (data) {
      if(data.code==200){
        var html = template('tpl',{
          teacher: data.result,
          province: region.province,
          city: region.city,
          area: region.area
        })
        $('#form').html(html)
      }
    }
  })
})