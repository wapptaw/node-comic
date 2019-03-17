var top = function () {
  return async (ctx, next) => {
    ctx.render('top.html', {
      title: '排行榜',
      el: 'top',
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
      rankName: [
        {
          name: '阅读榜',
          topList: [
            {
              name: '漫画1'
            },
            {
              name: '漫画2'
            }
          ]
        },
        {
          name: '订阅榜',
          topList: [
            {
              name: '漫画1'
            },
            {
              name: '漫画2'
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
    url: '/top',
    handle: top
  }
]
