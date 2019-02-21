const nunjucks = require('nunjucks')

var createEnv = function (path = 'views', {
    autoscape = true,
    throwOnUndefined = false,
    trimBlocks = false,
    IstripBlocks = false,
    watch = false,
    noCache = false,
    filters = null
  } = {}) {
  var env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path, {
      noCache,
      watch
    }),{
      autoscape,
      throwOnUndefined,
      trimBlocks,
      IstripBlocks,
      watch,
      noCache
    }
  )
  if (filters) {
    for (let f in filters) {
      env.addFilter(f, filters[f])
    }
  }
  return env
}

var templating = function (path, opts) {
  var env = createEnv(path, opts)
  return async (ctx, next) => {
    ctx.render = function (view, model) {
      ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {})) // state公共变量
      ctx.response.type = 'text/html'
    }
    await next()
  }
}

module.exports = templating
