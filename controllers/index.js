const {comicDataGet, kindGet} = require('../core/api')

var index = function () {
  return async (ctx, next) => {
    try {
      async function cateDataGet (type, sort) { // 分类数据获取
        try {
          let data = await comicDataGet(type, sort)
          return data.map(v => {
            return {
              imgurl: `/db/comicCover?id=${v.comicKey}`,
              name: v.comicName,
              tag: v.comicType.split(','),
              id: v.comicKey
            }
          })
        } catch (e) {
          throw new Error(e)
        }
      }
      
      let category = await kindGet()
      let cateAll = category.map(v => {
        let comicBookFun = async () => {
          let comicBooksAll = await cateDataGet(v, 'hot')
          return {
            categoryName: v,
            comicBooks: comicBooksAll.slice(0, 4),
            topName: '排行一',
            tops: [
              {
                name: '未知',
                cate: '未知分类'
              },
              {
                name: '未知',
                cate: '未知分类'
              }
            ]
          }
        }
        return comicBookFun()
      })
      let categoryContent = await Promise.all(cateAll)

      ctx.render('index.html', {
        title: '首页',
        el: 'index',
        logoImg: '/db/img?name=logo.jpg',
        showImg: '/db/img?name=2.jpg',
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
        categoryContent
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
    url: '/',
    handle: index
  }
]
