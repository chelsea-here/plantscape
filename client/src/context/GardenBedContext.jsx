import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { UserContext } from "./UserContext"; // To get user and getHeaders
import { ProjectContext } from "./ProjectContext"; // To get currentEditingProject or activeProjectId
import { gardenBedTemplates } from "../data/gardenBedTemplates";

export const GardenBedContext = createContext();

export const GardenBedProvider = ({ children }) => {
  const [gardenBeds, setGardenBeds] = useState([]);
  const [templateBeds, setTemplateBeds] = useState(gardenBedTemplates);
  const [currentEditingGardenBed, setCurrentEditingGardenBed] = useState(null); // Detailed data for the bed being edited
  const [loadingGardenBeds, setLoadingGardenBeds] = useState(true);

  const { user, getHeaders } = useContext(UserContext);
  const { currentEditingProject, activeProjectId } = useContext(ProjectContext);

  // For convenience, expose these separately from currentEditingGardenBed
  const bedSize = currentEditingGardenBed?.bedSize;
  const placedPlants = currentEditingGardenBed?.placedPlants;

  // --- Function to fetch all garden beds for the currently active project ---
  // This connects to: GET /api/layouts/project/:projectId
  const fetchGardenBedsForProject = useCallback(async () => {
    const projectIdToFetch = currentEditingProject?.id || activeProjectId;

    if (
      !projectIdToFetch ||
      !user?.id ||
      !getHeaders().headers?.authorization
    ) {
      setGardenBeds([]);
      setCurrentEditingGardenBed(null);
      setLoadingGardenBeds(false);
      return;
    }

    setLoadingGardenBeds(true);
    try {
      const { data } = await axios.get(
        `/api/layouts/${projectIdToFetch}/layouts`,
        getHeaders()
      ); // Corrected API path
      setGardenBeds(data);
      console.log(
        `Fetched ${data.length} garden beds for project ${projectIdToFetch}`
      );
    } catch (error) {
      console.error(
        `Failed to fetch garden beds for project ${projectIdToFetch}:`,
        error
      );
      setGardenBeds([]);
    } finally {
      setLoadingGardenBeds(false);
    }
  }, [
    currentEditingProject?.id,
    activeProjectId,
    user?.id,
    getHeaders,
    currentEditingGardenBed,
  ]);

  // --- Function to fetch a single garden bed by its ID ---
  // This connects to: GET /api/layouts/layouts/:layoutId
  const fetchSingleGardenBed = useCallback(
    async (layoutId) => {
      if (!layoutId || !user?.id || !getHeaders().headers?.authorization) {
        setCurrentEditingGardenBed(null);
        return null;
      }
      setLoadingGardenBeds(true);
      try {
        const { data } = await axios.get(
          `/api/layouts/layouts/${layoutId}`,
          getHeaders()
        );
        setCurrentEditingGardenBed(data);
        console.log("Fetched single garden bed:", data);
        return data;
      } catch (error) {
        console.error(`Failed to fetch garden bed with ID ${layoutId}:`, error);
        setCurrentEditingGardenBed(null);
        throw error;
      } finally {
        setLoadingGardenBeds(false);
      }
    },
    [user?.id, getHeaders]
  );

  // --- Function to create a new garden bed (from scratch or from template) ---
  // This connects to: POST /api/layouts/:projectId/layouts
  // bedData should contain: layout_name, bed_length, bed_depth, design_type
  const createGardenBed = useCallback(
    async (bedData) => {
      const projectIdForNewBed = currentEditingProject?.id || activeProjectId;

      if (
        !user?.id ||
        !projectIdForNewBed ||
        !getHeaders().headers?.authorization
      ) {
        console.error(
          "Cannot create garden bed: User not logged in or no active project selected."
        );
        throw new Error("Authentication or project missing.");
      }
      try {
        // Send the bed data along with the projects_id
        const dataToSend = { ...bedData, projects_id: projectIdForNewBed };
        const { data: newBed } = await axios.post(
          `/api/layouts/${projectIdForNewBed}/layouts`,
          dataToSend,
          getHeaders()
        );
        setGardenBeds((prev) => [...prev, newBed]); // Add to the list
        console.log("Garden bed created successfully:", newBed);
        return newBed;
      } catch (error) {
        console.error("Failed to create garden bed:", error);
        throw error;
      }
    },
    [user?.id, currentEditingProject?.id, activeProjectId, getHeaders]
  );

  // --- Function to add a plant to a garden bed ---
  // This connects to: POST /api/layouts/:layoutId/plants
  const addPlantToGardenBed = useCallback(
    async (plantLayoutData) => {
      if (!user?.id || !getHeaders().headers?.authorization) {
        console.error("Cannot add plant: User not logged in.");
        throw new Error("Authentication missing.");
      }
      try {
        const { data: newPlantPlacement } = await axios.post(
          `/api/layouts/${plantLayoutData.layout_id}/plants`,
          plantLayoutData,
          getHeaders()
        );

        // After placing a plant, re-fetch the current editing garden bed to update its placedPlants array.
        // This ensures the canvas or display updates with the new plant.
        if (
          currentEditingGardenBed &&
          currentEditingGardenBed.id === plantLayoutData.layout_id
        ) {
          await fetchSingleGardenBed(currentEditingGardenBed.id);
        }
        console.log("Plant placed successfully:", newPlantPlacement);
        return newPlantPlacement;
      } catch (error) {
        console.error("Failed to add plant to garden bed:", error);
        throw error;
      }
    },
    [user?.id, getHeaders, currentEditingGardenBed, fetchSingleGardenBed]
  );

  return (
    <GardenBedContext.Provider
      value={{
        gardenBeds,
        setGardenBeds,
        templateBeds, // Expose templateBeds for selection
        currentEditingGardenBed,
        setCurrentEditingGardenBed,
        loadingGardenBeds,
        fetchGardenBedsForProject,
        fetchSingleGardenBed,
        createGardenBed, // This will now create a real bed from template data
        addPlantToGardenBed,
        bedSize,
        placedPlants,
      }}
    >
      {children}
    </GardenBedContext.Provider>
  );
};

//how to use it in components
// import { useContext } from "react";
// import { GardenBedContext } from "../context/GardenBedContext";

// const { bedSize, placedPlants } = useContext(GardenBedContext);

//example of how to update data in setCurrentEditingGardenBed:
// setCurrentEditingGardenBed({
//   ...currentEditingGardenBed,
//   placedPlants: updatedPlantList,
// });
