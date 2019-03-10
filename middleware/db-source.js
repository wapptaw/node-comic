const Pool = require('../core/pool')

const myPool = new Pool

function dbSrc () {
  return async (ctx, next) => {
    let pathname = decodeURI(ctx.request.path)
    let query = ctx.request.query
    switch (pathname) {
      case '/db/img':

    }
  }
}