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
        await axios.post(`${process.env.BASE_URL}/users/tchalla/twits`,
                JSON.stringify(data), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            .then(async response => {
                /* console.log(response.data) */

                if (response.data.error === true) {
                    console.log('Algo extraño sucedió')
                } else {
                    console.log('El twit ha sido creado!')
                }
            })
            .catch(err => next(err))
    }

    let result
    await axios.get(`${process.env.BASE_URL}/twits`)
        .then(async response => {
            result = await response.data.data
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
        })
        .catch(err => next(err))

    await ctx.render('index', {
        result
    })
})

router.post('/login', async (ctx, next) => {
    const data = ctx.request.body

    if (data.email != '' && data.password != '') {
        await axios.post(`${process.env.BASE_URL}/login`,
                JSON.stringify(data), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            .then(async response => {
                /* console.log('RESPONSE:', response.data) */
                /* console.log('ERROR:', response.data.error) */
                /* console.log('DATA:', JSON.stringify(response.data.jwt)) */

                if (response.data.error === true) {
                    console.log('ERROR:', response.data.error)
                    console.log('No tienes acceso.')
                } else {
                    const token = await response.data.jwt
                    /* console.log('ERROR:', response.data.error) */
                    /* console.log('TOKEN:', JSON.stringify(token)) */
                    /* LocalStorage.setItem('access_token', JSON.stringify(token)) */
                    await this.createToken(JSON.stringify(token))

                    await ctx.redirect('/')
                }
            })
            .catch(err => next(err))
    }

    await ctx.render('login')
})

router.get('/login', async ctx => {
    await ctx.render('login')
})

router.post('/registro', async (ctx, next) => {
    const data = ctx.request.body

    if (data.email != '' && data.password != '') {
        await axios.post(`${process.env.BASE_URL}/users`,
                JSON.stringify(data), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            .then(async response => {
                console.log(response.data)
            })
            .catch(err => next(err))
    }

    await ctx.render('registro')
})

router.get('/registro', async ctx => {
    await ctx.render('registro')
})

router.get('/:id', async (ctx, next) => {
    const {
        id
    } = ctx.params

    let userData, twitsData
    await axios.get(`${process.env.BASE_URL}/users/${id}`)
        .then(async response => {
            userData = await response.data
            /* console.log('USER:', userData) */

            await axios.get(`${process.env.BASE_URL}/users/${userData.data.username}/twits`)
                .then(async response => {
                    twitsData = await response.data
                    /* console.log('TWIT:', twitsData) */
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))

    await ctx.render('usuario', {
        user: userData,
        twits: twitsData
    })
})

router.get('/twit/:id', async (ctx, next) => {
    let user, twit
    await axios.get(`${process.env.BASE_URL}/twits/${ctx.params.id}`)
        .then(async response => {
            twit = await response.data.data

            await axios.get(`${process.env.BASE_URL}/users/${twit.userId}`)
                .then(async response => {
                    user = await response.data
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))

    await ctx.render('twit', {
        twit,
        user
    })
})

router.get('/salir', async ctx => {
    console.log('Aquí pasó algo...')
    LocalStorage.clear()
    await ctx.redirect('/login')
})

router.post(`${_URL}/login`, USER.login)

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