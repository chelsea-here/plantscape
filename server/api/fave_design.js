const express = require('express')
const app = express.Router()

const {
    createFaveDesign,
    fetchFaveDesign
} = require('../db/fave_design')

const {
    isLoggedIn
} = require('./middleware')

app.post('./', isLoggedIn, async (req,res,next) => {
    try {
        res.send( await createFaveDesign(req.body))
    } catch (error) {
        next(error)
    }
})

app.get('./', isLoggedIn, async (req,res,next) => {
    try {
        res.send( await fetchFaveDesign(req.user.id))
    } catch (error) {
        next(error)
    }
})

module.exports = app