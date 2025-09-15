require("dotenv").config(); // MUST be at the very top!
console.log('--- SERVER INDEX.JS LOADED ---'); // ADD THIS LINE

const { client, seed } = require("./db");

const express = require("express");
const app = express();
const cors = require("cors"); // NEW: Import cors middleware for deployment
const path = require("path"); // NEW: Import path for potential static serving or fallback on deployment

// NEW: In order to prevent DB from resetting, first we need to Determine if running in production
const isProduction = process.env.NODE_ENV === "production";
console.log(
  `Server running in ${isProduction ? "production" : "development"} mode.`
);

// CORS Middleware - IMPORTANT: Configure this before your routes
app.use(
  cors({
    origin: isProduction
      ? "https://plantscape-cxpu.onrender.com"
      : "http://localhost:5173", // Dynamic origin based on environment
    credentials: true,
  })
);

app.use(express.json());

// Content-Security-Policy - Ensure this is permissive enough for all your assets
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "img-src 'self' data: https:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline' https:; " +
      "font-src 'self' https:; " +
      `connect-src 'self' ${
        isProduction
          ? "https://plantscape-2aqa.onrender.com"
          : "http://localhost:3000"
      }; ` + // Dynamic backend URL
      "object-src 'none';"
  );
  next();
});

//REPLACED THIS CODE WITH ABOVE
// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self'; img-src 'self' https:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' https:;"
//   );
//   next();
// });

app.use("/api", require("./api"));

// Optional: A simple root route for your backend's base URL
app.get("/", (req, res) => {
  res.send("Welcome to the PlantScape API!");
});

// Serve static assets from the 'dist' folder (if you were serving frontend from backend)
// This is commented out because your frontend is a separate Static Site on Render.
// app.use(express.static(path.join(__dirname, '..', 'dist')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

const init = async () => {
  // Chelsea's comment
  // const PORT = process.env.PORT || 10000; // Render sets PORT to 10000 by default
  const PORT = process.env.PORT || 3000; // Local port is set to 3000 by default (Render sets PORT to 10000 by default)
  await client.connect();
  console.log("connected to database");

  // --- CRITICAL CHANGE: Conditionally seed the database ---
  if (!isProduction) {
    console.log("Seeding database (development mode)...");
    await seed(false); // Only seed if NOT in production
  } else {
    console.log("Skipping database seeding in production mode.");
  }
  // --- END CRITICAL CHANGE ---

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
};
init();
