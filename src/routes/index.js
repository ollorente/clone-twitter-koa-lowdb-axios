const Router = require('koa-router')
const router = new Router()

const users = ['Viral', 'Sachin', 'Rohit', 'Dhomi']
const _URL = '/api/v1'

const {
    TWIT,
    USER
} = require('../controllers')

router.get('/', async ctx => {
    await ctx.render('index', {
        users: users
    })
})

router.get(`${_URL}/twits`, TWIT.listAll)
router.get(`${_URL}/twits/:id`, TWIT.get)
router.put(`${_URL}/twits/:id`, TWIT.update)
router.delete(`${_URL}/twits/:id`, TWIT.remove)

router.post(`${_URL}/users`, USER.create)
router.get(`${_URL}/users`, USER.list)
router.get(`${_URL}/users/:id`, USER.get)
router.put(`${_URL}/users/:id`, USER.update)
router.delete(`${_URL}/users/:id`, USER.remove)

router.post(`${_URL}/users/:id/twits`, TWIT.create)
router.get(`${_URL}/users/:id/twits`, TWIT.list)

module.exports = router