require("dotenv").config(); // THIS MUST BE THE VERY FIRST LINE HERE!

const fs = require("fs").promises;
const client = require("./client"); // Import the actual client instance
const path = require("path");

// Renamed to _seed internally to clearly show it's the core logic
// It takes a parameter to decide if it should manage its own connection
const _seed = async (shouldConnectAndDisconnect = true) => {
  try {
    console.log("Starting database seeding from seed.sql...");
    // This console.log will now show the correct DATABASE_URL
    console.log("DATABASE_URL being used:", process.env.DATABASE_URL);

    if (shouldConnectAndDisconnect) {
      await client.connect(); // Only connect if this is a standalone run
      console.log("Connected to the database.");
    }

    const seedSqlPath = path.join(__dirname, "seed", "seed.sql");
    const seedSqlContent = await fs.readFile(seedSqlPath, "utf8");
    await client.query(seedSqlContent);
    console.log("Data inserted from seed.sql successfully!");
  } catch (error) {
    if (error.code === "23505") {
      console.warn(
        "Seed data already exists (unique constraint violation). Skipping duplicate inserts from seed.sql."
      );
    } else {
      console.error("Error executing seed.sql:", error);
      throw error;
    }
  } finally {
    if (shouldConnectAndDisconnect) {
      await client.end(); // Only disconnect if this was a standalone run
      console.log("Database seeding process complete and client disconnected.");
    }
  }

  // const { createLayout } = require("./layouts");

  // const { createPlantDesign } = require("./plant_Design_Type");

  // const { createPlantLayout } = require("./plant_layout");

  // const { createFaveDesign } = require("./fave_design");

  // const{
  //     createProject
  // } = require('./Projects')

  // const seed = async () => {
  //   const SQL = `
  //     DROP TABLE IF EXISTS projects CASCADE;
  //     DROP TABLE IF EXISTS plant_layout;
  //     DROP TABLE IF EXISTS layouts;
  //     DROP TABLE IF EXISTS favorite_plants;
  //     DROP TABLE IF EXISTS plant_Design_Types;
  //     DROP TABLE IF EXISTS fave_design;
  //     DROP TABLE IF EXISTS plants;
  //     DROP TABLE IF EXISTS designs;
  //     DROP TABLE IF EXISTS users;

  //     CREATE TABLE users(
  //     id UUID PRIMARY KEY,
  //     username VARCHAR(50) UNIQUE NOT NULL,
  //     password VARCHAR(100) NOT NULL,
  //     is_admin BOOLEAN DEFAULT false NOT NULL
  //     );

  //     CREATE TABLE designs(
  //     id UUID PRIMARY KEY,
  //     design_style_name VARCHAR(50),
  //     design_attributes VARCHAR(50)
  //     );

  //     CREATE TABLE plants(
  //     id UUID PRIMARY KEY,
  //     plant_name VARCHAR(100) NOT NULL,
  //     plant_type VARCHAR (50) NOT NULL,
  //     toxic BOOLEAN DEFAULT false NOT NULL,
  //     size INTEGER NOT NULL
  //     );

  //     CREATE TABLE favorite_plants(
  //     id UUID PRIMARY KEY,
  //     user_id UUID REFERENCES users(id),
  //     plant_id UUID REFERENCES plants(id),
  //     CONSTRAINT user_and_plant_id UNIQUE(user_id, plant_id)
  //     );

  //     CREATE TABLE plant_Design_Types(
  //     id UUID PRIMARY KEY,
  //     plant_id UUID REFERENCES plants(id),
  //     design_id UUID REFERENCES designs(id)
  //     );

  //     CREATE TABLE projects(
  //     id UUID PRIMARY KEY,
  //     project_name VARCHAR(100) NOT NULL,
  //     user_id UUID REFERENCES users(id)
  //     );

  //     CREATE TABLE layouts(
  //     id UUID PRIMARY KEY,
  //     layout_name varchar(100) NOT NULL,
  //     bedding_size INTEGER NOT NULL,
  //     design_type UUID REFERENCES designs(id),
  //     projects_id UUID REFERENCES projects(id)
  //     );

  //     CREATE TABLE plant_layout(
  //     id UUID PRIMARY KEY,
  //     plant_id UUID REFERENCES plants(id),
  //     layout_id UUID REFERENCES layouts(id),
  //     placement FLOAT
  //     );

  //     CREATE TABLE fave_design(
  //     id UUID PRIMARY KEY,
  //     user_id UUID REFERENCES users(id),
  //     design_id UUID REFERENCES designs(id)
  //     );
  //     `;
  //   await client.query(SQL);

  //   const [Justin, Chelsea, Callen, Ellie] = await Promise.all([
  //     createUser({
  //       id: uuidv4(),
  //       username: "Justin",
  //       password: "0710",
  //       is_admin: true,
  //     }),
  //     createUser({
  //       id: uuidv4(),
  //       username: "Chelsea",
  //       password: "1234",
  //       is_admin: true,
  //     }),
  //     createUser({
  //       id: uuidv4(),
  //       username: "Callen",
  //       password: "5678",
  //       is_admin: true,
  //     }),
  //     createUser({
  //       id: uuidv4(),
  //       username: "Ellie",
  //       password: "9012",
  //       is_admin: true,
  //     }),
  //   ]);

  //   const [Cottage, Modern, Wild] = await Promise.all([
  //     createDesign({
  //       id: uuidv4(),
  //       design_style_name: "Cottage",
  //       design_attributes: "Summer",
  //     }),
  //     createDesign({
  //       id: uuidv4(),
  //       design_style_name: "Modern",
  //       design_attributes: "Spring",
  //     }),
  //     createDesign({
  //       id: uuidv4(),
  //       design_style_name: "Wild",
  //       design_attributes: "Fall",
  //     }),
  //   ]);

  //   const [Boxwood, SJPYew, JPFern] = await Promise.all([
  //     createPlant({
  //       id: uuidv4(),
  //       plant_name: "Boxwood",
  //       plant_type: "Shrub",
  //       toxic: false,
  //       size: 2,
  //     }),
  //     createPlant({
  //       id: uuidv4(),
  //       plant_name: "Spreading Japanese Plum Yew",
  //       plant_type: "Shrub",
  //       toxic: true,
  //       size: 3,
  //     }),
  //     createPlant({
  //       id: uuidv4(),
  //       plant_name: "Japanese Painted Fern",
  //       plant_type: "Herbaceous",
  //       toxic: true,
  //       size: 1,
  //     }),
  //   ]);

  //   await Promise.all([
  //     createFavoritePlant({
  //       id: uuidv4(),
  //       user_id: Justin.id,
  //       plant_id: JPFern.id,
  //     }),
  //     createFavoritePlant({
  //       id: uuidv4(),
  //       user_id: Ellie.id,
  //       plant_id: SJPYew.id,
  //     }),
  //     createFavoritePlant({
  //       id: uuidv4(),
  //       user_id: Callen.id,
  //       plant_id: Boxwood.id,
  //     }),
  //     createFavoritePlant({
  //       id: uuidv4(),
  //       user_id: Chelsea.id,
  //       plant_id: SJPYew.id,
  //     }),
  //   ]);

  //   const [BackyardForest] = await Promise.all([
  //     createProject({
  //       id: uuidv4(),
  //       project_name: "BackyardForest",
  //       user_id: Justin.id,
  //     }),
  //   ]);

  //   const [newBeginnigs, FernForest, AbsoluteSucculent] = await Promise.all([
  //     createLayout({
  //       id: uuidv4(),
  //       layout_name: "newBeginnigs",
  //       bedding_size: 100,
  //       design_type: Cottage.id,
  //       projects_id: BackyardForest.id,
  //     }),
  //     createLayout({
  //       id: uuidv4(),
  //       layout_name: "FernForest",
  //       bedding_size: 450,
  //       design_type: Modern.id,
  //       projects_id: BackyardForest.id,
  //     }),
  //     createLayout({
  //       id: uuidv4(),
  //       layout_name: "AbsoluteSucculent",
  //       bedding_size: 210,
  //       design_type: Wild.id,
  //       projects_id: BackyardForest.id,
  //     }),
  //   ]);

  //   await Promise.all([
  //     createPlantDesign({
  //       id: uuidv4(),
  //       plant_id: Boxwood.id,
  //       design_id: Wild.id,
  //     }),
  //     createPlantDesign({
  //       id: uuidv4(),
  //       plant_id: SJPYew.id,
  //       design_id: Cottage.id,
  //     }),
  //     createPlantDesign({
  //       id: uuidv4(),
  //       plant_id: Boxwood.id,
  //       design_id: Cottage.id,
  //     }),
  //   ]);

  //   await Promise.all([
  //     createPlantLayout({
  //       id: uuidv4(),
  //       plant_id: JPFern.id,
  //       layout_id: newBeginnigs.id,
  //       placement: 78,
  //     }),
  //     createPlantLayout({
  //       id: uuidv4(),
  //       plant_id: SJPYew.id,
  //       layout_id: FernForest.id,
  //       placement: 567,
  //     }),
  //     createPlantLayout({
  //       id: uuidv4(),
  //       plant_id: Boxwood.id,
  //       layout_id: AbsoluteSucculent.id,
  //       placement: 123,
  //     }),
  //   ]);

  //   await Promise.all([
  //     createFaveDesign({ id: uuidv4(), user_id: Ellie.id, design_id: Modern.id }),
  //     createFaveDesign({ id: uuidv4(), user_id: Callen.id, design_id: Wild.id }),
  //     createFaveDesign({
  //       id: uuidv4(),
  //       user_id: Chelsea.id,
  //       design_id: Cottage.id,
  //     }),
  //   ]);

  //   console.log("Tables Seeded");
};

// Export client and the _seed function (renamed for clarity)
module.exports = {
  client,
  seed: _seed, // Export it as 'seed'
};

// This block ensures _seed is called with `true` (connect/disconnect)
// ONLY when this file is run directly (e.g., via `npm run seed`)
if (require.main === module) {
  _seed(true) // Run with connect/disconnect
    .catch((err) => {
      console.error("Fatal error during standalone seeding:", err);
      process.exit(1);
    });
}
