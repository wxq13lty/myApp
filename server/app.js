const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const message = require('./utils/message');
const { jwtMiddleware } = require('./utils/tokenJwt');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
// 响应头设置，解决跨域问题
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", '3.2.1');
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});
// 配置不需要token的路由
const noTokenRoutes = ['/login', '/register']; // 添加不需要 token 的路由

// 中间件：检查 token
app.use((req, res, next) => {
  if (noTokenRoutes.includes(req.path)) {
    return next(); // 跳过 token 验证
  }
  const token = req.headers['authorization'];
  console.log(req.headers);
  if (!token) {
    return res.status(401).json(message.createMessage(false, '未提供Token', null, 401));
  }
  jwtMiddleware(req, res, next);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in developmen
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
