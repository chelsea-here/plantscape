const express = require("express");
const app = express.Router();

app.use("/users", require("./users"));
app.use("/plants", require("./plants"));
app.use("/favorite_plants", require("./favorite_plants"));
app.use("/layouts", require("./layouts"));
app.use("/design", require("./design"));
app.use("/plantDesign", require("./plant_Design_Type"));
app.use("/faveDesign", require("./fave_design"));
app.use("/projects", require("./projects"));
app.use("/authenticate", require("./authenticate"));

module.exports = app;
