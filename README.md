# 在线教育管理系统

## 预览项目模板

下载静态页模板到本地：

```bash
$ git clone https://github.com/lipengzhou/admin-template.git
```

安装依赖：

```bash
$ cd admin-template
$ npm install
```

启动预览：

```bash
$ npm start
```


### 版本说明
```
文件里面配置完毕,在命令窗口 直接输入 gulp 就可以打开页面(预览项目模板 是说的静态模板文件的具体流程)
```

## 搭建 Gulp 任务工作流

### 找痛点

- 编译 less
- 提取 HTML 公共部分
- 图片压缩
- js 合并压缩
- 在开发过程中我希望能代码修改完毕，帮我自动刷新浏览器

### 目录结构

> https://github.com/h5bp/html5-boilerplate

### 将 `gulp` 配置到项目中

安装 `gulp` 到项目中：

```bash
$ npm i -S gulp
```

在项目根目录下创建 `gulpfile.js`


### 解决 less 编译问题

安装插件：

```bash
# gulp-less 编译 less 到 css
# gulp-csso 压缩 css
$ npm i -S gulp-less gulp-csso
```

- 公共的样式文件
- 页面私有的样式文件

### 处理 html 页面公共部分

- https://github.com/sindresorhus/gulp-nunjucks
- 有中文API   https://mozilla.github.io/nunjucks/templating.html#include

安装插件：

```bash
$ npm i -S gulp-nunjucks
```

然后把页面中公共的部分一块一块提取出来独立的放到 _partials 目录中。
完了之后在静态页面中，通过 `{% include "./_partials/header.html" %}` 来载入公共的部分。 //  把 ./_partials/header.html 的内容引入到当前位置

- 提取公共部分到 _partials
- 提取模板页
- 然后所有的页面都通过继承自模板页的方式去编写

注意：这种 html 是我们编译前的源码，浏览器肯定是不认识的，浏览器最终执行的是我们编译的 dist 中的结果。  
```bash
gulp.task('html',function(){
 return gulp.src('src/index.html')
  .pipe(nunjucks.compile())
  
  .pipe(gulp.dest('./dist/'))

})

.pipe(nunjucks.compile())  //compile({name:'lisi'}) 可以传参数,在 html 中可以接受 name 的值
```
这个插件,有类似模板引擎的效果,具体可以看视频 第6天  02-gulp-nunjuckks详解


### 加入开发服务，引入自动刷新浏览器的流程

这里使用一个在开发（编码）的时候的一个 WEB 工具：`browser-sync`

- browser-sync 是一个具有多重身份的包
- 装到全局，它会给你提供一个命令：`browser-sync`
- 装到项目中，可以结合 gulp 来配合工作流

我现在就要使用 `browser-sync` 来解决开发服务以及源码改动浏览器自动刷新的问题。

第一，在本地项目安装 `browser-sync`：

```bash
$ npm install --save browser-sync

$ npm install browser-sync --save-dev
```

然后参考：https://browsersync.io
### 监视文件改动 当改动后重新编译改动的文件
```bash
//当监视对象发生改变,执行第二个参数(函数) , event  改变对象的路径

 gulp.watch('./src/index.html',function(event){
    gulp.src(event.path) // event 是一个对象 .path 是具体的路径
    .pipe(nunjucks.compile()) //编译改变的文件
    .pipe(gulp.dest('./dist/'))
  })

  gulp.watch('./src/css/*.less',function(event){
    gulp.src(event.path) // event 是一个对象 .path 是具体的路径
    .pipe(less())
    .pipe(cssMinify())
    .pipe(gulp.dest('./dist/css'))
  })
```

### 项目中使用的第三方包问题

- www 目录是 dist 目录
- dist 目录中访问不到第三方包 node_modules
- 所以我们把项目中需要使用到的第三方包（非构建工具类的包）拷贝到 dist 目录中

为了分清楚什么是开发构建工具包（gulp、gulp-csso、gulp-nunjucks），
什么是项目中运行使用的包（jquery、bootstrap之类的）。所以我们在安装包的时候，把开发构建工具包使用 `--save-dev` 来保存依赖信息。
把 jquery、bootstrap 之类的包通过 --save 保存到 dependencies 依赖项中。

无论 `--save` 还是 `--save-dev` 都是会把包安装到本地项目中，唯一的区别就是：

