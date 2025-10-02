const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const message = require('./utils/message');
const { jwtMiddleware, parseToken } = require('./utils/tokenJwt');
const indexRouter = require('./routes/index');

const app = express();

// 1. CORS 跨域设置中间件
// 解决前端跨域请求问题，设置允许的请求头和方法
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", '3.2.1');
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

// 2. Token 验证中间件
// 对除登录和注册外的所有路由进行 token 验证
const noTokenRoutes = ['/login', '/register'];
app.use((req, res, next) => {
  if (noTokenRoutes.includes(req.path)) {
    return next(); // 跳过 token 验证
  }
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json(message.createMessage(false, '未提供Token', null, 401));
  }
  jwtMiddleware(req, res, next);
});

// 3. 日志记录中间件
// 记录 HTTP 请求日志
app.use(logger('dev'));

// 4. 请求体解析中间件
// 解析 JSON 格式的请求体
app.use(express.json());
// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));

// 5. Cookie 解析中间件
// 解析客户端发送的 cookie
app.use(cookieParser());

// 6. 静态资源服务中间件
// 提供 public 目录下的静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 7. 路由中间件
// 挂载应用的主要路由
app.use('/', indexRouter);

// 8. 404 错误处理中间件
// 捕获未匹配任何路由的请求
app.use((req, res, next) => {
  next(createError(404));
});

// 9. 全局错误处理中间件
// 处理应用中未捕获的错误
app.use((err, req, res, next) => {
  // 设置错误信息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
