const {chapterListGet, comicGet} = require('../core/api')

var info = function () {
  return async (ctx, next) => {
    try {
      let query = ctx.request.query
      let comicData = await comicGet(query.id)
      let chapter = await chapterListGet(`${query.id}_chapter`)

      ctx.render('info.html', {
        title: '章节',
        el: 'chapter',
        logoImg: '/db/img?name=logo.jpg',
        showImg: '/db/img?name=3.jpg',
        nav: [
          {
            name: '首页',
            url: '/'
          },
          {
            name: '分类',
            url: '/category'
          },
          {
            name: '排行',
            url: '/top'
          }
        ],
        cover: `/db/comicCover?id=${query.id}`,
        comicData,
        chapter
      })
      await next()
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = [
  {
    method: 'GET',
    url: '/info',
    handle: info
  }
]
