const express = require("express");
const app = express.Router();

const { createDesign, fetchDesign, fetchDesignById } = require("../db/design");

app.post("/", async (req, res, next) => {
  // is admin and is logged in
  try {
    // Destructure the expected fields from req.body
    const {
      design_style_name,
      design_attributes,
      design_description,
      design_tags,
    } = req.body;
    // Pass them explicitly to the createDesign function
    res.send(
      await createDesign({
        design_style_name,
        design_attributes,
        design_description,
        design_tags,
      })
    );
  } catch (error) {
    next(error);
  }
});

app.get("/", async (req, res, next) => {
  try {
    res.send(await fetchDesign());
  } catch (error) {
    next(error);
  }
});

app.get("/:id", async (req, res, next) => {
  try {
    res.send(await fetchDesignById(req.params.id));
  } catch (error) {
    next(error);
  }
});

module.exports = app;
