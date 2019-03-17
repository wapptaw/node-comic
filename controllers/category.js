const {comicDataGet, kindGet} = require('../core/api')

var category = function () {
  return async (ctx, next) => {
    try {
      let query = ctx.request.query
      let kind = query.kind ? query.kind : '全部'
      let sort = query.sort ? query.sort : 'hot'
      let comicData = await comicDataGet(kind, sort)
      let comicBooks = comicData.map(v => {
        return {
          imgurl: `/db/comicCover?id=${v.comicKey}`,
          name: v.comicName,
          tag: v.comicType.split(','),
          id: v.comicKey
        }
      })

      let cate = await kindGet()

      ctx.render('category.html', {
        title: '分类',
        el: 'category',
        logoImg: '/db/img?name=logo.jpg',
        showImg: '/db/img?name=3.jpg',
        kind,
        sort,
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
        sortTag: [
          {
            name: '按热度',
            type: 'hot'
          },
          {
            name: '按评分',
            type: 'score'
          }
        ],
        comicBooks,
        kinds: ['全部', ...cate]
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
    url: '/category',
    handle: category
  }
]