- `--save` 会包依赖信息保存到 `dependencies` 中
- `--save-dev` 会把包的依赖信息保存到 `devDependencies` 中

我们依赖把开发构建相关的包的依赖信息保存到 `devDependencies` ，
而把项目中需要通过 `script、link` 加载使用的包的信息保存到 `dependencies` 中。

现在开始解决把 `jquery、bootstrap` 之类的包拷贝到 dist 目录中。
### 拷贝第三方包到 dist 文件
第一：读取 `package.json` 文件

```
// 读取到的就是 package.json 文件中的 json 对象
var pkg = require('./package.json')

```
第二: 拷贝
```bash
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
```
### 处理图片问题
参考文档：http://blog.csdn.net/zhongguohaoshaonian/article/details/53213657
		https://github.com/sindresorhus/gulp-imagemin
- 简单一点直接复制
- 压缩图片处理
- 压缩失败问题

#### gulp-imagemin 不压缩解决方案
- http://www.circle.ink/gulp-imagemin-cai-keng-zhi-nan/

``` bash
var gulp = require('gulp')
var imagemin = require('gulp-imagemin')

// gulp-imagemin
// 有的可以，有的不行
// npm i -D gulp-imagemin
//
// 注意：安装的过程容易卡到 node lib/index.js 环节
// 这里的解决方案是按 Ctrl + C 停止安装,然后删除  npm un gulp-imagemin
// 然后 cd 到 node_modules/gulp-imagemin 目录下执行 npm install
// 如果不行就多次尝试，直到安装成功为止

gulp.task('default', () =>
gulp.src('img/*')
// 这里不需要 imagemin([], ())
// 直接 imagemin() 即可
.pipe(imagemin())
.pipe(gulp.dest('dist/img'))
)
```

第一步:
```bash
var imagemin =require('gulp-imagemin')
```
第二步:
```bash

gulp.task('imagemin',function(){
  return gulp.src('./src/img/*',{
    base:'./src'
  })
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/'))
})
```
### 配置代理解决跨域问题

```
// 如果请求路径是以 / 开头的，则这个 / 表示的是 url 根路径
// 我在 browser-sync 中配置了一个代理服务中间件
// 这里代理服务会匹配你的请求路径，如果你请求的路径是以 /api 开头的，则我走代理服务
// 如果不是以 /api 开头的，则走默认的 browser-sync 这个服务
// http://api.botue.com/login
// http://api.botue.com/logout
// http://api.botue.com/teacher/add
// 我不可能把所有的接口地址都配置到代理规则列表中
// 所以我走了一个取巧的方式：
//    我给你约定好，只要你的请求路径是以 /api/**** 开头的，我就直接走代理了
//    其它非 /api/** 开头的请求，我不管，直连
// 我们不是程序员，我们是 GitHub 的搬运工
```

第一步：安装 `http-proxy-middleware`

```bash
$ npm install --save-dev http-proxy-middleware
```

第二步：在 gulpfile.js 中引入 `http-proxy-middleware` 包：

```javascript
var proxy = reuqire('http-proxy-middleware')
```

第三步：在 gulpfile 中定义一个代理配置对象：

```javascript
var jsonPlaceholderProxy = proxy('/api', {
  target: 'http://api.botue.com',
  changeOrigin: true,
  pathRewrite: {
    '/api': '', // rewrite path
  },
  logLevel: 'debug'
})
```

第四步：将上一步定义的代理配置对象结合到 browser-sync 中：

```javascript
browserSync.init({
  server: {
    baseDir: './',
    port: 3000,
    middleware: [jsonPlaceholderProxy]
  },
  startPath: '/users'
})
```
## 接口测试

- 拿到服务端给的接口
- 确保接口正确的情况下再去进行开发

这里我们使用 postman 这个工具来进行接口测试。

https://www.getpostman.com/

## 登陆退出权限认证

- 在每个页面中都对一个需要具有权限的接口发起一个请求
- 如果这个接口返回 401 则说明我们现在没有登陆
  + 401 之后，我们就让用户跳转到 login.html 页面
- 如果返回 200 则说明登陆成功了
  + 则正常渲染这个页面

