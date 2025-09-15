import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlantCatalog } from "../context/PlantCatalogContext";
import "./PlantDetails.css";

const PlantDetails = () => {
  const { id } = useParams();
  const { plant, loadingSinglePlant, errorSinglePlant, fetchPlantById } =
    usePlantCatalog();

  // --- DEBUGGING LOGS START ---
  console.log("PlantDetails: Component rendered.");
  console.log("PlantDetails: ID from URL params:", id);
  console.log("PlantDetails: Current plant state:", plant);
  console.log("PlantDetails: loadingSinglePlant:", loadingSinglePlant);
  console.log("PlantDetails: errorSinglePlant:", errorSinglePlant);
  // --- DEBUGGING LOGS END ---

  useEffect(() => {
    if (id) {
      fetchPlantById(id);
      console.log(fetchPlantById(id));
    }
  }, [id, fetchPlantById]); // Dependencies: re-run if 'id' or 'fetchPlantById' changes

  if (loadingSinglePlant) {
    return <p>Loading plant details...</p>;
  }

  if (errorSinglePlant) {
    return <p>Error: {errorSinglePlant.message}</p>;
  }

  if (!plant) {
    return <p>No plant selected or found.</p>;
  }

  return (
    <div className="container">
      {plant.image_url && (
        <img
          src={plant.image_url}
          alt={plant.plant_name}
          style={{ maxWidth: "300px", height: "auto", borderRadius: "8px" }}
        />
      )}
      <h2>{plant.plant_name}</h2> <p>technical name: {plant.technical_name}</p>
      {plant.other_common_names && (
        <p>common names: {plant.other_common_names}</p>
      )}
      {plant.growth_form && <p>growth form: {plant.growth_form}</p>}
      {plant.width_min_ft && (
        <p>
          width: {plant.width_min_ft} - {plant.width_max_ft} ft
        </p>
      )}
      {plant.height_min_ft && (
        <p>
          height: {plant.height_min_ft} - {plant.height_max_ft} ft
        </p>
      )}
      {plant.sun_requirements && (
        <p>sun requirements: {plant.sun_requirements}</p>
      )}
      <p>
        toxicity:{" "}
        {plant.is_toxic ? (
          <span style={{ fontStyle: "italic" }}>
            this plant is considered toxic if consumed. Take caution with young
            kids and outdoor pets.
          </span>
        ) : (
          <span>not known to be toxic to humans or pets.</span>
        )}
      </p>
      {plant.seasonal_interest && (
        <p>seasonal interest: {plant.seasonal_interest}</p>
      )}
    </div>
  );
};

export default PlantDetails;
