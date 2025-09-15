import { useContext, useState, navi } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlantCatalogContext } from "../context/PlantCatalogContext";
import { UserContext } from "../context/UserContext";
import "./Plants.css";
import SearchBar from "../components/searchbar";

export default function Plants() {
  const { user } = useContext(UserContext);
  // Destructure favoritePlant from the context
  const {
    plantCatalog,
    loadingPlants,
    addFavePlant,
    unfavoritePlant,
    favoritePlant,
  } = useContext(PlantCatalogContext);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New Search State
  const navigate = useNavigate();

  // Helper function to check if the current plant is in the user's favorites
  const checkIfPlantIsFavorited = (plantId) => {
    // .some() is efficient as it stops searching once it finds a match
    return favoritePlant.some((fav) => fav.plant_id === plantId);
  };

  // Helper function to get the ID of the favorite record itself, which is needed for deletion
  const getFavoriteRecordId = (plantId) => {
    // .find() returns the first matching favorite object
    const favoriteRecord = favoritePlant.find(
      (fav) => fav.plant_id === plantId
    );
    // Return the id of that record, or null if it doesn't exist
    return favoriteRecord ? favoriteRecord.id : null;
  };

  // Filter out plants that do not have a valid image_url
  const renderablePlants = plantCatalog.filter(
    (plant) => plant.image_url && plant.image_url.trim() !== ""
  );

  //Filter plants based on search term
  const filteredPlants = renderablePlants.filter((plant) =>
    plant.plant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAdminClick = () => {
    if (user && user.is_admin) {
      // Check if user exists and is an admin
      navigate("/Admin"); // Navigate to the /admin route
    } else {
      console.warn("User is not an admin or not logged in.");
      // Optionally, you could show a toast notification here
      // toast.warn("You must be an admin to access this page.");
    }
  };

  return (
    <div className="plants-container">
      <h1>Creating Your Dream Garden</h1>
      <p>Select A Plant!</p>
      <br />
      {/* Search Bar */}
      <SearchBar className="search-bar"></SearchBar>
      <br />
      {/* Admin Button - only show if user is logged in AND is an admin */}
      {user &&
        user.is_admin && ( // <--- MODIFIED CONDITIONAL RENDERING HERE
          <button onClick={handleAdminClick} className="admin-button">
            Create Plant{" "}
            {/* Button text indicates navigation to admin dashboard */}
          </button>
        )}
      <div className="plants-grid">
        {loadingPlants ? (
          <p>Loading plants...</p>
        ) : renderablePlants.length > 0 ? (
          renderablePlants.map((plant) => (
            <div key={plant.id} className="plantContainer">
              <h3>{plant.plant_name || "Unnamed Plant"}</h3>
              <hr />
              <img
                src={plant.image_url} // Cloudinary image URL
                alt={plant.plant_name}
                className="plant-image"
                onClick={() => setSelectedPlant(plant)}
              />
            </div>
          ))
        ) : (
          <p>No plants found.</p>
        )}
      </div>{" "}
      {/* Modal for plant details */}
      {selectedPlant && (
        <div className="modal" onClick={() => setSelectedPlant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedPlant.plant_name}</h2>
            <img
              src={selectedPlant.image_url}
              alt={selectedPlant.plant_name}
              className="modal-image"
            />
            {selectedPlant.sun_requirements && (
              <p>{selectedPlant.sun_requirements}</p>
            )}
            {selectedPlant.is_toxic ? (
              <p style={{ fontStyle: "italic" }}>toxic</p>
            ) : (
              <p>non-toxic</p>
            )}

            <p>
              <Link to={`/plants/${selectedPlant.id}`}>more details...</Link>
            </p>
            {/* Show buttons only if a user is logged in */}
            {user ? (
              // Check if the plant is favorited
              checkIfPlantIsFavorited(selectedPlant.id) ? (
                // If YES, show the "Unfavorite" button
                <button
                  onClick={() => {
                    // Find the favorite record ID to pass to the unfavorite function
                    const favoriteId = getFavoriteRecordId(selectedPlant.id);
                    if (favoriteId) {
                      unfavoritePlant(favoriteId);
                    }
                  }}
                  className="favorited-button"
                >
                  Favorited! (Remove)
                </button>
              ) : (
                // If NO, show the "Favorite" button
                <button onClick={() => addFavePlant(selectedPlant.id)}>
                  Favorite
                </button>
              )
            ) : null}
            {/* <button onClick={() => setSelectedPlant(null)}>Close</button> */}
          </div>
        </div>
      )}
    </div>
  );
}
