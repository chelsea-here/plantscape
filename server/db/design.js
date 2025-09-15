const client = require("./client");
const { v4 } = require("uuid");
const uuidv4 = v4;

const createDesign = async (design) => {
  const SQL = `
    INSERT INTO designs (id, design_style_name, design_attributes, design_description, design_tags)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;
  const response = await client.query(SQL, [
    uuidv4(),
    design.design_style_name,
    design.design_attributes, // Maps to short description
    design.design_description, // Maps to long description
    design.design_tags, // Maps to tags
  ]);
  return response.rows[0];
};

const fetchDesign = async () => {
  const SQL = `
    SELECT *
    FROM  designs
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchDesignById = async (id) => {
  const SQL = `
    SELECT *
    FROM designs
    WHERE id = $1
    `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

module.exports = {
  createDesign,
  fetchDesign,
  fetchDesignById,
};
