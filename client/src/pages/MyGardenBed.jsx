import { useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { GardenBedContext } from "../context/GardenBedContext";
import { DesignStyleContext } from "../context/DesignStyleContext";
import GardenCanvas from "../components/canvas/GardenCanvas";
import "./MyGardenBed.css";

const MyGardenBed = () => {
  const { user } = useContext(UserContext);
  const {
    currentEditingGardenBed, // The detailed garden bed object fetched by fetchSingleGardenBed
    fetchSingleGardenBed, // Function to fetch a single garden bed by ID
    loadingGardenBeds, // Loading state for garden beds
    addPlantToGardenBed, // for adding plants directly
  } = useContext(GardenBedContext);

  const { styles } = useContext(DesignStyleContext);
  const { layoutId } = useParams();

  // Effect to fetch the specific garden bed when the component mounts or layoutId changes
  useEffect(() => {
    if (layoutId && user?.id) {
      // Ensure we have an ID from URL and a logged-in user
      fetchSingleGardenBed(layoutId);
    } else if (!layoutId) {
      console.warn("MyGardenBed: No layout ID provided in URL.");
      // Optionally redirect or show a message if no layout ID is available
      // navigate('/mygardenbeds'); // Example: redirect to list of all beds
    }
  }, [layoutId, user?.id, fetchSingleGardenBed]); // Dependencies: layoutId, user.id, and the memoized fetch function

  // Find the design name based on the design_type UUID
  const designName =
    styles.find((style) => style.id === currentEditingGardenBed?.design_type)
      ?.design_style_name || "Unknown Design"; // Default if not found or loading

  // --- Filter for only unique plants to display ---
  const uniquePlantsToShow = [];
  const seenPlantIds = new Set();

  if (
    currentEditingGardenBed?.placedPlants &&
    currentEditingGardenBed.placedPlants.length > 0
  ) {
    currentEditingGardenBed.placedPlants.forEach((plantPlacement) => {
      // Use plant_details.id for uniqueness, as it represents the plant species ID
      if (
        plantPlacement.plant_details?.id &&
        !seenPlantIds.has(plantPlacement.plant_details.id)
      ) {
        uniquePlantsToShow.push(plantPlacement);
        seenPlantIds.add(plantPlacement.plant_details.id);
      }
    });
  }

  // --- Render Logic ---
  if (!user?.id) {
    // Added optional chaining for user to prevent errors if user is null
    return (
      <div className="my-garden-bed-container">
        Please log in to view garden beds.
      </div>
    );
  }

  if (loadingGardenBeds) {
    return (
      <div className="my-garden-bed-container">
        Loading garden bed details...
      </div>
    ); // Show loading for garden bed
  }

  if (!currentEditingGardenBed) {
    return (
      <div className="my-garden-bed-container">
        Garden bed not found or could not be loaded.
      </div>
    );
  }

  return (
    <div className="my-garden-bed-container">
      <div className="garden-bed-header">
        <h1>Garden Bed: {currentEditingGardenBed.layout_name}</h1>
        <p>ID: {currentEditingGardenBed.id}</p>
        <p>Project ID: {currentEditingGardenBed.projects_id}</p>
        <p>
          Bed Size: {currentEditingGardenBed.bedSize?.bedLength}ft x{" "}
          {currentEditingGardenBed.bedSize?.bedDepth}ft
        </p>
        <p>Design Type: {designName}</p>
      </div>

      <div className="garden-bed-content">
        {/* Canvas Rendering Area */}
        <div className="garden-canvas-wrapper">
          <GardenCanvas bedData={currentEditingGardenBed} />
        </div>

        {/* Placed Plants List with Images */}
        <div className="placed-plants-section">
          <h2>Plants Used:</h2> {/* Changed heading for clarity */}
          {uniquePlantsToShow.length > 0 ? (
            <div className="placed-plants-grid">
              {uniquePlantsToShow.map(
                (
                  plantPlacement // Use uniquePlantsToShow here
                ) => (
                  <div
                    key={plantPlacement.plant_details.id}
                    className="placed-plant-card"
                  >
                    {" "}
                    {/* Key by plant_details.id */}
                    {plantPlacement.plant_details?.image_url && (
                      <img
                        src={plantPlacement.plant_details.image_url}
                        alt={plantPlacement.plant_details.plant_name}
                        className="plant-image-thumbnail"
                      />
                    )}
                    <h3>
                      {plantPlacement.plant_details?.plant_name ||
                        "Unknown Plant"}
                    </h3>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="no-plants-message">
              No plants placed in this garden bed yet.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="garden-bed-actions">
        {/* <Link
          to={`/add-plant-to-bed/${currentEditingGardenBed.id}`}
          className="action-button"
        >
          Add Plant
        </Link> */}
        <button
          onClick={() =>
            console.log("Implement add plant to garden bed functionality")
          }
          className="action-button"
        >
          Add Plant
        </button>
        <button
          onClick={() => console.log("Implement edit garden bed functionality")}
          className="action-button"
        >
          Edit Bed
        </button>
      </div>
    </div>
  );
};

export default MyGardenBed;
