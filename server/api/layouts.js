// api/layouts.js
const express = require("express");
const app = express.Router();

const {
  createLayout,
  createPlantLayout,
  fetchLayouts, // Fetches all layouts for a given project
  fetchLayoutsById, // Fetches a single layout by its ID
} = require("../db/layouts"); //NOTE: layout and plant-layout files have been merged

const {
  fetchSingleProjectById, // NEW: Import this from db/projects for security checks
} = require("../db/Projects"); // Assuming db/projects.js is correct and exports this

const { isLoggedIn } = require("./middleware");

// --- Route to create a new layout (garden bed) for a project ---
// POST /api/layouts/:projectId/layouts
app.post("/:projectId/layouts", isLoggedIn, async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const {
      layout_name,
      bed_length,
      bed_depth,
      design_type,
      placed_plants_data,
    } = req.body;

    // SECURITY CHECK 1: Ensure the project exists and belongs to the logged-in user
    const project = await fetchSingleProjectById(projectId);
    if (!project || project.user_id !== req.user.id) {
      const error = Error(
        "Project not found or unauthorized to create layout for this project"
      );
      error.status = 404; // Or 403 Forbidden if project exists but belongs to another user
      throw error;
    }

    const layout = await createLayout({
      layout_name,
      bed_length,
      bed_depth,
      design_type,
      projects_id: projectId, // Associate with the project
      placed_plants_data,
    });
    res.status(201).send(layout);
  } catch (error) {
    next(error);
  }
});

// --- Route to fetch all layouts (garden beds) for a specific project ---
// GET /api/layouts/:projectId/layouts
app.get("/:projectId/layouts", isLoggedIn, async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // SECURITY CHECK 2: Ensure the project exists and belongs to the logged-in user
    const project = await fetchSingleProjectById(projectId);
    if (!project || project.user_id !== req.user.id) {
      const error = Error(
        "Project not found or unauthorized to view layouts for this project"
      );
      error.status = 404; // Or 403 Forbidden
      throw error;
    }

    const layouts = await fetchLayouts(req.params.projectId);
    res.send(layouts);
  } catch (error) {
    next(error);
  }
});

// --- Route to fetch a single layout (garden bed) by its ID ---
// GET /api/layouts/layouts/:layoutId (renamed :id to :layoutId for clarity)
app.get("/layouts/:layoutId", isLoggedIn, async (req, res, next) => {
  try {
    const { layoutId } = req.params;
    const layout = await fetchLayoutsById(layoutId);

    if (!layout) {
      return res.status(404).send({ message: "Layout not found." });
    }

    // SECURITY CHECK 3: Ensure the fetched layout belongs to a project owned by the logged-in user
    const project = await fetchSingleProjectById(layout.projects_id);
    if (!project || project.user_id !== req.user.id) {
      const error = Error(
        "Layout not found or unauthorized to view this layout"
      );
      error.status = 404; // Or 403 Forbidden
      throw error;
    }

    res.send(layout);
  } catch (error) {
    next(error);
  }
});

// --- Route to add a plant to a specific layout ---
// POST /api/layouts/:layoutId/plants
app.post("/:layoutId/plants", isLoggedIn, async (req, res, next) => {
  try {
    const { layoutId } = req.params;
    const { plant_id, x, y, diameter, height } = req.body;

    // SECURITY CHECK 4: Ensure the target layout belongs to a project owned by the logged-in user
    const layout = await fetchLayoutsById(layoutId);
    if (!layout) {
      return res.status(404).send({ message: "Target layout not found." });
    }
    const project = await fetchSingleProjectById(layout.projects_id);
    if (!project || project.user_id !== req.user.id) {
      const error = Error("Unauthorized to add plant to this layout");
      error.status = 404; // Or 403 Forbidden
      throw error;
    }

    const newPlacedPlant = await createPlantLayout({
      plant_id,
      layout_id: layoutId,
      x_coord: x,
      y_coord: y,
      diameter,
      height,
    });
    res.status(201).send(newPlacedPlant);
  } catch (error) {
    // This 'catch' block will now handle errors thrown by createPlantLayout
    // If an error has a .status property (e.g., from validation), use it; otherwise, default to 500.
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while placing the plant.",
    });
    // Optionally, you can also call next(error) if you have a global error handler middleware
    // that logs errors or performs other actions.
    // next(error);
  }
});

//--future implementation after public/private security is in place
// --- Routes for raw plant_layout entries (Consider if truly needed and secure) ---
// WARNING: These routes expose raw plant_layout entries.
// They need very strong security if they are to remain,
// ensuring the user owns the associated layout/project.
// It's generally better to get placed plants via fetchLayouts or fetchLayoutsById.

// Route to fetch all plant_layout entries (HIGH SECURITY RISK - REMOVE OR RESTRICT)
// GET /api/layouts/plant_layout
// This route is dangerous as it can expose all plant placements across all users.
// If you must keep it, it should likely be restricted to isAdmin only, or removed.
// app.get("/plant_layout", isLoggedIn, async (req, res, next) => {
//     try {
//         // This should ideally be restricted to admin users or removed.
//         // If kept, add an isAdmin check: if (!req.user.is_admin) { throw 403 }
//         const plantLayouts = await fetchPlantLayout(); // This fetches ALL
//         res.send(plantLayouts);
//     } catch (error) {
//         next(error);
//     }
// });

// commented out for now, can uncomment (and uncomment imports and exports from associated files) if it is needed.
// Route to fetch a single plant_layout entry by its ID (NEW - moved from old api/plant_layout.js, needs security check)
// GET /api/layouts/plant_layout/:plantLayoutId (renamed :id for clarity)
// app.get("/plant_layout/:plantLayoutId", isLoggedIn, async (req, res, next) => {
//     try {
//         const { plantLayoutId } = req.params;
//         const plantLayout = await fetchPlantLayoutById(plantLayoutId);

//         if (!plantLayout) {
//             return res.status(404).send({ message: "Plant layout entry not found." });
//         }

//         // SECURITY CHECK 5: Ensure the plant_layout's layout belongs to a project owned by the logged-in user
//         const layout = await fetchLayoutsById(plantLayout.layout_id);
//         if (!layout) { // Should not happen if plantLayout.layout_id is valid
//             return res.status(404).send({ message: "Associated layout not found." });
//         }
//         const project = await fetchSingleProjectById(layout.projects_id);
//         if (!project || project.user_id !== req.user.id) {
//             const error = Error('Unauthorized to view this plant layout entry');
//             error.status = 404; // Or 403 Forbidden
//             throw error;
//         }

//         res.send(plantLayout);
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = app;
