//引入
const express = require('express');
const cors = require('cors')
const app = express();

// app.use(express.static('public'));


app.use(cors());
//另一种跨域设置
/* app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
}); */

// 声明使用路由器中间件
const indexRouter = require('./routers/index.js')
app.use('/', indexRouter)



app.listen(3000, (err) => {
  if (!err) console.log('服务器启动成功了:http://localhost:3000');
  else console.log(err);
});