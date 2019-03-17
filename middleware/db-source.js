const fs = require('fs')
const mime = require('mime')
const Pool = require('../core/pool')

const myPool = new Pool(
  {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'comicbooks'
  }
)
// 读取数据库
async function db (pool, sql, values) {
  try {
    let connection = await pool.getConnection()
    let data = await pool.query(connection, sql, values)
    pool.destroy(connection)
    return data
  } catch (e) {
    throw new Error(e)
  }
}
// 图片处理
function imgManage (ctx, rpath) {
  if (rpath) {
    ctx.response.type = mime.getType(rpath)
    ctx.response.body = fs.createReadStream(rpath)
  } else {
    ctx.response.status = 404
  }
}
// 数据处理
function dataManage (ctx, data) {
  let dataStr = ''
  for (let v of data) {
    dataStr += JSON.stringify(v) + '&'
  }
  ctx.response.body = dataStr
}

function dbSrc () {
  return async (ctx, next) => {
    try {
      let pathname = decodeURI(ctx.request.path)
      let query = ctx.request.query
      let sql = '', data = null, values = []
      if (pathname.slice(0, 3) === '/db') {
        switch (pathname.slice(3)) {
          case '/img': // 图片
            values = [query.name]
            sql = `select imgSrc from web_img where imgName=?`
            data = await db(myPool, sql, values)
            imgManage(ctx, data[0].imgSrc)
            break
          case '/comicCover': // 漫画封面
            values = [query.id]
            sql = `select comicCover from web_comic where comicKey=?`
            data = await db(myPool, sql, values)
            imgManage(ctx, data[0].comicCover)
            break
          case '/comicList': // 漫画列表
            if (query.kind === '全部') {
              values = [query.sort]
              sql = `select comicKey, comicName, comicType from web_comic order by ?? desc`
            } else {
              values = [`%${query.kind}%`, query.sort]
              sql = `select comicKey, comicName, comicType from web_comic where comicType like ? order by ?? desc`
            }
            data = await db(myPool, sql, values)
            dataManage(ctx, data)
            break
          case '/comicDetail': // 单本漫画详情
            values = [query.id]
            sql = `select * from web_comic where comicKey=?`
            data = await db(myPool, sql, values)
            dataManage(ctx, data)
            break
          case '/distinct': // 没有重复值的单一列
            values = [query.column, query.table]
            sql = `select distinct ?? from ??`
            data = await db(myPool, sql, values)
            dataManage(ctx, data)
            break
          case '/chapter': // 选定章节名
            values = [query.table, query.chapterId]
            sql = `select chapterName from ?? where chapterId=?`
            data = await db(myPool, sql, values)
            dataManage(ctx, data)
            break
          case '/chapterList':
            values = [query.table]
            sql = `select * from ??`
            data = await db(myPool, sql, values)
            dataManage(ctx, data)
            break
          case '/comicPageList': // 章节列表
            values = [query.table]
            sql = `select comicPageId, comicPageName from ??`
            data = await db(myPool, sql, values)
            dataManage(ctx, data)
            break
          case '/comicPage': // 漫画页
            values = [query.table, query.name]
            sql = `select comicPageSrc from ?? where comicPageName=? `
            data = await db(myPool, sql, values)
            imgManage(ctx, data[0].comicPageSrc)
            break
          default:
            //
        }
      }
      await next()
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = dbSrc
