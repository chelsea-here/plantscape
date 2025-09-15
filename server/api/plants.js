const express = require('express')
const app = express.Router()

const {
    createPlant,
    fetchPlants,
    fetchPlantsById
} = require('../db/plants')

const {
    isLoggedIn,
    isAdmin
} = require('./middleware')

app.post ('/',isLoggedIn,isAdmin, async(req, res, next) =>{ 
    try {
        res.send(await createPlant(req.body))
    } catch (error) {
        next(error)
    }
})

app.get('/', async (req, res, next) => {
    try {
        res.send(await fetchPlants())
    } catch (error) {
        next(error)
    }
})

app.get('/:id', async (req, res, next) => {
    try {
        const plant = await fetchPlantsById(req.params.id)
        if (!plant) {
            return res.status(404).json({error:'Plant Not Found'})
        }
        res.send(plant)
    } catch (error) {
        next(error)
    }
})

module.exports = app; 