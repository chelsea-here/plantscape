const express = require('express')
const app = express.Router()

const {
    createPlantDesign,
    fetchPlantDesign,
    fetchPlantDesignById
} = require('../db/plant_Design_Type')

app.post('/', async (req,res,next) => {//is admin 
    try {
        res.send( await createPlantDesign(req.body))
    } catch (error) {
        next(error)
    }
})
app.get('/', async (req,res,next) => {
    try {
        res.send(await fetchPlantDesign())
    } catch (error) {
        next(error)
    }
})

app.get('/:id', async (req,res,next) => {
    try {
        res.send( await fetchPlantDesignById(req.params.id))
    } catch (error) {
        next(error)
    }
})

module.exports = app