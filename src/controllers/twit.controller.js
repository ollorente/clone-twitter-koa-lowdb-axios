const {
    getConnection
} = require('../database')
const shortid = require('shortid')

const app = {}

app.create = async (ctx, next) => {
    const userInfo = await getConnection()
        .get('users')
        .find({
            username: ctx.params.id
        })
        .value()

    if (userInfo) {
        const newData = {
            _id: shortid.generate(),
            twit: ctx.request.body.twit,
            userId: userInfo._id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        const result = await getConnection()
            .get('twits')
            .push(newData)
            .write()

        ctx.body = {
            error: false,
            msg: 'Created!',
            data: result
        }
    } else {
        ctx.body = {
            error: true,
            msg: 'User not found!'
        }
    }
}

app.list = async (ctx, next) => {
    const userInfo = await getConnection()
        .get('users')
        .find({
            username: ctx.params.id
        })
        .value()

    if (userInfo) {
        const result = await getConnection()
            .get('twits')
            .filter({
                userId: userInfo._id
            })
            .sortBy('createdAt')
            .value()

        ctx.body = {
            error: false,
            data: result.reverse()
        }
    } else {
        ctx.body = {
            error: true,
            msg: 'User not found!'
        }
    }
}

app.get = async (ctx, next) => {
    const result = await getConnection()
        .get('twits')
        .find({
            _id: ctx.params.id
        })
        .value()

    ctx.body = {
        error: false,
        data: result
    }
}

app.update = async (ctx, next) => {
    const twitInfo = await getConnection()
        .get('twits')
        .find({
            _id: ctx.params.id
        })
        .value()

    const update = ctx.request.body

    if (twitInfo) {
        const result = await getConnection()
            .get('twits')
            .find({
                _id: twitInfo._id
            })
            .assign(update)
            .write()

        ctx.body = {
            error: false,
            msg: 'Updated!',
            data: result
        }
    } else {
        ctx.body = {
            error: true,
            msg: 'Twit not found!'
        }
    }
}

app.remove = async (ctx, next) => {
    const twitInfo = await getConnection()
        .get('twits')
        .find({
            _id: ctx.params.id
        })
        .value()

    if (twitInfo) {
        const result = await getConnection()
            .get('twits')
            .remove({
                _id: twitInfo._id
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
            msg: 'Twit not found!'
        }
    }
}

app.listAll = async (ctx, next) => {
    const result = await getConnection()
        .get('twits')
        .sortBy('createdAt')
        .value()

    ctx.body = {
        error: false,
        data: result.reverse()
    }
}

module.exports = app