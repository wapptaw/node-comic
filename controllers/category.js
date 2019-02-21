var category = function () {
  return async (ctx, next) => {
    const kind = ctx.query.kind ? ctx.query.kind : '全部'
    const sort = ctx.query.sort ? ctx.query.sort : 'hot'
    ctx.render('category.html', {
      title: '分类',
      el: 'category',
      logoImg: '/static/img/logo.jpg',
      showImg: '/static/img/3.jpg',
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
      comicBooks: [ // 需要由计算获得
        {
          imgurl: '/static/img/3.jpg',
          name: '不知道',
          tag: ['烧酒', '热血', '少年']
        },
        {
          imgurl: '/static/img/4.jpg',
          name: 'comic_2',
          tag: ['科幻', '玄幻', '奇幻']
        }
      ],
      kinds: [ // 需要由计算获得
        {
          name: '全部'
        },
        {
          name: '科幻'
        },
        {
          name: '少年'
        },
        {
          name: '奇幻'
        }
      ]
    })
    await next()
  }
}

module.exports = [
  {
    method: 'GET',
    url: '/category',
    handle: category
  }
]