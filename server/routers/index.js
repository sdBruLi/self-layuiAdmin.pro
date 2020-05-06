var express = require('express');
// 引入jsonwebtoken
var jwt = require('jsonwebtoken')
var router = express.Router();
// const md5 = require('blueimp-md5')
const _filter = { 'pwd': 0, '__v': 0 } // 查询时过滤掉
// const sms_util = require('../util/sms_util')
const users = {}
// var svgCaptcha = require('svg-captcha')
const createToken = require('../token/createToken')
const checkToken = require('../token/checkToken')

const bytes = require('bytes');
const multer = require('multer')

// 配置multer
const storage = multer.memoryStorage()
const upload = multer({
  dest: "../public/imgs",
  storage: storage,
  limits: {
      fileSize: bytes('2MB') // 限制文件在4MB以内
  },
  // fileFilter: function(req, files, callback) {
  //     // 只允许上传jpg|png|jpeg|gif格式的文件
  //     var type = '|' + files.mimetype.slice(files.mimetype.lastIndexOf('/') + 1) + '|';
  //     var fileTypeValid = '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
  //     callback(null, !!fileTypeValid);
  // }
})
const os = require("os")
const fs = require('fs')
const path = require('path')

var bodyParser = require('body-parser');//post提交需要
var urlencodedParser = bodyParser.urlencoded({ extended: false })//post提交需要  // 创建 application/x-www-form-urlencoded 编码解析
router.use(bodyParser.urlencoded({
  extended:false // 这里是返回数据为false则是对象或者数组形式，为true则为任意数据类型
}))
router.use(bodyParser.json()) // 指定post请求的数据为json数据
const { connection, escape, exec } = require('../db/index.js');

/* router.post('/login', urlencodedParser, (req, res) => {
  let username = escape(req.body.username)
  let password = escape(req.body.password)

  const sql = `select username from tess1 where username=${username} and password=${password} `

  connection.query(sql, (err, result)=>{
    if(err) console.log(err)
    else if(result.length){
      // console.log(result)
      res.send('登录成功');
    }
  })
}) */

// 请求所有数据列表
router.get('/all', async (req, res) => {
  // console.log(req.query)
  const page = req.query.page
  const limit = req.query.limit

  let sql = `select  id, title, sketch from crudtest limit ${(page - 1) * limit},${limit};`
  const data = await exec(sql)
  sql = `select count(*) as total from crudtest`
  let total = await exec(sql)
  // console.log(total[0].total)
  res.send({ code: 0, data: data, page: page, limit: limit, count: total[0].total })

})

// 添加数据
router.post('/save', urlencodedParser, (req, res) => {
  // console.log(req.body.title, req.body.sketch)
  var title = req.body.title, sketch = req.body.sketch
  let post = { title, sketch }
  let sql = `INSERT INTO crudtest SET ?;`

  // const result = exec(sql)

  connection.query(sql, post, (err, result) => {
    if (err) console.log(err)
    else {
      res.send({ code: 0, status: 200, msg: '添加成功', data: {} })
    }
  })
})


// 删除数据
router.post('/del', urlencodedParser, (req, res) => {
  // console.log(req.body)
  var id = req.body.id
  let sql = `DELETE FROM crudtest where id = ${id}`

  // const result = exec(sql)

  connection.query(sql, (err, result) => {
    if (err) console.log(err)
    else {
      res.send({ code: 0, status: 200, msg: '删除成功', data: {} })
    }
  })
})

// 删除多行数据
router.post('/delmove', urlencodedParser, (req, res) => {

  var ids = req.body.ids // [6,7]
  var s = JSON.parse(ids).join(',')
  console.log(s)
  let sql = `DELETE FROM crudtest where id in (${s})`
  // const result = exec(sql)
  connection.query(sql, (err, result) => {
    if (err) console.log(err)
    else {
      res.send({ code: 0, status: 200, msg: '删除多行成功', data: {} })
    }
  })
})


// 编辑修改数据
router.post('/update', urlencodedParser, (req, res) => {
  // console.log(req.body)
  var id = req.body.id, title = req.body.title, sketch = req.body.sketch
  let sql = `UPDATE crudtest SET title ='${title}',sketch = '${sketch}' WHERE id = '${id}'`
  // const result = exec(sql)

  connection.query(sql, (err, result) => {
    if (err) console.log(err)
    else {
      res.send({ code: 0, status: 200, msg: '修改成功', data: {} })
    }
  })
})

// 上传图片 (还有bug未解决)
router.post('/updateimg', urlencodedParser,  (req, res) => {
  upload.single("file")(req, res, function(err) {
    if (err) return console.error(err);
    if (req.file && req.file.buffer) {
        var imges = req.file
        
        var imgesori = imges.originalname
        var radname = Date.now() + parseInt(Math.random() * 999)
        var oriname = imgesori.lastIndexOf('.')
        var hzm = imgesori.substring(oriname, oriname.length)
        var pic = radname + hzm
        
        fs.writeFile(path.join(__dirname, '../public/imgs' + pic), data, (err) => {
          if (err) {
              console.log("图片写入失败！")
              res.send({
                  code: -1,
                  msg: "图片上传失败！"
              })
              return
          }
          const couter = os.networkInterfaces()
          for (var cm in couter) {
              var cms = couter[cm]
          }
          var picPath = "http://"+cms[1].address + ':3001' + '/public/imgs/' + pic
          console.log(picPath)
          // var insertPic = "insert into pic_table(pic_router) values('" + picPath + "')"
          // connsql.query(insertPic, (err, result) => {
          //     if (err) {
          //         console.log("保存到数据库失败！")
          //     }
          //     res.send({
          //         code: 200,
          //         msg: "图片上传成功",
          //         urls: picPath
          //     })
          // })
        })

    }
  });
})




module.exports = router
