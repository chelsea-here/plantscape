import { useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import useParams to get ID from URL
import { UserContext } from "../context/UserContext"; // Adjust path if your contexts are in a different folder
import { ProjectContext } from "../context/ProjectContext"; // Adjust path
import { GardenBedContext } from "../context/GardenBedContext"; // Keep if needed for garden beds
import "./MyProject.css";
const MyProject = () => {
  // Destructure necessary values from contexts
  const { user } = useContext(UserContext);
  const {
    currentEditingProject, // The detailed project object fetched by fetchProject
    fetchProject, // Function to fetch a single project by ID
    activeProjectId, // The ID of the project selected from a list (optional, but useful)
    setActiveProjectId, // Function to set the active project ID (optional)
  } = useContext(ProjectContext);

  const {
    gardenBeds, // List of garden beds for the current project
    fetchGardenBedsForProject, // Function to fetch beds for the current project
    loadingGardenBeds, // Loading state for garden beds
  } = useContext(GardenBedContext);

  // Get the project ID from the URL parameters
  const { projectId } = useParams();

  useEffect(() => {
    // Determine which project ID to fetch: URL param has priority, then activeProjectId
    const idToFetch = projectId || activeProjectId;

    if (idToFetch && user?.id) {
      // Ensure we have an ID and a logged-in user
      // 1. Fetch the detailed project
      fetchProject(idToFetch);
      // 2. Update activeProjectId if URL param is different (optional, for consistency)
      if (projectId && projectId !== activeProjectId) {
        setActiveProjectId(projectId);
      }
    } else if (!idToFetch) {
      console.warn(
        "MyProject: No project ID provided in URL or activeProjectId."
      );
      // Optionally redirect or show a message if no project ID is available
    }
  }, [projectId, activeProjectId, user?.id, fetchProject, setActiveProjectId]);

  // Effect to fetch garden beds once the currentEditingProject is loaded
  useEffect(() => {
    // Only fetch garden beds if currentEditingProject is available
    if (currentEditingProject?.id) {
      fetchGardenBedsForProject();
    }
  }, [currentEditingProject?.id, fetchGardenBedsForProject]); // Dependency on currentEditingProject.id and the fetch function

  // --- Render Logic ---
  if (!user.id) {
    return (
      <div className="container message-box">
        <p>Please log in to view your projects.</p>
      </div>
    );
  }

  if (!currentEditingProject) {
    // You might want a loading spinner here
    return (
      <div className="container message-box">Loading project details...</div>
    );
  }

  return (
    <div className="container">
      <h2>My Project: {currentEditingProject.project_name}</h2>
      <p>Project ID: {currentEditingProject.id}</p>
      <p>Owner: {user.username}</p>
      {currentEditingProject.description && (
        <p>Description: {currentEditingProject.description}</p>
      )}

      <h3>Garden Beds:</h3>
      {loadingGardenBeds ? (
        <div className="message-box">Loading garden beds...</div>
      ) : gardenBeds.length === 0 ? (
        <div className="message-box">
          No garden beds found for this project.
        </div>
      ) : (
        <ul>
          {gardenBeds.map((bed) => (
            <li key={bed.id}>
              <Link to={`/mygardenbed/${bed.id}`}>
                {bed.layout_name} (Size: {bed.bedSize.bedLength}x
                {bed.bedSize.bedDepth})
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="action-buttons">
        <Link to="/newgardenbed">Add New Garden Bed</Link>
        {/*
        The link below is an example for navigating to a specific garden bed.
        The exact path and how you pass the ID depends on your routing setup.
        <Link to={`/mygardenbed/${currentEditingGardenBed.id}`}>View Garden Bed</Link>
      */}

        <button
          onClick={() => console.log("Implement edit project functionality")}
        >
          Edit Project
        </button>
        {/* ... other actions like delete project */}
      </div>
    </div>
  );
};

export default MyProject;
