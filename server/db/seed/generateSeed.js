require("dotenv").config(); // MUST be at the very top!
const path = require("path");
const fs = require("fs"); // For synchronous writeFileSync
const fsPromises = require("fs").promises; // For promise-based readFile
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 7;

// Helper function to read a CSV file
async function readCsvFile(filePath) {
  try {
    const data = await fsPromises.readFile(filePath, "utf8");
    console.log(`Successfully read file: ${filePath}`);
    return data;
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw new Error(`Failed to read CSV file: ${filePath}`);
  }
}

// --- CSV File Paths ---
const PLANTS_CSV_PATH = path.join(__dirname, "csv", "plantscape - Plants.csv");
const STYLES_CSV_PATH = path.join(__dirname, "csv", "plantscape - Styles.csv");

// --- Functions for CSV parsing ---

function parseCsv(csvString) {
  const lines = csvString.trim().split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length === headers.length) {
      let row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j];
      }
      data.push(row);
    }
  }
  return data;
}

// Improved CSV line parsing to handle commas within quoted fields
function parseCsvLine(line) {
  const result = [];
  let inQuote = false;
  let currentField = "";
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuote = !inQuote;
      if (inQuote && line[i + 1] === '"') {
        // Handle escaped double quote
        currentField += '"';
        i++;
      }
    } else if (char === "," && !inQuote) {
      result.push(currentField.trim());
      currentField = "";
    } else {
      currentField += char;
    }
  }
  result.push(currentField.trim());
  return result;
}

// Helper to generate a random float within a range (NO LONGER USED, BUT KEPT FOR REFERENCE)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// --- Main Seed Generation Function ---

