const fs = require('fs')
const path = require('path')
const mime = require('mime')

function staticFile (url) {
  return async (ctx, next) => {
    let pathname = decodeURI(ctx.request.path) // 转码
    let filename = pathname.slice(url.length)
    let rpath = path.join(path.resolve(__dirname, '../src/' + url), filename)
    if (pathname.startsWith(url)) {
      try {
        ctx.response.type = mime.getType(rpath)
        ctx.response.body = fs.createReadStream(rpath) // 流式传输
      } catch (e) {
        ctx.response.status = 404
      }
    }
    await next()
  }
}

module.exports = staticFile
