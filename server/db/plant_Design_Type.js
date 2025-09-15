 const client =  require('./client')
 const {v4} = require('uuid')
 const uuidv4 = v4

 const createPlantDesign = async (design_type) => {
    const SQL =`
    INSERT INTO plant_Design_Types (id, plant_id, design_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `
    const response = await client.query(SQL,[uuidv4(), design_type.plant_id, design_type.design_id])
    return response.rows[0]
 }

 const fetchPlantDesign = async () => {
    const SQL =`
    SELECT *
    FROM plant_Design_Types
    `
    const response = await client.query(SQL)
    return response.rows
 }

 const fetchPlantDesignById = async (id) => {
    const SQL =`
    SELECT *
    FROM plant_Design_Types
    WHERE id = $1
    `
    const response = await client.query(SQL, [id])
    return response.rows[0]
 }

 module.exports = {
    createPlantDesign,
    fetchPlantDesign,
    fetchPlantDesignById
 }