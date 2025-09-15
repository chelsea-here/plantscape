const client = require('./client')
const {v4} = require('uuid')
const uuidv4 = v4

const createFavoritePlant = async (Faves) => {
    const SQL = `
    INSERT INTO favorite_plants (id, user_id, plant_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), Faves.user_id, Faves.plant_id])
    return response.rows[0]
}

const fetchFavoritePlants = async (user_id) => {
    const SQL =`
    SELECT * 
    FROM favorite_plants
    WHERE user_id = $1
    `
    const response = await client.query(SQL,[user_id])
    return response.rows
}

const deleteFavoritePlants = async (Faves) => {
    const SQL =`
    DELETE FROM favorite_plants
    WHERE id = $1 and user_id = $2
    RETURNING * 
    `
    const response = await client.query(SQL, [Faves.id, Faves.user_id])
}

module.exports = {
    createFavoritePlant,
    fetchFavoritePlants,
    deleteFavoritePlants
}