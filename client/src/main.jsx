import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { PlantCatalogProvider } from "./context/PlantCatalogContext.jsx";
import { DesignStyleProvider } from "./context/DesignStyleContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { ProjectProvider } from "./context/ProjectContext.jsx";
import { GardenBedProvider } from "./context/GardenBedContext.jsx";
import "./assets/main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <UserProvider>
      <PlantCatalogProvider>
        <DesignStyleProvider>
            <ProjectProvider>
              <GardenBedProvider>
                <App />
              </GardenBedProvider>
            </ProjectProvider>
        </DesignStyleProvider>
      </PlantCatalogProvider>
        </UserProvider>
    </Router>
  </React.StrictMode>
);
