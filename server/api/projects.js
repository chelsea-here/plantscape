const express = require("express");
const app = express.Router();

const {
  createProject,
  fetchMyProjects,
  fetchSingleProjectById,
} = require("../db/Projects");

const { isLoggedIn } = require("./middleware");

app.post("/", isLoggedIn, async (req, res, next) => {
  try {
    // IMPORTANT: Attach the user_id from the authenticated user (req.user.id)
    // This prevents users from creating projects for other users.
    const { project_name } = req.body;
    const user_id = req.user.id;
    if (!user_id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID not found in token." });
    }

    const newProject = await createProject({ project_name, user_id });
    res.status(201).send(newProject);
  } catch (error) {
    next(error);
  }
});

//this route was intended to fetch ALL projects in the database,
// regardless of user. We will need to setup a users ability to have a private
// or public project before enabling this.
// app.get('/Projects', async (req, res, next) => {
//     try {
//         res.send(await fetchProject())
//     } catch (error) {
//         next(error)
//     }
// })

// Route to fetch ALL projects for the LOGGED-IN USER
// GET /api/projects/MyProjects
// This route MUST be protected by isLoggedIn middleware
app.get("/MyProjects", isLoggedIn, async (req, res, next) => {
  // No :id in path, user ID comes from req.user.id
  try {
    // Use req.user.id (from isLoggedIn middleware) to fetch projects for the current user
    res.send(await fetchMyProjects(req.user.id));
  } catch (error) {
    next(error);
  }
});

app.get("/:projectId", isLoggedIn, async (req, res, next) => {
  try {
    const project = await fetchSingleProjectById(req.params.projectId);

    // Security Check: Ensure the fetched project belongs to the logged-in user
    // This prevents users from accessing other users' projects by guessing IDs.
    if (!project || project.user_id !== req.user.id) {
      const error = Error("Project not found or unauthorized");
      error.status = 404; // Not Found (if project doesn't exist or doesn't belong to user)
      throw error;
    }

    res.send(project);
  } catch (error) {
    next(error);
  }
});

module.exports = app;
