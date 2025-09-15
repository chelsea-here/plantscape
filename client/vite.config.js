// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// ✅ Load .env variable
dotenv.config();

// Define your deployed API base URL
const deployedAPI = "https://plantscape-2aqa.onrender.com";

// Determine the API proxy target based on environment variables.
// Priority:
// 1. VITE_APP_API_BASE_URL (from your client/.env file for local overrides)
// 2. deployedAPI (default for production or if no local override is specified)
const apiProxyTarget = process.env.VITE_APP_API_BASE_URL || deployedAPI;

console.log(`Vite proxying /api to: ${apiProxyTarget}`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // This is the key for the path to proxy
        target: apiProxyTarget, // The target backend URL
        changeOrigin: true,
        secure: true, //our api is an https so it is secure
      },
    },
  },
});

/*
  How to use this configuration:

  1.  For Local Development (to connect to your local backend):
      Create a file named `.env` in your `client` folder (e.g., `client/.env`).
      Add the following line to it, ensuring the port matches your local backend's port:
      VITE_APP_API_BASE_URL=http://localhost:3000

  2.  For Deployed Web Services (default behavior):
      Simply DO NOT create or leave the `VITE_APP_API_BASE_URL` variable unset/empty
      in your `client/.env` file. Vite will then automatically use the `deployedAPI` URL.

  Note: The `process.env.PORT` variable is typically used by your backend server
  (Node.js) to determine its listening port, not directly by Vite's proxy configuration
  unless you explicitly set `VITE_APP_API_BASE_URL` to use it.
*/
