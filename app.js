const Koa = require('Koa')
const staticFile = require('./middleware/static-files')
const controller = require('./middleware/controller')
const templating = require('./middleware/template')
const dbSrc = require('./middleware/db-source')

const isProduction = process.env.NODE_ENV === 'production'

const app = new Koa()

app.use(dbSrc())
app.use(staticFile('/static/'))
app.use(templating('src/views', {
  noCache: !isProduction,
  watch: !isProduction
}))
app.use(controller()) // 路由

app.listen(3000)
