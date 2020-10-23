require('dotenv').config()
const serve = require('koa-static')
const Koa = require('koa')
const render = require('koa-ejs')
const path = require('path')
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const {
    createConnection
} = require('./database')

const port = process.env.PORT || 3700
createConnection()

app.use(serve(path.join(__dirname, '/public')))
app.use(bodyParser())
app.use(json())
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: false,
    async: true
})

const router = require('./routes')

// Router Middleware
app.use(router.routes()).use(router.allowedMethods())
app.listen(port, () => {
    console.log(`>>> KOA SERVER on http://localhost:${port} <<<`)
})