async function generateSeedFile() {
  let sqlStatements = `-- SQL SEED File generated on ${new Date().toISOString()}\n\n`;

  // --- 1. Drop Tables ---
  sqlStatements += `
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS plant_layout;
DROP TABLE IF EXISTS layouts;
DROP TABLE IF EXISTS favorite_plants;
DROP TABLE IF EXISTS plant_Design_Types;
DROP TABLE IF EXISTS fave_design;
DROP TABLE IF EXISTS plants;
DROP TABLE IF EXISTS designs;
DROP TABLE IF EXISTS users;

`;

  // --- 2. Create Tables (plant_layout table schema updated with x, y, diameter, height) ---
  sqlStatements += `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE designs(
    id UUID PRIMARY KEY,
    design_style_name VARCHAR(50) UNIQUE NOT NULL,
    design_attributes VARCHAR(255),    -- short description
    design_description TEXT,           -- long description
    design_tags TEXT                   -- tags
);

CREATE TABLE IF NOT EXISTS plants (
    id UUID PRIMARY KEY,
    plant_name VARCHAR(255) UNIQUE NOT NULL,
    other_common_names TEXT,
    technical_name VARCHAR(255),
    growth_form VARCHAR(50),
    is_toxic BOOLEAN DEFAULT false NOT NULL,
    sun_requirements TEXT,
    height_min_ft NUMERIC(5, 2),
    height_max_ft NUMERIC(5, 2),
    width_min_ft NUMERIC(5, 2),
    width_max_ft NUMERIC(5, 2),
    seasonal_interest TEXT,
    primary_color VARCHAR(50),
    accent_color VARCHAR(50),
    image_url TEXT
);

CREATE TABLE favorite_plants(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    plant_id UUID REFERENCES plants(id),
    CONSTRAINT user_and_plant_id UNIQUE(user_id, plant_id)
);

CREATE TABLE plant_Design_Types(
    id UUID PRIMARY KEY,
    plant_id UUID REFERENCES plants(id),
    design_id UUID REFERENCES designs(id),
    UNIQUE (plant_id, design_id)
);


CREATE TABLE projects(
    id UUID PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id)
);

CREATE TABLE layouts(
    id UUID PRIMARY KEY,
    layout_name varchar(100) NOT NULL,
    bed_length INTEGER NOT NULL,
    bed_depth INTEGER NOT NULL,
    design_type UUID REFERENCES designs(id),
    projects_id UUID REFERENCES projects(id)
);

CREATE TABLE plant_layout(
    id UUID PRIMARY KEY,
    plant_id UUID REFERENCES plants(id),
    layout_id UUID REFERENCES layouts(id),
    x_coord NUMERIC(10, 2) NOT NULL,
    y_coord NUMERIC(10, 2) NOT NULL,
    diameter NUMERIC(5, 2) NOT NULL,
    height NUMERIC(5, 2) NOT NULL
);

CREATE TABLE fave_design(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    design_id UUID REFERENCES designs(id)
);

`;

  // --- 3. Read CSV Data ---
  const plantsCsvContent = await readCsvFile(PLANTS_CSV_PATH);
  const stylesCsvContent = await readCsvFile(STYLES_CSV_PATH);

  const plantsData = parseCsv(plantsCsvContent);
  const stylesData = parseCsv(stylesCsvContent);

  // Maps to store generated UUIDs for relationships
  const designStylesMap = new Map();
  const plantMap = new Map();
  const userMap = new Map();
  const projectMap = new Map();
  const layoutMap = new Map();

  // Populate plantMap with full plant data for easy lookup later
  plantsData.forEach((plant) => {
    plantMap.set(plant.Name.toLowerCase(), {
      id: uuidv4(), // Generate ID here for insertion
      name: plant.Name.toLowerCase(),
      other_common_names: plant["Other Common Names"]
        ? plant["Other Common Names"].toLowerCase()
        : null,
      technical_name: plant["Technical Name"]
        ? plant["Technical Name"].toLowerCase()
        : null,
      growth_form: plant["growth form"]
        ? plant["growth form"].toLowerCase()
        : null,
      is_toxic: plant.toxic.toLowerCase() === "toxic" ? "TRUE" : "FALSE",
      sun_requirements: plant["Sun Requirements"]
        ? plant["Sun Requirements"].toLowerCase()
        : null,
      height_min_ft: parseFloat(plant["Height Min (ft)"]) || 0.1, // Ensure a default min if null/0
      height_max_ft: parseFloat(plant["Height Max (ft)"]) || 1.0, // Ensure a default max if null/0
      width_min_ft: parseFloat(plant["Width Min (ft)"]) || 0.1, // Ensure a default min if null/0
      width_max_ft: parseFloat(plant["Width Max (ft)"]) || 1.0, // Ensure a default max if null/0
      seasonal_interest: plant["Seasonal Interest"]
        ? plant["Seasonal Interest"].toLowerCase()
        : null,
      primary_color: plant["primary color"]
        ? plant["primary color"].toLowerCase()
        : null,
      accent_color: plant["accent color"]
        ? plant["accent color"].toLowerCase()
        : null,
      image_url: plant["IMAGE URL"] ? plant["IMAGE URL"].toLowerCase() : null,
    });
  });

  // --- 4. INSERT Statements ---

  // Users
  sqlStatements += `\n-- Users Inserts\n`;
  const users = [
    { username: "Justin", password: "0710", is_admin: true },
    { username: "Chelsea", password: "1234", is_admin: true },
    { username: "Callen", password: "5678", is_admin: true },
    { username: "Ellie", password: "9012", is_admin: true },
  ];
  for (const user of users) {
    const id = uuidv4();
    userMap.set(user.username.toLowerCase(), id);
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    sqlStatements += `INSERT INTO users (id, username, password, is_admin) VALUES ('${id}', '${
      user.username
    }', '${hashedPassword}', ${
      user.is_admin ? "TRUE" : "FALSE"
    }) ON CONFLICT (id) DO NOTHING;\n`;
  }
  sqlStatements += `\n`;

  // Designs (from Styles.csv)
  sqlStatements += `-- Designs Inserts\n`;
  const allDesignNames = new Set();
  const tempDesignInserts = [];

  stylesData.forEach((style) => {
    const name = style.name.trim().toLowerCase();
    if (name && !allDesignNames.has(name)) {
      allDesignNames.add(name);
      const id = uuidv4();
      designStylesMap.set(name, id);

      const shortDescription = (style["short description"] || "")
        .substring(0, 255)
        .replace(/'/g, "''");
      const longDescription = (style["long description"] || "").replace(
        /'/g,
        "''"
      );
      //modified to have it add quotes around each comma separated string, rather than quotes, just at the ends of the entire line.
      const tags = (style["tags"] || "")
        .toLowerCase()
        .split(",")
        .map((tag) => `"${tag.trim().replace(/"/g, "")}"`)
        .join(", ")
        .replace(/'/g, "''");

      tempDesignInserts.push({
        id,
        design_style_name: name,
        design_attributes: shortDescription || null,
        design_description: longDescription || null,
        design_tags: tags || null,
      });
    }
  });

  // Write all collected unique design inserts
  tempDesignInserts.forEach((design) => {
    sqlStatements += `INSERT INTO designs (id, design_style_name, design_attributes, design_description, design_tags) VALUES (\n`;
    sqlStatements += `  '${design.id}',\n`;
    sqlStatements += `  '${design.design_style_name.replace(/'/g, "''")}',\n`;
    sqlStatements += `  ${
      design.design_attributes ? `'${design.design_attributes}'` : "NULL"
    },\n`;
    sqlStatements += `  ${
      design.design_description ? `'${design.design_description}'` : "NULL"
    },\n`;
    sqlStatements += `  ${
      design.design_tags ? `'${design.design_tags}'` : "NULL"
    }\n`;
    sqlStatements += `) ON CONFLICT (id) DO NOTHING;\n\n`;
  });

  // Plants (insert plants from the map)
  sqlStatements += `-- Plants Inserts\n`;
  Array.from(plantMap.values()).forEach((plant) => {
    sqlStatements += `INSERT INTO plants (id, plant_name, other_common_names, technical_name, growth_form, is_toxic, sun_requirements, height_min_ft, height_max_ft, width_min_ft, width_max_ft, seasonal_interest, primary_color, accent_color, image_url) VALUES (\n`;
    sqlStatements += `  '${plant.id}',\n`;
    sqlStatements += `  '${plant.name.replace(/'/g, "''")}',\n`;
    sqlStatements += `  ${
      plant.other_common_names
        ? `'${plant.other_common_names.replace(/'/g, "''")}'`
        : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.technical_name
        ? `'${plant.technical_name.replace(/'/g, "''")}'`
        : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.growth_form ? `'${plant.growth_form.replace(/'/g, "''")}'` : "NULL"
    },\n`;
    sqlStatements += `  ${plant.is_toxic},\n`;
    sqlStatements += `  ${
      plant.sun_requirements
        ? `'${plant.sun_requirements.replace(/'/g, "''")}'`
        : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.height_min_ft !== null ? plant.height_min_ft : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.height_max_ft !== null ? plant.height_max_ft : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.width_min_ft !== null ? plant.width_min_ft : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.width_max_ft !== null ? plant.width_max_ft : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.seasonal_interest
        ? `'${plant.seasonal_interest.replace(/'/g, "''")}'`
        : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.primary_color
        ? `'${plant.primary_color.replace(/'/g, "''")}'`
        : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.accent_color
        ? `'${plant.accent_color.replace(/'/g, "''")}'`
        : "NULL"
    },\n`;
    sqlStatements += `  ${
      plant.image_url ? `'${plant.image_url.replace(/'/g, "''")}'` : "NULL"
    }\n`;
    sqlStatements += `) ON CONFLICT (id) DO NOTHING;\n\n`;
  });

  // plant_Design_Types
  sqlStatements += `-- plant_Design_Types Inserts\n`;
  plantsData.forEach((plant) => {
    // Using original plantsData for adaptable styles
    const plantObj = plantMap.get(plant.Name.toLowerCase()); // Get the plant object with ID
    if (!plantObj) {
      console.warn(
        `Warning: Plant "${plant.Name}" not found in map for plant_Design_Types.`
      );
      return;
    }
    const plantId = plantObj.id;
    const adaptableStyles = plant["Adaptable Styles"]
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    adaptableStyles.forEach((styleName) => {
      const designId = designStylesMap.get(styleName);
      if (plantId && designId) {
        sqlStatements += `INSERT INTO plant_Design_Types (id, plant_id, design_id) VALUES ('${uuidv4()}', '${plantId}', '${designId}') ON CONFLICT (plant_id, design_id) DO NOTHING;\n`;
      } else {
        console.warn(
          `Warning: Could not create plant_Design_Types for plant "${plant.Name}" (ID: ${plantId}) and style "${styleName}" (ID: ${designId}).`
        );
      }
    });
    sqlStatements += `\n`;
  });

  // Projects
  sqlStatements += `-- Projects Inserts\n`;
  const projects = [{ name: "BackyardForest", user: "Justin" }];
  for (const project of projects) {
    const projectId = uuidv4();
    projectMap.set(project.name.toLowerCase(), projectId);
    const userId = userMap.get(project.user.toLowerCase());
    if (userId) {
      sqlStatements += `INSERT INTO projects (id, project_name, user_id) VALUES ('${projectId}', '${project.name}', '${userId}') ON CONFLICT (id) DO NOTHING;\n`;
    } else {
      console.warn(
        `Warning: User "${project.user}" not found for project "${project.name}".`
      );
    }
  }
  sqlStatements += `\n`;

  // Layouts
  sqlStatements += `-- Layouts Inserts\n`;
  const layouts = [
    {
      name: "newBeginnings",
      bed_length: 10,
      bed_depth: 10,
      design_style: "cottage",
      project: "BackyardForest",
    },
    {
      name: "FernForest",
      bed_length: 12,
      bed_depth: 6,
      design_style: "modern minimalism",
      project: "BackyardForest",
    },
    {
      name: "AbsoluteSucculent",
      bed_length: 15,
      bed_depth: 10,
      design_style: "naturalistic",
      project: "BackyardForest",
    },
  ];
  for (const layout of layouts) {
    const layoutId = uuidv4();
    layoutMap.set(layout.name.toLowerCase(), layoutId);
    const designId = designStylesMap.get(layout.design_style.toLowerCase());
    const projectId = projectMap.get(layout.project.toLowerCase());
    if (designId && projectId) {
      sqlStatements += `INSERT INTO layouts (id, layout_name, bed_length, bed_depth, design_type, projects_id) VALUES (\n`;
      sqlStatements += `  '${layoutId}',\n`;
      sqlStatements += `  '${layout.name}',\n`;
      sqlStatements += `  ${layout.bed_length},\n`;
      sqlStatements += `  ${layout.bed_depth},\n`;
      sqlStatements += `  '${designId}',\n`;
      sqlStatements += `  '${projectId}'\n`;
      sqlStatements += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    } else {
      console.warn(
        `Warning: Could not create layout "${layout.name}" due to missing design (${layout.design_style}) or project (${layout.project}).`
      );
    }
  }
  sqlStatements += `\n`;

  // Favorite Plants
  sqlStatements += `-- Favorite Plants Inserts\n`;
  const favoritePlants = [
    { user: "Justin", plant: "japanese painted fern" },
    { user: "Ellie", plant: "spreading plum yew" }, // Changed from "spreading japanese plum yew"
    { user: "Callen", plant: "boxwood" },
    { user: "Chelsea", plant: "spreading plum yew" }, // Changed from "spreading japanese plum yew"
  ];
  for (const fav of favoritePlants) {
    const userId = userMap.get(fav.user.toLowerCase());
    const plantObj = plantMap.get(fav.plant.toLowerCase());
    if (userId && plantObj) {
      sqlStatements += `INSERT INTO favorite_plants (id, user_id, plant_id) VALUES ('${uuidv4()}', '${userId}', '${
        plantObj.id
      }') ON CONFLICT (user_id, plant_id) DO NOTHING;\n`;
    } else {
      console.warn(
        `Warning: Could not create favorite plant for user "${fav.user}" and plant "${fav.plant}".`
      );
    }
  }
  sqlStatements += `\n`;

  // Plant Layout (UPDATED: now with x_coord, y_coord, diameter, height using min values)
  sqlStatements += `-- Plant Layout Inserts\n`;
  const plantLayouts = [
    { plant: "japanese painted fern", layout: "newbeginnings", x: 2, y: 3 },
    { plant: "spreading plum yew", layout: "fernforest", x: 15, y: 7 }, // Changed from "spreading japanese plum yew"
    { plant: "boxwood", layout: "absolutesucculent", x: 10, y: 5 },
  ];
  for (const pl of plantLayouts) {
    const plantObj = plantMap.get(pl.plant.toLowerCase());
    const layoutId = layoutMap.get(pl.layout.toLowerCase());

    if (plantObj && layoutId) {
      // Using min values for diameter and height, defaulting to 0.1 if null/undefined
      const diameter = (
        plantObj.width_min_ft !== null && plantObj.width_min_ft !== undefined
          ? plantObj.width_min_ft
          : 0.1
      ).toFixed(2);
      const height = (
        plantObj.height_min_ft !== null && plantObj.height_min_ft !== undefined
          ? plantObj.height_min_ft
          : 0.1
      ).toFixed(2);

      sqlStatements += `INSERT INTO plant_layout (id, plant_id, layout_id, x_coord, y_coord, diameter, height) VALUES (\n`;
      sqlStatements += `  '${uuidv4()}',\n`;
      sqlStatements += `  '${plantObj.id}',\n`;
      sqlStatements += `  '${layoutId}',\n`;
      sqlStatements += `  ${pl.x},\n`;
      sqlStatements += `  ${pl.y},\n`;
      sqlStatements += `  ${diameter},\n`;
      sqlStatements += `  ${height}\n`;
      sqlStatements += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    } else {
      console.warn(
        `Warning: Could not create plant_layout for plant "${pl.plant}" and layout "${pl.layout}".`
      );
    }
  }
  sqlStatements += `\n`;

  // Fave Designs
  sqlStatements += `-- Fave Designs Inserts\n`;
  const faveDesigns = [
    { user: "Ellie", design_style: "modern minimalism" },
    { user: "Callen", design_style: "naturalistic" },
    { user: "Chelsea", design_style: "cottage" },
  ];
  for (const fd of faveDesigns) {
    const userId = userMap.get(fd.user.toLowerCase());
    const designId = designStylesMap.get(fd.design_style.toLowerCase());
    if (userId && designId) {
      sqlStatements += `INSERT INTO fave_design (id, user_id, design_id) VALUES ('${uuidv4()}', '${userId}', '${designId}') ON CONFLICT (id) DO NOTHING;\n`;
    } else {
      console.warn(
        `Warning: Could not create fave_design for user "${fd.user}" and design "${fd.design_style}".`
      );
    }
  }
  sqlStatements += `\n`;

  // Write the complete SQL SEED file
  fs.writeFileSync(path.join(__dirname, "seed.sql"), sqlStatements);
  console.log("seed.sql generated successfully in server/db/seed/!");
}

// Call the main function to generate the seed file
generateSeedFile();
