const {
    getConnection
} = require('../database')
const shortid = require('shortid')
const md5 = require('md5')

const app = {}

app.create = async (ctx, next) => {
    const {
        username,
        email,
        password
    } = ctx.request.body

    const usernameInfo = await getConnection()
        .get('users')
        .find({
            username: username
        })
        .value()

    const emailInfo = await getConnection()
        .get('users')
        .find({
            email: email
        })
        .value()

    if (!usernameInfo && !emailInfo) {
        const newData = {
            _id: shortid.generate(),
            username: username.toLowerCase(),
            email,
            password: await md5(password),
            gravatar:  await md5(email.toLowerCase()),
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        const result = await getConnection()
            .get('users')
            .push(newData)
            .write()

        ctx.body = {
            error: false,
            msg: 'Created!',
            data: newData
        }
    } else {
        if (usernameInfo) {
            ctx.body = {
                error: true,
                msg: 'Username exist!'
            }
        }

        if (emailInfo) {
            ctx.body = {
                error: true,
                msg: 'Email exist!'
            }
        }
    }
}

app.list = async (ctx, next) => {
    const result = await getConnection()
        .get('users')
        .sortBy('username')
        .value()

    ctx.body = {
        error: false,
        data: result
    }
}

app.get = async (ctx, next) => {
    const result = await getConnection()
        .get('users')
        .find({
            username: ctx.params.id
        })
        .value()

    ctx.body = {
        error: false,
        data: result
    }
}

app.update = async (ctx, next) => {
    const userInfo = await getConnection()
        .get('users')
        .find({
            username: ctx.params.id
        })
        .value()

    if (userInfo) {
        const update = ctx.request.body
        update.updatedAt = Date.now()

        const usernameInfo = await getConnection()
            .get('users')
            .find({
                username: update.username
            })
            .value()

        const emailInfo = await getConnection()
            .get('users')
            .find({
                email: update.email
            })
            .value()

        if (update.email) {
            update.gravatar = await md5(update.email.toLowerCase())
        }

        if (!usernameInfo && !emailInfo) {
            const result = await getConnection()
                .get('users')
                .find({
                    _id: userInfo._id
                })
                .assign(update)
                .write()

            ctx.body = {
                error: false,
                msg: 'Updated!',
                data: result
            }
        } else {
            if (usernameInfo) {
                ctx.body = {
                    error: true,
                    msg: 'Username exist!'
                }
            }

            if (emailInfo) {
                ctx.body = {
                    error: true,
                    msg: 'Email exist!'
                }
            }
        }
    } else {
        ctx.body = {
            error: true,
            msg: 'User not found!'
        }
    }
}

app.remove = async (ctx, next) => {
    const userInfo = await getConnection()
        .get('users')
        .find({
            username: ctx.params.id
        })
        .value()

    if (userInfo) {
        const result = await getConnection()
            .get('users')
            .remove({
                _id: userInfo._id
            })
            .write()

        ctx.body = {
            error: false,
            msg: 'Removed!',
            data: result
        }
    } else {
        ctx.body = {
            error: true,
            msg: 'User not found!'
        }
    }
}

module.exports = app