import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Adjust path as needed
import { ProjectContext } from "../context/ProjectContext"; // Adjust path as needed
import "./MyProjects.css";

const MyProjects = () => {
  const { user } = useContext(UserContext);
  const {
    projects,
    fetchProjects, // Function to re-fetch all projects
    activeProjectId, // Get activeProjectId
    setActiveProjectId, // Get setActiveProjectId
    loadingProjects,
  } = useContext(ProjectContext);

  // Although ProjectContext's useEffect already calls fetchProjects on user.id change,
  // this useEffect ensures that if a user directly navigates to /myprojects,
  // the data is fresh or fetched if not already.
  useEffect(() => {
    if (user?.id && projects.length === 0) {
      // Only fetch if user is logged in and projects are empty
      fetchProjects();
    }
  }, [user?.id, fetchProjects, projects.length]); // Add projects.length to re-evaluate if projects become empty

  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id); // Set the first project as active
    }
  }, [projects, activeProjectId, setActiveProjectId]); // Dependencies: projects array, current activeProjectId, and its setter

  if (!user.id) {
    return <div>Please log in to view your projects.</div>;
  }
  if (loadingProjects) {
    return <div>Loading your projects...</div>;
  }

  return (
    <div className="container">
      <h2>My Projects</h2>
      <Link to="/newproject">Create New Project</Link>

      {projects.length === 0 ? (
        <p>You don't have any projects yet. Create one to get started!</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              {/* Link to the detailed MyProject component */}
              <Link to={`/myproject/${project.id}`}>
                {project.project_name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProjects;
