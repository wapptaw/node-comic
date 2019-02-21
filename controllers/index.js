var index = function () {
  return async (ctx, next) => {
    ctx.render('index.html', {
      title: '首页',
      el: 'index',
      logoImg: '/static/img/logo.jpg',
      showImg: '/static/img/2.jpg',
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
      category: [
        {
          categoryName: '科幻',
          comicBooks: [
            {
              imgurl: '/static/img/3.jpg',
              name: '不知道',
              tag: ['烧酒', '热血', '少年'],
              id: 1000
            },
            {
              imgurl: '/static/img/4.jpg',
              name: 'comic_2',
              tag: ['科幻', '玄幻', '奇幻'],
              id: 1001
            }
          ],
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
        },
        {
          categoryName: '玄幻',
          comicBooks: [
            {
              imgurl: '/static/img/4.jpg',
              name: '不清楚',
              tag: ['科幻', '玄幻', '奇幻']
            }
          ]
        }
      ]
    })
    await next()
  }
}

module.exports = [
  {
    method: 'GET',
    url: '/',
    handle: index
  }
]
