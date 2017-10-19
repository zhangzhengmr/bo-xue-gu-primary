
requirejs.config({
  // 这里的 baseUrl 是相对于网站根目录
  baseUrl: 'js',
  // 这里是加载的时候，把 bootstrap 预先加载进来
  // 同时预加载了 check-login.js 文件校验是否已登陆
  deps: ['bootstrap', 'checkLogin','pageInit'],
  paths: {
    jquery: '../vendor/jquery/dist/jquery',
    bootstrap: '../vendor/bootstrap/dist/js/bootstrap',
    checkLogin: './common/check-login',
    pageInit:'./common/init',
    template:'../vendor/art-template/lib/template-web',
    validation: '../vendor/jquery-validation/dist/jquery.validate',
    localization: '../vendor/jquery-validation/dist/localization/messages_zh'
    

  },
  shim: {
    // bootstrap 依赖了 jquery  这是配置依赖的简写方式
    bootstrap: ['jquery'],
   
  }
})
