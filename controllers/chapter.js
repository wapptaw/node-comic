const {comicGet, chapterNameGet, comicPageList} = require('../core/api')

var chapter = function () {
  return async (ctx, next) => {
    try {
      let query = ctx.request.query
      // 漫画名获取
      let comicNameData = await comicGet(query.id)
      let comicName = comicNameData.comicName
      // 章节名获取
      let chapterNameData = await chapterNameGet(`${query.id}_chapter`, query.chapterId)
      let chapterName = chapterNameData.chapterName
      // 漫画页获取
      let table = `${query.id}_${query.chapterId}_comicpage`
      let chapterListData =  await comicPageList(table)
      let chapterList = chapterListData.map(v => {
        v.table = table
        return v
      })

      ctx.render('chapter.html', {
        title: chapterName,
        el: 'chapter',
        comicId: query.id,
        comicName,
        chapterName,
        chapterList
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
    url: '/chapter',
    handle: chapter
  }
]
