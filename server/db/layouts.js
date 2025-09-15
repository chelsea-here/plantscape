// db/layouts.js
const client = require("./client");
const { v4 } = require("uuid");
const uuidv4 = v4;

// Temporary? Helper function required for Design Templates incorporation (at least in the short term) to find plant ID by name
async function getPlantIdByName(plantName) {
  try {
    const { rows } = await client.query(
      `SELECT id FROM plants WHERE LOWER(plant_name) = LOWER($1)`,
      [plantName]
    );
    return rows.length > 0 ? rows[0].id : null; // Return the UUID if found
  } catch (error) {
    console.error("Error in getPlantIdByName:", error);
    throw error;
  }
}

// createLayout (MODIFIED to handle placed_plants_data)
const createLayout = async (layout) => {
  const newLayoutId = uuidv4(); // modified for garden bed template incorporation, this Generate ID once for the new layout
  const SQL = `
    INSERT INTO layouts (id, layout_name, bed_length, bed_depth, design_type, projects_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `;
  const response = await client.query(SQL, [
    newLayoutId, // Use the generated ID for the new layout
    layout.layout_name,
    layout.bed_length,
    layout.bed_depth,
    layout.design_type,
    layout.projects_id,
  ]);
  const newLayout = response.rows[0]; // now string this in a variable instead of returning immediately we will run it through if statements below...

  //---- NEW CODE SECTION TO PROCESS PLACED PLANTS FROM TEMPLATE
  // Process placed_plants_data if it exists in the incoming 'layout' object
  console.log(
    "createLayout: Received placed_plants_data:",
    layout.placed_plants_data
  ); // DEBUG LOG 1
  if (layout.placed_plants_data && layout.placed_plants_data.length > 0) {
    for (const plantPlacement of layout.placed_plants_data) {
      // Find the actual plant_id (UUID) from the plants table by name
      const plantId = await getPlantIdByName(plantPlacement.name);
      console.log(
        `createLayout: Processing plant "${plantPlacement.name}", found ID: ${plantId}`
      ); // DEBUG LOG 2

      if (plantId) {
        // Call the existing createPlantLayout function to insert each placed plant
        await createPlantLayout({
          plant_id: plantId,
          layout_id: newLayout.id, // Link to the newly created layout
          x_coord: plantPlacement.x,
          y_coord: plantPlacement.y,
          diameter: plantPlacement.diameter,
          height: plantPlacement.height,
        });
        console.log(
          `createLayout: Plant "${plantPlacement.name}" inserted for layout ${newLayout.id}`
        ); // DEBUG LOG 3
      } else {
        console.warn(
          `DB: Plant "${plantPlacement.name}" from template not found in database. Skipping plant_layout entry for layout ${newLayout.id}.`
        );
      }
    }
  } else {
    console.log("createLayout: No placed_plants_data or it's empty."); // DEBUG LOG 4
  }
  //----- END OF NEW CODE SECTION

  return newLayout; // Return the newly created layout object
};
// createPlantLayout (UPDATED - from old plant_layout.js, now using new schema fields)
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
  console.log(
    "createPlantLayout: Inserted plant layout entry:",
    response.rows[0]
  ); // DEBUG LOG 5
  return response.rows[0];
};

// fetchLayouts (existing function)
const fetchLayouts = async (projectId) => {
  const SQL = `
    SELECT
        l.id AS layout_id,
        l.layout_name,
        l.bed_length,
        l.bed_depth,
        l.design_type,
        l.projects_id,
        pl.id AS plant_layout_id,
        pl.x_coord,
        pl.y_coord,
        pl.diameter,
        pl.height,
        p.id AS plant_id,
        p.plant_name,
        p.other_common_names,
        p.technical_name,
        p.growth_form,
        p.is_toxic,
        p.sun_requirements,
        p.height_min_ft,
        p.height_max_ft,
        p.width_min_ft,
        p.width_max_ft,
        p.seasonal_interest,
        p.primary_color,
        p.accent_color,
        p.image_url
    FROM layouts AS l
    LEFT JOIN plant_layout AS pl ON l.id = pl.layout_id
    LEFT JOIN plants AS p ON pl.plant_id = p.id
    WHERE l.projects_id = $1
    ORDER BY l.id, pl.id;
    `;
  const response = await client.query(SQL, [projectId]);

  const layoutsMap = new Map();
  response.rows.forEach((row) => {
    if (!layoutsMap.has(row.layout_id)) {
      layoutsMap.set(row.layout_id, {
        id: row.layout_id,
        layout_name: row.layout_name,
        bedSize: {
          bedLength: row.bed_length,
          bedDepth: row.bed_depth,
        },
        design_type: row.design_type,
        projects_id: row.projects_id,
        placedPlants: [],
      });
    }
    if (row.plant_layout_id) {
      layoutsMap.get(row.layout_id).placedPlants.push({
        id: row.plant_layout_id,
        x: row.x_coord,
        y: row.y_coord,
        diameter: row.diameter,
        height: row.height,
        plant_details: {
          id: row.plant_id,
          plant_name: row.plant_name,
          other_common_names: row.other_common_names,
          technical_name: row.technical_name,
          growth_form: row.growth_form,
          is_toxic: row.is_toxic,
          sun_requirements: row.sun_requirements,
          height_min_ft: row.height_min_ft,
          height_max_ft: row.height_max_ft,
          width_min_ft: row.width_min_ft,
          width_max_ft: row.width_max_ft,
          seasonal_interest: row.seasonal_interest,
          primary_color: row.primary_color,
          accent_color: row.accent_color,
          image_url: row.image_url,
        },
      });
    }
  });
  return Array.from(layoutsMap.values());
};

