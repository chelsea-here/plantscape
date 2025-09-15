require("dotenv").config(); //load env first
//require('../../env')
const pg = require("pg");

// Determine if running in production (e.g., on Render)
const isProduction = process.env.NODE_ENV === "production";

// Render's PostgreSQL databases require SSL for external connections
const connectionString = process.env.DATABASE_URL;

const client = new pg.Client({
  connectionString: connectionString,
  // Only use SSL in production, and configure it for Render
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = client;
