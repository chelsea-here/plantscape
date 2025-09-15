const client = require("./client");
const { v4 } = require("uuid");
const uuidv4 = v4;

// const createPlant = async (plant) => {
//     const SQL = `
//     INSERT INTO plants(id, plant_name, plant_type, toxic, size)
//     VALUES ($1, $2, $3, $4, $5)
//     RETURNING *
//     `
//     const response = await client.query(SQL, [uuidv4(), plant.plant_name, plant.plant_type, plant.toxic, plant.size])
//     return response.rows[0]
// }. JUST WANT JUSTINS SIGN OFF BEFORE DELETING

const createPlant = async (plant) => {
  const SQL = `
    INSERT INTO plants(
        id,
        plant_name,
        other_common_names,
        technical_name,
        growth_form, -- This corresponds to your 'plant_type' concept
        is_toxic,    -- This corresponds to your 'toxic' concept
        sun_requirements,
        height_min_ft,
        height_max_ft,
        width_min_ft,
        width_max_ft,
        seasonal_interest,
        primary_color,
        accent_color,
        image_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
    `;
  const response = await client.query(SQL, [
    uuidv4(),
    plant.plant_name,
    plant.other_common_names,
    plant.technical_name,
    plant.growth_form,
    plant.is_toxic,
    plant.sun_requirements,
    plant.height_min_ft,
    plant.height_max_ft,
    plant.width_min_ft,
    plant.width_max_ft,
    plant.seasonal_interest,
    plant.primary_color,
    plant.accent_color,
    plant.image_url,
  ]);
  return response.rows[0];
};

const fetchPlants = async () => {
  const SQL = `
    SELECT *
    FROM plants
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchPlantsById = async (id) => {
  const SQL = `
    SELECT *
    FROM plants
    WHERE id = $1
    `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

module.exports = {
  createPlant,
  fetchPlants,
  fetchPlantsById,
};