// fetchLayoutsById (existing function)
const fetchLayoutsById = async (id) => {
  const SQL = `
    SELECT
        l.id AS layout_id,
        l.layout_name,
        l.bed_length,
        l.bed_depth,
        l.design_type,
        l.projects_id,
        pl.id AS plant_layout_id,
        pl.x_coord,
        pl.y_coord,
        pl.diameter,
        pl.height,
        p.id AS plant_id,
        p.plant_name,
        p.other_common_names,
        p.technical_name,
        p.growth_form,
        p.is_toxic,
        p.sun_requirements,
        p.height_min_ft,
        p.height_max_ft,
        p.width_min_ft,
        p.width_max_ft,
        p.seasonal_interest,
        p.primary_color,
        p.accent_color,
        p.image_url
    FROM layouts AS l
    LEFT JOIN plant_layout AS pl ON l.id = pl.layout_id
    LEFT JOIN plants AS p ON pl.plant_id = p.id
    WHERE l.id = $1
    ORDER BY pl.id;
    `;
  const response = await client.query(SQL, [id]);

  console.log("fetchLayoutsById: Raw SQL Response Rows:", response.rows); // DEBUG LOG 6
  if (response.rows.length === 0) {
    console.log("fetchLayoutsById: Layout not found, returning null."); // DEBUG LOG 7
    return null;
  }

  const firstRow = response.rows[0];
  const layout = {
    id: firstRow.layout_id,
    layout_name: firstRow.layout_name,
    bedSize: {
      bedLength: firstRow.bed_length,
      bedDepth: firstRow.bed_depth,
    },
    design_type: firstRow.design_type,
    projects_id: firstRow.projects_id,
    placedPlants: [],
  };

  // Only add placed plants if there are any associated with the layout
  // (check if plant_layout_id is not null from the first row)
  if (firstRow.plant_layout_id) {
    console.log("fetchLayoutsById: Processing placed plants."); // DEBUG LOG 8
    response.rows.forEach((row) => {
      layout.placedPlants.push({
        id: row.plant_layout_id,
        x: row.x_coord,
        y: row.y_coord,
        diameter: row.diameter,
        height: row.height,
        plant_details: {
          id: row.plant_id,
          plant_name: row.plant_name,
          other_common_names: row.other_common_names,
          technical_name: row.technical_name,
          growth_form: row.growth_form,
          is_toxic: row.is_toxic,
          sun_requirements: row.sun_requirements,
          height_min_ft: row.height_min_ft,
          height_max_ft: row.height_max_ft,
          width_min_ft: row.width_min_ft,
          width_max_ft: row.width_max_ft,
          seasonal_interest: row.seasonal_interest,
          primary_color: row.primary_color,
          accent_color: row.accent_color,
          image_url: row.image_url,
        },
      });
    });
  } else {
    console.log(
      "fetchLayoutsById: No plant_layout_id in first row, placedPlants will be empty."
    ); // DEBUG LOG 9
  }

  return layout;
};

//This would fetch all plants garden bed layouts regardless of user or logged in status.. this is a start for a future service of sharing public and private projects/gardenbeds
// fetchPlantLayout (NEW - moved from plant_layout.js)
// const fetchPlantLayout = async () => {
//   const SQL = `
//     SELECT id, plant_id, layout_id, x_coord, y_coord, diameter, height
//     FROM plant_layout
//     `;
//   const response = await client.query(SQL);
//   return response.rows;
// };

//this route is likely not needed for frontend, and would need strong security additions. so commenting it out for now
// const fetchPlantLayoutById = async (id) => {
//   const SQL = `
//     SELECT id, plant_id, layout_id, x_coord, y_coord, diameter, height
//     FROM plant_layout
//     WHERE id = $1
//     `;
//   const response = await client.query(SQL, [id]);
//   return response.rows[0];
// };

module.exports = {
  createLayout,
  fetchLayouts,
  fetchLayoutsById,
  createPlantLayout, // Now handles x_coord, y_coord, diameter, height
  // fetchPlantLayout,
  // fetchPlantLayoutById,
};
