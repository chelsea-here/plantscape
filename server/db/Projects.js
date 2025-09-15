const client = require("./client");
const { v4 } = require("uuid");
const uuidv4 = v4;

const createProject = async (project) => {
  const SQL = `
    INSERT INTO projects (id, project_name, user_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  const response = await client.query(SQL, [
    uuidv4(),
    project.project_name,
    project.user_id,
  ]);
  return response.rows[0];
};

// NOTE: This function fetches ALL projects in the database.
// const fetchProject = async () => {
//     const SQL =`
//     SELECT *
//     FROM projects
//     `
//     const response = await client.query(SQL)
//     return response.rows
// }

//fetches all project for a specific user id
const fetchMyProjects = async (userId) => {
  const SQL = `
    SELECT * 
    FROM projects
    WHERE user_id = $1
    `;
  const response = await client.query(SQL, [userId]);
  return response.rows;
};

const fetchSingleProjectById = async (projectId) => {
  const SQL = `
    SELECT *
    FROM projects
    WHERE id = $1
    `;
  const response = await client.query(SQL, [projectId]);
  return response.rows[0]; // Return only the single project object, not an array
};

module.exports = {
  createProject,
  fetchMyProjects,
  fetchSingleProjectById,
};
