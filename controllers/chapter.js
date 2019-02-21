const fs = require('fs')

var chapter = function () {
  return async (ctx, next) => {
    const comicId = ctx.query.id
    const chapterName = ctx.query.chapterName
    let chapters = []
    let dirGet = new Promise(resolve => {
      fs.readdir(`./src/static/comic/${comicId}/${chapterName}`, (err, data) => {
        if (err) {
          resolve([])
        } else {
          fs.Stats()
          resolve(data)
        }
      })
    })
    chapters = await dirGet
    ctx.render('chapter.html', {
      title: comicId,
      el: 'chapter',
      comicId,
      chapterName,
      chapters
    })
    await next()
  }
}

module.exports = [
  {
    method: 'GET',
    url: '/chapter',
    handle: chapter
  }
]