- 由于我们这个是后台管理系统，所以除了登陆页面 login.html 之外都必须对登陆权限做验证
  + 就是说如果没有登陆，则让其跳转到登录页进行登陆
  + 如果登陆了，则让其正常通过

- 如何验证用户是否登陆了

正常情况下：

- 发送这个小纸条凭证给服务器
- 服务器收到之后验证你的凭证的正确性
- 如果正常，则告诉你没有问题
- 如果凭证，则告诉你凭证有问题

关键是我们这里没有单独验证登陆权限的接口，所以我们找了一个需要登陆权限的接口来使用：

http://api.botue.com/teacher/profile

我之前说过，如果一旦客户端拿到了服务器的给的小纸条（Cookie），
则客户端会在以后的每一次对服务器的请求中都会自动携带着这个小纸条到服务器。
也就是说，我请求 `http://api.botue.com/teacher/profile` 地址的时候，如果客户端有那个小纸条，则客户端会自动携带上去。
如果客户端没有，则不会携带。

- 如果有，则带着上去
- 服务器收到请求之后，会先看一下你有没有这个小纸条，如果有再验证小纸条的正确性
  + 如果正确，则给你正确的数据
  + 如果验证失败，则告诉你 401 没有权限

也就是说第一得有小纸条，第二小纸条必须具有正确性。


所以，我们在所有的除了 login.html 的页面中，都加了一个登陆权限认证。
## 其它

### $.data()

- $('body').data('foo', 'bar')
- $('body').data('foo')
- $('body').data()

```javascript
$( "body" ).data( "foo", 52 );
$( "body" ).data( "bar", { myType: "test", count: 40 } );
$( "body" ).data( { baz: [ 1, 2, 3 ] } );
$( "body" ).data( "foo" ); // 52
$( "body" ).data(); // { foo: 52, bar: { myType: "test", count: 40 }, baz: [ 1, 2, 3 ] }
```

## 插件

- 表单验证插件
- 分页插件
  + 服务端
  + 客户端分页处理
- 富文本插件
- 日期插件
- 图片裁切插件

## 剩余业务构建顺序

- 课程管理
  + 课程分类
  + 课程添加
  + 课程列表

- 侧边栏

- 百度推广
- websocket
- 全局 ajax 请求错误处理

## 反馈

- 如何jqueryLazyload方式 实现图片懒加载呢?   或者什么方式实现比较好呢
  + https://github.com/tuupola/jquery_lazyload
- 函数式编程
  + https://www.gitbook.com/book/llh911001/mostly-adequate-guide-chinese
- JavaScript 错误 - Throw、Try 和 Catch
  + 异步捕获
  + 服务端对于异常捕获非常敏感，而且必须做异常捕获，尤其是 Node.js
- 怎么描述项目？
  + 项目概述
  + 项目团队人员配比
    * 服务端
    * 前端
      - WEB 前端
      - Android
      - IOS
      - WP
    * 测试小姐姐 -> 人力测试
    * 设计小姐姐
    * 产品经理
    * 项目经理
    * 技术 leader
    * 架构师
    * 作为一个开发人员：快
  + 功能模块的划分
    * 用户模块
    * 产品模块
    * 分类模块
    * 。。。
  + 具体你在这个项目中开发维护了哪些模块
  + 项目技术栈
    * git 版本管理工具
    * npm 包管理工具
    * RequireJS 模块加载器
    * gulp 开发打包工具
    * jQuery 库
    * jQuery 插件
- 关于上传文件，就是怎么限制上传文件类型，比如说图片，我点击上传，弹出的对话框里只能看见图片，其他格式的文件都看不见
- 老师，聊一下函数的柯里化吧
  + 学术派
- 上班的工作流程
  + 办理入职手续
  + 安装机器环境
  + 看文档
  + 看源码
  + 把开发的项目部署到自己的机器上，看文档和源码，准备参与开发
  + 慢慢的会给你分任务
  + 192 bit
  + 128 bit
- 如果要手机展示项目要怎么做呢
  + 移动 APP
  + 最后会教你怎么打包成 app
  + 打包成一个可以安装到手机上的应用文件
  + 微信小程序，可以直接开发出来直接运行在微信平台，体现效果比手机移动网站要超级好
  + 微信小程序体验仅次于混合 APP
  + 原生 APP > 混合 APP -> 移动网页、微信小程序

## jquery 中的全局事件

