// db/plant_layout.js
const client = require("./client");
const { v4 } = require("uuid");
const uuidv4 = v4;

const createPlantLayout = async ({
  plant_id,
  layout_id,
  x_coord,
  y_coord,
  diameter,
  height,
}) => {
  const SQL = `
   INSERT INTO plant_layout (id, plant_id, layout_id, x_coord, y_coord, diameter, height)
   VALUES  ($1, $2, $3, $4, $5, $6, $7)
   RETURNING *
   `;
  const response = await client.query(SQL, [
    uuidv4(),
    plant_id,
    layout_id,
    x_coord,
    y_coord,
    diameter,
    height,
  ]);
  return response.rows[0];
};

const fetchPlantLayout = async () => {
  const SQL = `
    SELECT id, plant_id, layout_id, x_coord, y_coord, diameter, height
    FROM plant_layout
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchPlantLayoutById = async (id) => {
  const SQL = `
    SELECT id, plant_id, layout_id, x_coord, y_coord, diameter, height
    FROM plant_layout
    WHERE id = $1
    `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

module.exports = {
  createPlantLayout,
  fetchPlantLayout,
  fetchPlantLayoutById,
};
