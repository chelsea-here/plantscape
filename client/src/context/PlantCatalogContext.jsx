// context/PlantCatalogContext.jsx
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export const PlantCatalogContext = createContext();

export const PlantCatalogProvider = ({ children }) => {
  const [plantCatalog, setPlantCatalog] = useState([]);
  const [plant, setPlant] = useState(null);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [loadingSinglePlant, setLoadingSinglePlant] = useState(false);
  const [errorPlantCatalog, setErrorPlantCatalog] = useState(null);
  const [errorSinglePlant, setErrorSinglePlant] = useState(null);
  const { user, getHeaders } = useContext(UserContext);
  const [favoritePlant, setFavoritePlant] = useState([]);

  const fetchPlants = useCallback(async () => {
    console.log("ran fetch Plants function");
    setLoadingPlants(true); // Set loading to true before fetching
    try {
      const { data } = await axios.get("/api/plants");
      setPlantCatalog(data);
    } catch (err) {
      console.error("Failed to fetch plants:", err);
      setPlantCatalog([]); // Clear catalog on error
    } finally {
      setLoadingPlants(false); // Set loading to false after fetch completes (success or error)
    }
  }, []); // Dependencies for fetchPlants useCallback: Empty array as it doesn't depend on external state

  //
  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const fetchPlantById = useCallback(async (plantId) => {
    console.log("ran fetch plant by ID");
    if (!plantId) {
      // Check for invalid ID first
      setErrorSinglePlant(
        new Error("Invalid plant ID: ID is undefined or null.")
      );
      setPlant(null);
      return null; // Exit early if ID is invalid
    }
    //
    // ONLY if plantId is valid, then we proceed to set loading and make the API call
    setLoadingSinglePlant(true);
    setErrorSinglePlant(null); // Clear previous errors
    console.log("loading plant");
    try {
      const { data } = await axios.get(`/api/plants/${plantId}`);
      setPlant(data);
      return data;
    } catch (err) {
      console.error(`Failed to fetch plant by ID ${plantId}:`, err);
      setErrorSinglePlant(err);
      setPlant(null);
      throw err;
    } finally {
      setLoadingSinglePlant(false);
      console.log("no longer loading plant");
    }
  }, []);

  //  Helper function to find a plant by its name from the already loaded catalog
  // Now returns the full plant object if found, otherwise null.
  const plantByName = useCallback(
    (name) => {
      if (!name || plantCatalog.length === 0) {
        return null; // Return null if name is empty or catalog is not loaded
      }
      // Perform a case-insensitive search for the plant name
      const foundPlant = plantCatalog.find(
        (p) => p.plant_name.toLowerCase() === name.toLowerCase()
      );
      // Return the full plant object if found, otherwise null
      return foundPlant;
    },
    [plantCatalog]
  ); // Dependency: plantCatalog, so it re-memoizes if the catalog changes

  const fetchFavoritePlants = useCallback(async () => {
    // Only fetch if user is logged in
    if (!user || !user.id) {
      setFavoritePlant([]); // Clear favorites if no user
      console.log("User not logged in or has no ID, clearing favorites.");
      return;
    }
    try {
      console.log("Fetching favorite plants for user:", user.id);
      const { data } = await axios.get("/api/favorite_plants", getHeaders());
      setFavoritePlant(data);
      console.log("Fetched favorite plants data:", data);
    } catch (error) {
      console.error("Failed to fetch favorite plants:", error);
      setFavoritePlant([]); // Clear favorites on error
    }
  }, [user, getHeaders]); // Dependencies for fetchFavoritePlants

  // Effect to fetch favorite plants when user changes or component mounts
  useEffect(() => {
    // Only fetch if user is available (or becomes available)
    if (user) {
      fetchFavoritePlants();
    } else {
      setFavoritePlant([]); // Clear favorites if user logs out
    }
  }, [user, fetchFavoritePlants]); // Re-run when user or fetchFavoritePlants changes

  // Adds the capability to add favorites
  const addFavePlant = useCallback(
    async (plantId) => {
      console.log("Attempting to add favorite:", { plantId, userId: user?.id });
      if (!user) {
        console.error("Cannot add favorite. User is not logged in.");
        return; // Guard against no user
      }
      try {
        const { data } = await axios.post("/api/favorite_plants", { plant_id: plantId, user_id: user.id }, getHeaders());
        console.log("Successfully added favorite. Server response:", data);
        // Use functional update to safely add the new favorite
        setFavoritePlant((prevFavorites) => {
          const newFavorites = [...prevFavorites, data];
          console.log("Updated favorite plants state:", newFavorites);
          return newFavorites;
        });
      } catch (error) {
        console.error("Failed to add favorite plant:", error); // Consistent error logging
      }
    },
    [user, getHeaders]
  ); // Dependencies for useCallback

  // Adds the capability to delete
  const unfavoritePlant = useCallback(
    async (favePlantId) => {
      console.log("Attempting to remove favorite:", {
        favePlantId,
        userId: user?.id,
      });
      if (!user) {
        console.error("Cannot remove favorite. User is not logged in.");
        return; // Guard against no user
      }
      try {
        await axios.delete(
          `/api/favorite_plants/${favePlantId}/user/${user.id}`,
          getHeaders()
        );
        console.log("Successfully removed favorite via API.");
        // Use functional update to safely remove the favorite
        setFavoritePlant((prevFavorites) => {
          const newFavorites = prevFavorites.filter(
            (favPlant) => favPlant.id !== favePlantId
          );
          console.log("Updated favorite plants state:", newFavorites);
          return newFavorites;
        });
      } catch (error) {
        console.log("Failed to remove favorite plant:", error);
      }
    },
    [user, getHeaders]
  ); // Dependency on user for the API call

  return (
    <PlantCatalogContext.Provider
      value={{
        plantCatalog,
        setPlantCatalog,
        loadingPlants,
        plant,
        setPlant,
        fetchPlantById,
        loadingSinglePlant,
        errorSinglePlant,
        plantByName,
        addFavePlant,
        favoritePlant,
        setFavoritePlant,
        unfavoritePlant,
      }}
    >
      {children}
    </PlantCatalogContext.Provider>
  );
};

//custom hooks for convenience
export const usePlantCatalog = () => {
  const context = useContext(PlantCatalogContext);
  // This check ensures the hook is used within its Provider
  if (context === undefined) {
    throw new Error(
      "usePlantCatalog must be used within a PlantCatalogProvider"
    );
  }
  return context;
};
