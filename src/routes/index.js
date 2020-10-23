const Router = require('koa-router')
const router = new Router()
const axios = require('axios')

const _URL = '/api/v1'

const {
    TWIT,
    USER
} = require('../controllers')

router.post('/', async (ctx, next) => {
    const data = ctx.request.body

    if (data.twit != '') {
        await axios.post(`${process.env.BASE_URL}/users/peter/twits`,
        JSON.stringify(data),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async response => {
            console.log(response.data)
        })
        .catch(err => next(err))
    }
    
    let result
    await axios.get(`${process.env.BASE_URL}/twits`)
        .then(async response => {
            result = await response.data.data
            console.log(response.data.data)
        })
        .catch(err => next(err))

    await ctx.render('index', {
        result
    })
})

router.get('/', async (ctx, next) => {
    let result
    await axios.get(`${process.env.BASE_URL}/twits`)
        .then(async response => {
            result = await response.data.data
            console.log(response.data.data)
        })
        .catch(err => next(err))

    await ctx.render('index', {
        result
    })
})

router.get('/login', async (ctx, next) => {
    await ctx.render('login')
})

router.post('/registro', async (ctx, next) => {
    const data = ctx.request.body

    await axios.post(`${process.env.BASE_URL}/users`,
        JSON.stringify(data),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async response => {
            console.log(response.data)
        })
        .catch(err => next(err))
})

router.get('/registro', async (ctx, next) => {
    await ctx.render('registro')
})

router.get('/:id', async (ctx, next) => {
    let user, twits
    await axios.get(`${process.env.BASE_URL}/users/${ctx.params.id}/twits`)
        .then(async response => {
            twits = await response.data.data
            console.log(response.data.data)
        })
        .catch(err => next(err))

    await axios.get(`${process.env.BASE_URL}/users/${ctx.params.id}`)
        .then(async response => {
            user = await response.data.data
        })
        .catch(err => next(err))

    await ctx.render('user', {
        user,
        twits
    })
})

router.get('/twit/:id', async (ctx, next) => {
    let result
    await axios.get(`${process.env.BASE_URL}/twits/${ctx.params.id}`)
        .then(async response => {
            result = await response.data.data
            console.log(response.data.data)
        })
        .catch(err => next(err))

    await ctx.render('twit', {
        result
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