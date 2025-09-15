import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]); // State for all projects for the user (list view)
  const [activeProjectId, setActiveProjectId] = useState(null); // ID of the currently selected project (e.g., in a list)
  const [currentEditingProject, setCurrentEditingProject] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true); // State for the detailed project being edited/viewed

  const { user, getHeaders } = useContext(UserContext);

  // --- Function to fetch ALL projects for the current user ---
  // Memoize fetchProjects with useCallback to avoid an infinite loop of re-renders

  // --- Function to fetch ALL projects for the current user ---
  const fetchProjects = useCallback(async () => {
    if (!user?.id || !getHeaders().headers?.authorization) {
      setProjects([]);
      setActiveProjectId(null);
      setCurrentEditingProject(null);
      setLoadingProjects(false); // Ensure loading is false if not fetching
      return;
    }

    setLoadingProjects(true); // Set loading to true before fetching
    try {
      const response = await axios.get(
        // Capture full response to check status
        `/api/projects/MyProjects`,
        getHeaders() // Call getHeaders directly
      );

      // Only update projects state if new data is actually received (status 200)
      if (response.status === 200) {
        setProjects(response.data);
      } else if (response.status === 304) {
        // If 304, the projects state should already contain the correct data from a previous 200 fetch.
        // No need to call setProjects, as response.data would be empty.
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err); // Keep error logs
      setProjects([]); // Ensure projects is an empty array on error
      setActiveProjectId(null);
      setCurrentEditingProject(null);
    } finally {
      setLoadingProjects(false); // Always set loading to false after fetch attempt
    }
  }, [user?.id, getHeaders]); // Dependencies for useCallback
  const fetchProject = useCallback(
    async (projectId) => {
      if (!projectId || !getHeaders().headers?.authorization) {
        setCurrentEditingProject(null);
        return;
      }
      try {
        // This calls the backend route GET /api/projects/:projectId
        const { data } = await axios.get(
          `/api/projects/${projectId}`,
          getHeaders()
        );
        setCurrentEditingProject(data); // Set the fetched project as the current editing project
        console.log("Fetched single project:", data);
        return data; // Return the fetched project data
      } catch (error) {
        console.error(
          `Failed to fetch single project with ID ${projectId}:`,
          error
        );
        setCurrentEditingProject(null); // Clear on error
        throw error; // Re-throw for component to handle
      }
    },
    [getHeaders]
  ); // Dependencies for fetchProject useCallback to update;

  // useEffect to call fetchProjects whenever user.id or getHeaders changes
  // This ensures projects are re-fetched when a user logs in/out or their state changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Helper to add a new project (makes API call)
  const addProject = useCallback(
    async (projectData) => {
      try {
        // The backend now attaches req.user.id, so sending user_id from frontend is redundant but harmless.
        // Keeping it for now, but backend's req.user.id is the source of truth for security.
        const { data: newProject } = await axios.post(
          "/api/projects",
          projectData,
          getHeaders()
        );
        setProjects((prev) => [...prev, newProject]); // Add to the list of projects
        setActiveProjectId(newProject.id); // Set the newly created project as active
        console.log("Project added successfully:", newProject);
        return newProject;
      } catch (error) {
        console.error("Failed to add project:", error);
        throw error;
      }
    },
    [user?.id, getHeaders]
  );

  // Derived state: activeProject is found from the list of all projects
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects, // Expose setProjects if components need to directly modify the list
        activeProjectId,
        setActiveProjectId,
        activeProject,
        currentEditingProject, // The detailed project object fetched by fetchProject
        fetchProject, // New function to fetch a single project by ID
        addProject,
        fetchProjects, // Function to re-fetch all projects for the user
        loadingProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
