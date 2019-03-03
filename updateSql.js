const fs = require('fs')
const path = require('path')
const Pool = require('./core/pool')

var myPool = new Pool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'comicbooks'
})
// 创建表
let imgCreateSql = `create table if not exists img
(
  Id int PRIMARY KEY AUTO_INCREMENT,
  Name varchar(255) NOT NULL,
  Src varchar(255) NOT NULL
)`
let comicCreateSql = `create table if not exists comic
(
  Id int AUTO_INCREMENT,
  Name varchar(40) NOT NULL,
  Type varchar(10),
  Src varchar(255) NOT NULL,
  Info varchar(255) DEFAULT '漫画无简介。',
  Author varchar(40) DEFAULT '未知',
  primary key(Id)
)`
let chapterCreateSql = `create table if not exists ??
(
  Index int AUTO_INCREMENT,
  Name varchar(40) NOT NULL,
  ComicId varchar(20) NOT NULL,
  ChapterName varchar(40) NOT NULL,
  primary key(Index)
)`
// 插入数据
let imgInsertSql = `insert into img (Name, Src)
values ?`
let comicInsertSql = `insert into comic (Name, Src)
values ?`
// 清空表内数据
let imgTruncateSql = `truncate table img`
let comicTruncateSql = `truncate table comic`

// 读取文件夹
async function readdir (path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function createPool () {
  try {
    // 链接数据库、读取文件
    let result_1 = await Promise.all([
      myPool.getConnection(), readdir('./lib/img'),
      readdir('./lib/comic')
    ]).catch(e => {
      throw new Error(e)
    })
    let connection = result_1[0]
        imgData = result_1[1]
        comicData = result_1[2]
    
    // 创建表
    await Promise.all([
      myPool.query(connection, imgCreateSql),
      myPool.query(connection, comicCreateSql)
    ]).catch(e => {
        throw new Error(e)
    })
    
    // 清空原表内容
    await Promise.all([
      myPool.query(connection, imgTruncateSql),
      myPool.query(connection, comicTruncateSql)
    ]).catch(e => {
      throw new Error(e)
    })

    // 插入表内容
    function valuesGet (pathSlice, data, callback) { // 获取values
      let values = []
      let basePath = path.resolve(__dirname, pathSlice)
      for (let v of data) {
        let pathSingle = path.resolve(basePath, v)
        let result = callback(v)
        let value = [...result, pathSingle]
        values.push(value)
      }
      return values
    }

    let imgValues = valuesGet('./lib/img', imgData, v => [/^.*(?=\..*$)/.exec(v)[0]])
    let comicValues = valuesGet('./lib/comic', comicData, v => [v])

    await Promise.all([
      myPool.query(connection, imgInsertSql, [imgValues]),
      myPool.query(connection, comicInsertSql, [comicValues])
    ])

  } catch (err) {
    console.log(err)
  }
}

createPool()
