var gulp = require('gulp')
var less = require('gulp-less')
var cssMinify = require('gulp-csso')
var nunjucks = require('gulp-nunjucks')
var browserSync = require('browser-sync').create()
var pkg = require ('./package.json')  //读取 package.json 文件
var imagemin =require('gulp-imagemin')
var proxy = require('http-proxy-middleware')  //代理插件



// 代理配置选项
var jsonPlaceholderProxy = proxy('/api', {  
  target: 'http://api.botue.com',
  changeOrigin: true,
  pathRewrite: {  //路径重写
    '/api': '', // rewrite path  去掉请求地址中多的 /api   把/api 变成 空
  },
  logLevel: 'debug'
})
// var jsonPlaceholderProxy2 = proxy('/abc', {    //可以配置多个代理
//   target: 'xxxxxx',
//   changeOrigin: true,
//   pathRewrite: {  //路径重写
//     '/abc': '', // rewrite path  去掉请求地址中多的 /api   把/api 变成 空
//   },
//   logLevel: 'debug'
// })



//开启服务器 自动打开浏览器 监视文件变化 并刷新浏览器
// gulp.task('browser-sync', function() {
//   browserSync.init({
//       server: {
//           baseDir: "./dist" //用来设置 目录 自动显示
//       },
//       files:'./dist'  //监视  目录或文件  自动刷新
//   })
// })


//拷贝第三方包
gulp.task('vendor',function(){
  var dependencies = Object.keys(pkg.dependencies).map(function(item){
    return './node_modules/'+item+'/**/*'
  })

  return gulp.src(dependencies,{
    base:'./node_modules/'
  })
  .pipe(gulp.dest('./dist/vendor'))

})

// 编译less文件
gulp.task('less',function(){
  return gulp.src('src/css/*.less')
  .pipe(less())
  .pipe(cssMinify())
  .pipe(gulp.dest('./dist/css'))

})



//编译 html 
gulp.task('html',function(){
 return gulp.src('src/*.html')
  .pipe(nunjucks.compile())
  
  .pipe(gulp.dest('./dist/'))

})


//图片 压缩

gulp.task('imagemin',function(){
  return gulp.src('./src/img/*',{
    base:'./src'
  })
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/'))
})


gulp.task('js',function(){
  return gulp.src('./src/js/**/*',{
    base:'./src'
  })
  .pipe(gulp.dest('./dist/'))
})



gulp.task('default',['less','html','vendor','imagemin','js'],function(){

  browserSync.init({   //依赖前面完成之后 才能启动  不然可能看到空白页
    server: {
        baseDir: "./dist" ,//用来设置 目录 自动显示
        middleware: [jsonPlaceholderProxy]  //配合代理用 
        //middleware: [jsonPlaceholderProxy,jsonPlaceholderProxy,....]  //配合代理用 可以多个
    },
    files:'./dist',  //监视  目录或文件  自动刷新
    port: 8080
  }) 

  //当监视对象发生改变,执行第二个参数(函数) , event  改变对象的路径
  // gulp.watch('./src/css/*.css',['less'])
  // gulp.watch('./src/index.html',['html'])

  gulp.watch('src/*.html',function(event){
    gulp.src(event.path) // event 是一个对象 .path 是具体的路径
    .pipe(nunjucks.compile()) //编译改变的文件
    .pipe(gulp.dest('./dist/'))
  })

  gulp.watch('src/css/*.less',function(event){
    gulp.src(event.path) // event 是一个对象 .path 是具体的路径
    .pipe(less())
    .pipe(cssMinify())
    .pipe(gulp.dest('./dist/css'))
  })
  gulp.watch('src/js/**/*.js',function(event){
    gulp.src(event.path,{base:'./src/'}) 
    .pipe(gulp.dest('./dist/ '))
  })
})