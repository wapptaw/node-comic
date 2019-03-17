const http = require('http')
const url = require('url')
const baseUrl = 'http://localhost:3000'

// 数据获取
let dataGet = function (myUrl) {
  return new Promise((resolve, reject) => {
    http.get(myUrl, res => {
      let rawData = ''
      if (res.statusCode === 200) {
        res.setEncoding('utf-8')
        res.on('data', chunk => {
          rawData += chunk
        })
        res.on('end', () => {
          let data = []
          let arr = rawData.split('&')
          for (let v of arr) {
            if (v.length > 0) {
              data.push(JSON.parse(v))
            }
          }
          resolve(data)
        })
      } else {
        reject(res.statusCode)
      }
    }).on('error', e => {
      console.error(`出错：${e.message}`)
    })
  })
}

// 漫画列表数据获取
let comicDataGet = async function (kind = "全部", sort = 'hot') {
  try {
    let myUrl = new url.URL(`${baseUrl}/db/comicList?kind=${kind}&sort=${sort}`)
    return await dataGet(myUrl)
  } catch (e) {
    throw new Error(e)
  }
}
// 单本漫画详情
let comicGet = async function (key) {
  try {
    let myUrl = new url.URL(`${baseUrl}/db/comicDetail?id=${key}`)
    let data = await dataGet(myUrl)
    return data[0]
  } catch (e) {
    throw new Error(e)
  }
}
// 漫画类型列表获取
let kindGet = async function () {
  try {
    let myUrl = new url.URL(`${baseUrl}/db/distinct?table=web_comic&column=comicType`)
    let data = await dataGet(myUrl)
    return data.map(v => {
      return v.comicType
    })
  } catch (e) {
    throw new Error(e)
  }
}
// 章节获取
let chapterListGet = async function (table) {
  try {
    let myUrl = new url.URL(`${baseUrl}/db/chapterList?table=${table}`)
    let data = await dataGet(myUrl)
    return data
  } catch (e) {
    throw new Error(e)
  }
}
// 特定id章节名获取
let chapterNameGet = async function (table, chapterId) {
  try {
    let myUrl = new url.URL(`${baseUrl}/db/chapter?table=${table}&chapterId=${chapterId}`)
    let data = await dataGet(myUrl)
    return data[0]
  } catch (e) {
    throw new Error(e)
  }
}
// comicPage列表
let comicPageList = async function (table) {
  try {
    let myUrl = new url.URL(`${baseUrl}/db/comicPageList?table=${table}`)
    let data = await dataGet(myUrl)
    return data
  } catch (e) {
    throw new Error(e)
  }
}


module.exports = {
  comicDataGet,
  kindGet,
  comicGet,
  chapterListGet,
  chapterNameGet,
  comicPageList
}
