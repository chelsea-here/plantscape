import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Adjust path as needed
import { ProjectContext } from "../context/ProjectContext"; // Adjust path as needed
import { GardenBedContext } from "../context/GardenBedContext"; // Adjust path as needed

const MyGardenBeds = () => {
  const { user } = useContext(UserContext);
  const { currentEditingProject, loading: loadingProject } =
    useContext(ProjectContext); // Get the currently selected project
  const {
    gardenBeds,
    fetchGardenBedsForProject, // Function to re-fetch beds for the current project
    loadingGardenBeds, // Loading state for garden beds
  } = useContext(GardenBedContext);

  // Effect to fetch garden beds when the currentEditingProject changes
  useEffect(() => {
    // Only fetch if a project is selected and user is logged in
    if (currentEditingProject?.id && user?.id) {
      fetchGardenBedsForProject();
    }
  }, [currentEditingProject?.id, user?.id, fetchGardenBedsForProject]);

  if (!user.id) {
    return <div>Please log in to view garden beds.</div>;
  }

  if (loadingProject) {
    // Check if the project itself is still loading
    return <div>Loading project information...</div>;
  }

  if (!currentEditingProject) {
    return <div>Please select a project to view its garden beds.</div>;
  }

  return (
    <div>
      <h2>Garden Beds for Project: {currentEditingProject.project_name}</h2>
      <Link to="/newgardenbed">Create New Garden Bed</Link>

      {loadingGardenBeds ? (
        <div>Loading garden beds...</div>
      ) : gardenBeds.length === 0 ? (
        <p>No garden beds found for this project. Create one to get started!</p>
      ) : (
        <ul>
          {gardenBeds.map((bed) => (
            <li key={bed.id}>
              {/* Link to the detailed MyGardenBed component */}
              <Link to={`/mygardenbed/${bed.id}`}>
                {bed.layout_name} (Size: {bed.bedSize.bedLength}x
                {bed.bedSize.bedDepth})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyGardenBeds;
