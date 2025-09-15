const express = require('express')
const app = express.Router()

const {
    createPlantLayout,
    fetchPlantLayout,
    fetchPlantLayoutById
} = require('../db/plant_layout')

app.post('/', async (req, res, next) => {// is logged in for everything 
    try {
        res.send( await createPlantLayout(req.body))
    } catch (error) {
        next(error)
    }
})

app.get('/', async (req, res,next) => {
    try {
        res.send(await fetchPlantLayout())
    } catch (error) {
        next(error)
    }
})

app.get('/:id', async (req, res,next) => {
    try {
        res.send(await fetchPlantLayoutById(id))
    } catch (error) {
        next(error)
    }
})

module.exports = app