const client = require('./client')
const {v4}= require('uuid')
const uuidv4 = v4

const createFaveDesign = async (faveDesign) => {
    const SQL =`
    INSERT INTO fave_design (id, user_id, design_id)
    VALUES ($1,$2,$3)
    RETURNING *
    `
    const response = await client.query(SQL,[uuidv4(), faveDesign.user_id, faveDesign.design_id])
    return response.rows[0]
}

const fetchFaveDesign = async () => {
    const SQL = `
    SELECT *
    FROM fave_design
    `
    const response = await client.query(SQL)
    return response.rows
}

module.exports ={
    createFaveDesign,
    fetchFaveDesign
}