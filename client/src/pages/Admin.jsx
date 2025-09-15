import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import "./Admin.css"; // Import the new CSS file for admin page

export default function Admin() {
  const { user, getHeaders } = useContext(UserContext); // Get getHeaders for authenticated requests
  const [plantsToManage, setPlantsToManage] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(true);
  const [errorAdminData, setErrorAdminData] = useState(null);

  // State for the new plant form
  const [newPlantData, setNewPlantData] = useState({
    plant_name: "",
    other_common_names: "",
    technical_name: "",
    growth_form: "",
    is_toxic: false,
    sun_requirements: "",
    height_min_ft: "",
    height_max_ft: "",
    width_min_ft: "",
    width_max_ft: "",
    seasonal_interest: "",
    primary_color: "",
    accent_color: "",
    image_url: "",
  });

  // Function to fetch all plants for admin management
  const fetchAdminPlants = async () => {
    if (!user || !user.is_admin) {
      setErrorAdminData("Unauthorized: Not an admin.");
      setLoadingAdminData(false);
      return;
    }
    try {
      // Assuming you have an API endpoint like /api/plants for all plants
      // and that it's protected by isAdmin middleware on the backend
      const response = await axios.get("/api/plants", getHeaders()); // Use getHeaders
      setPlantsToManage(response.data);
      console.log("Admin: Fetched plants for management:", response.data);
    } catch (err) {
      console.error("Admin: Failed to fetch plants for management:", err);
      setErrorAdminData("Failed to load admin data.");
    } finally {
      setLoadingAdminData(false);
    }
  };

  useEffect(() => {
    fetchAdminPlants();
  }, [user]); // Re-run if user changes

  // Handle input changes for the new plant form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPlantData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission for creating a new plant
  const handleCreatePlant = async (e) => {
    e.preventDefault();
    setErrorAdminData(null); // Clear previous errors
    try {
      // Ensure numeric fields are converted to numbers
      const payload = {
        ...newPlantData,
        height_min_ft: newPlantData.height_min_ft ? parseFloat(newPlantData.height_min_ft) : null,
        height_max_ft: newPlantData.height_max_ft ? parseFloat(newPlantData.height_max_ft) : null,
        width_min_ft: newPlantData.width_min_ft ? parseFloat(newPlantData.width_min_ft) : null,
        width_max_ft: newPlantData.width_max_ft ? parseFloat(newPlantData.width_max_ft) : null,
      };

      const response = await axios.post("/api/plants", payload, getHeaders()); // Use getHeaders
      console.log("Admin: Plant created successfully:", response.data);
      toast.success("Plant created successfully!");
      // Add the new plant to the list and clear the form
      setPlantsToManage((prev) => [...prev, response.data]);
      setNewPlantData({ // Reset form fields
        plant_name: "",
        other_common_names: "",
        technical_name: "",
        growth_form: "",
        is_toxic: false,
        sun_requirements: "",
        height_min_ft: "",
        height_max_ft: "",
        width_min_ft: "",
        width_max_ft: "",
        seasonal_interest: "",
        primary_color: "",
        accent_color: "",
        image_url: "",
      });
    } catch (err) {
      console.error("Admin: Failed to create plant:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to create plant.";
      setErrorAdminData(errorMessage);
      toast.error(`Error creating plant: ${errorMessage}`);
    }
  };

  if (loadingAdminData) {
    return (
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p>Loading admin data...</p>
      </div>
    );
  }

  // If user is not an admin, show an unauthorized message
  if (!user || !user.is_admin) {
    return (
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p className="error-message">Access Denied. You must be an administrator to view this page.</p>
        <Link to="/login" className="admin-link">Login as Admin</Link>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.username} (Admin)!</p>

      {errorAdminData && <p className="error-message">{errorAdminData}</p>}

      <h2>Create New Plant</h2>
      <form onSubmit={handleCreatePlant} className="create-plant-form">
        <label>
          Plant Name:
          <input
            type="text"
            name="plant_name"
            value={newPlantData.plant_name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Other Common Names:
          <input
            type="text"
            name="other_common_names"
            value={newPlantData.other_common_names}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Technical Name:
          <input
            type="text"
            name="technical_name"
            value={newPlantData.technical_name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Growth Form:
          <input
            type="text"
            name="growth_form"
            value={newPlantData.growth_form}
            onChange={handleInputChange}
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="is_toxic"
            checked={newPlantData.is_toxic}
            onChange={handleInputChange}
          />
          Is Toxic?
        </label>
        <label>
          Sun Requirements:
          <input
            type="text"
            name="sun_requirements"
            value={newPlantData.sun_requirements}
            onChange={handleInputChange}
          />
        </label>
        <div className="numeric-inputs">
          <label>
            Min Height (ft):
            <input
              type="number"
              name="height_min_ft"
              value={newPlantData.height_min_ft}
              onChange={handleInputChange}
              step="0.01"
            />
          </label>
          <label>
            Max Height (ft):
            <input
              type="number"
              name="height_max_ft"
              value={newPlantData.height_max_ft}
              onChange={handleInputChange}
              step="0.01"
            />
          </label>
          <label>
            Min Width (ft):
            <input
              type="number"
              name="width_min_ft"
              value={newPlantData.width_min_ft}
              onChange={handleInputChange}
              step="0.01"
            />
          </label>
          <label>
            Max Width (ft):
            <input
              type="number"
              name="width_max_ft"
              value={newPlantData.width_max_ft}
              onChange={handleInputChange}
              step="0.01"
            />
          </label>
        </div>
        <label>
          Seasonal Interest:
          <input
            type="text"
            name="seasonal_interest"
            value={newPlantData.seasonal_interest}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Primary Color:
          <input
            type="text"
            name="primary_color"
            value={newPlantData.primary_color}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Accent Color:
          <input
            type="text"
            name="accent_color"
            value={newPlantData.accent_color}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            name="image_url"
            value={newPlantData.image_url}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Create Plant</button>
      </form>

      <hr className="divider" />

      <h2>Existing Plants</h2>
      {plantsToManage.length > 0 ? (
        <ul className="plant-list">
          {plantsToManage.map((plant) => (
            <li key={plant.id} className="plant-item">
              {plant.plant_name} (ID: {plant.id})
            </li>
          ))}
        </ul>
      ) : (
        <p>No plants to display or manage.</p>
      )}
      <ToastContainer />
    </div>
  );
}
