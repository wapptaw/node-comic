var info = function () {
  return async (ctx, next) => {
    ctx.render('info.html', {
      title: '章节',
      el: 'chapter',
      logoImg: '/static/img/logo.jpg',
      showImg: '/static/img/3.jpg',
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
    })
    await next()
  }
}

module.exports = [
  {
    method: 'GET',
    url: '/info',
    handle: info
  }
]
