const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const Pool = require('./core/pool')
const basePath = path.resolve(__dirname, 'lib')

var myPool = new Pool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'comicbooks'
})

// 读取文件夹
function readdir (path, {encoding='utf8', withFileTypes=false} = {}) { // 默认值写的有问题
  try {
    return new Promise((resolve, reject) => {
      fs.readdir(path, {encoding, withFileTypes}, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  } catch (e) {
    throw new Error(e)
  }
}
// 读取文件
function readFile (path) {
  try {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          console.log(path + '不存在')
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  } catch (e) {
    throw new Error(e)
  }
}
// 重命名
function rename (oldPath, newPath) {
  try {
    return new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, err => {
        if (err) {
          console.log(oldPath + '重命名失败')
          reject(err)
        } else {
          resolve()
        }
      })
    })
  } catch (e) {
    throw new Error(e)
  }
}
// 创建表并插入数据
async function createInsert (connection, {createSql, insertSql}, name, values) {
  try {
    await myPool.query(connection, createSql, [name])
    await myPool.query(connection, insertSql, [name, values])
  } catch(e) {
    throw new Error(e)
  }
}
// 获取一个不重复的随机字符串
function randomStr (array) {
  let newStr = ''
  while(array.includes(newStr) || newStr === '') {
    newStr = crypto.randomBytes(8).toString('hex')
  }
  return newStr
}
// 改名并返回新名列表
async function comicRename (comicPath) {
  try {
    let dirs = [], renames = []
    let comicDirs = await readdir(comicPath)
    for (let d of comicDirs) {
      let newName = randomStr(dirs)
      dirs.push(newName)
      renames.push(rename(path.join(comicPath, d), path.join(comicPath, newName)))
    }
    await Promise.all(renames)
    return dirs
  } catch (e) {
    throw new Error(e)
  }
}

async function createPool (connection) {
  try {
    // img表的创建和插入
    async function imgCreateInsert (connection, basePath) {
      try {
        let imgPath = path.join(basePath, 'img')
        let imgFiles = await readdir(imgPath)
        let values = imgFiles.map(f => {
          let src = path.resolve(imgPath, f)
          return [f, src]
        })
        await createInsert(connection, {
          createSql: `create table ??
          (
            imgId int primary key auto_increment,
            imgName varchar(40) not null,
            imgSrc varchar(255) not null,
            unique(imgName)
          )`,
          insertSql: `insert into ?? (imgName, imgSrc)
          values ?`
        }, 'web_img', values)
      } catch (e) {
        throw new Error(e)
      }
    }
    // comic表的创建和插入
    async function comicCreateInsert (connection, basePath) {
      try {
        let comicPath = path.join(basePath, 'comic')
        let dirs = await comicRename(comicPath)
        async function valuesGet (d) { // 获取values值的promise对象数组
          let currentComicPath = path.join(comicPath, d)
          let data = await readFile(path.join(currentComicPath, 'info.json'))
          let info = JSON.parse(data)
          let cover = path.join(currentComicPath, info.cover)
          return [d, info.name, info.type, info.intro, info.author, cover, currentComicPath]
        }
        let valueGroup = []
        let chapters = []
        for (let d of dirs) {
          let chapter = chapterCreateInsert(connection, comicPath, d)
          let value = valuesGet(d)
          chapters.push(chapter)
          valueGroup.push(value)
        }
        let allChapter = Promise.all(chapters) // 章节promise组
        values = await Promise.all(valueGroup)
        let createInsertPromise = createInsert(connection, {
          createSql: `create table ??
          (
            comicId int primary key auto_increment,
            comicKey varchar(16) unique,
            comicName varchar(40) not null,
            comicType varchar(10),
            comicSrc varchar(255) not null,
            comicIntro varchar(255) default '无简介。',
            comicAuthor varchar(40) default '未知',
            comicCover varchar(255)
          )`,
          insertSql: `insert into ?? (comicKey, comicName, comicType, comicIntro, comicAuthor, comicCover, comicSrc)
          values ?`
        }, 'web_comic', values)
        await Promise.all([allChapter, createInsertPromise])
      } catch(e) {
        throw new Error(e)
      }
    }

    // chapter表创建和插入
    async function chapterCreateInsert (connection, comicPath, id) {
      try {
        let currentComicPath = path.join(comicPath, id)
        let dirs = await readdir(currentComicPath, {withFileTypes: true})
        let values = [], comicPages = []
        dirs.forEach((d, i) => {
          if (d.isDirectory()) {
            let comicPage = comicPageCreateInsert(connection, currentComicPath, d.name, id, i + 1)
            comicPages.push(comicPage)
            values.push([id, d.name])
          }
        })
        let comicPagePromise =  Promise.all(comicPages) // 漫画页promise组
        let createInsertPromise = createInsert(connection, {
          createSql: `create table ??
          (
            chapterId int primary key auto_increment,
            comicKey varchar(16),
            chapterName varchar(40) not null unique
          )`,
          insertSql: `insert into ?? (comicKey, chapterName)
          values ?`
        }, id + '_chapter', values)
        await Promise.all([comicPagePromise, createInsertPromise])
      } catch (e) {
        throw new Error(e)
      }
    }
    // comicPage表创建和插入
    async function comicPageCreateInsert (connection, currentComicPath, chapter, id, index) {
      try {
        let chapterPath = path.join(currentComicPath, chapter)
        let data = await readdir(chapterPath)
        let values = data.map(f => {
          let src = path.join(chapterPath, f)
          return [id, f, src, chapter]
        })
        await createInsert(connection, {
          createSql: `create table ??
          (
            comicPageId int primary key auto_increment,
            comicKey varchar(16) ,
            comicPageName varchar(20) not null unique,
            comicPageSrc varchar(255) not null,
            chapterName varchar(30) not null
          )`,
          insertSql: `insert into ?? (comicKey, comicPageName, comicPageSrc, chapterName)
          values ?`
        },  id + '_' + index + '_comicPage', values)
      } catch(e) {
        throw new Error(e)
      }
    }

    let allQuery = [
      imgCreateInsert(connection, basePath),
      comicCreateInsert(connection, basePath)
    ]
    await Promise.all(allQuery)
    myPool.destroy(connection)
  } catch (err) {
    throw new Error(err)
  }
}

myPool.getConnection()
.then(createPool)
.catch (e => {
  throw new Error(e)
})
