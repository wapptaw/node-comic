const fs = require('fs')
const path = require('path')

var manage = function (filePath, router) {
  let routerMes = require(filePath)
  if (routerMes instanceof Array) {
    for (let mes of routerMes) {
      switch (mes.method) {
        case 'GET':
          router.get(mes.url, mes.handle())
          break
        case 'POST':
          router.post(mes.url, mes.handle())
          break
        default:
          console.log('无效的url')
      }
    }
  }
}

var searchDir = function (filePath, router) {
  try {
    let files = fs.readdirSync(filePath, {
      withFileTypes: true
    })

    files.forEach(fileDirent => {
      let childPath = path.join(filePath, fileDirent.name)
      if (fileDirent.isDirectory()) {
        searchDir(childPath, router)
      }
      if (fileDirent.isFile() && fileDirent.name.endsWith('.js')) {
        manage(childPath, router)
      }
    })
  } catch (e) {
    throw new Error(e)
  }
}

var controller = function (dir = 'controllers') {
  const Router = require('koa-router')
  let filePath = path.resolve(__dirname, '../' + dir)
  let router = new Router()
  searchDir(filePath, router)
  return router.routes()
}

module.exports = controller
