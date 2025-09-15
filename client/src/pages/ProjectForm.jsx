import { useContext, useState } from "react";
import axios from "axios";
import { ProjectContext } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProjectForm() {
  const [projectName, setProjectName] = useState("");
  // const [projectDescription, setProjectDescription] = useState(""); not currently linked to db, can be added later
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { fetchProjects } = useContext(ProjectContext);
  const { userId, getHeaders } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setSubmitting(true);
    setSubmitError(null); // Clear previous errors
    setSubmitSuccess(false); // Reset success state

    // Basic validation
    if (!projectName.trim()) {
      setSubmitError("Project name cannot be empty.");
      setSubmitting(false);
      return;
    }
    if (!userId) {
      setSubmitError("User not authenticated. Please log in.");
      setSubmitting(false);
      return;
    }

    try {
      const projectData = {
        project_name: projectName.trim(),
        user_id: userId, // Include the userId with the project data
      };

      const response = await axios.post(
        "/api/projects",
        projectData,
        getHeaders()
      );

      // console.log('New project created:', response.data); // For debugging
      setSubmitSuccess(true);
      // refresh the project list:
      if (fetchProjects) {
        fetchProjects();
      }

      navigate(`/myproject/${response.data.id}`);
    } catch (err) {
      console.error(
        "Error creating project:",
        err.response ? err.response.data : err.message
      );
      setSubmitError(
        err.response?.data?.error ||
          "Failed to create project. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create New Project</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Project"}
          </button>
        </div>

        {submitSuccess && <p>Project created successfully!</p>}

        {submitError && <p>{submitError}</p>}
      </form>
    </div>
  );
}
