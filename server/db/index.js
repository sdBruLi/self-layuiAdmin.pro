// 1.创建mysql
const mysql = require('mysql')

// 2. 创建连接对象
const connection = mysql.createConnection({
  host:'localhost', 
  user: 'root',
  password: 'Abcd@1234',
  port: '3306',
  database: 'layuiadmin20200425'
})

// 3.开始连接
connection.connect((err)=>{
  if(err) console.log(err)
  else console.log('数据库连接成功了')
})
// 4.进行数据库的操作

/* connection.query(sql, (err,result)=>{
  if(err) console.log(err)
  else console.log(result)
}) */

function exec(sql){
  return new Promise((resolve, reject)=>{
    connection.query(sql,(err, result)=>{
      if(err) reject(err)
      else resolve(result)
    })
  })
}


module.exports={
  exec,
  connection,
  //防sql的注入
  escape: mysql.escape
}