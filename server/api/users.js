const express = require('express')
const app = express.Router()

const {
    createUser,
    fetchUsers
} = require('../db/user')

const {
    isAdmin,
    isLoggedIn
} = require('./middleware')

app.get ('/', isLoggedIn, isAdmin, async (req, res, next )=> {
    try {
        res.send(await fetchUsers())
    } catch (error) {
        next(error)
    }
})

app.post ('/register', async (req,res,next) => {
    try {
        res.send( await createUser(req.body))
    } catch (error) {
        next(error)
    }
})

module.exports = app; 