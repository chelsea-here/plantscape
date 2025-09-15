const express = require('express')
const app = express.Router()

const {
    authenticate
} = require('../db/authenticate')

const {
    isLoggedIn
} = require('./middleware')

app.post ('/login', async (req, res, next ) => {
    try {
        const token = await authenticate(req.body)
        res.send(token)
    } catch (error) {
        next(error)
    }
})

app.get('/me', isLoggedIn, (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})

module.exports = app