import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ProjectContext } from "../context/ProjectContext";
import "./MyProfile.css";

export default function MyProfile() {
  const { user } = useContext(UserContext);
  const { projects, fetchProjects } = useContext(ProjectContext);

  return (
    <div className="myprofile-container">
      <h1>Welcome {user?.username}</h1>
      <h3>
        <Link to="/newproject">Start a New Project</Link>
      </h3>
      <h3>
        <Link to="/myprojects">View All My Projects</Link>
      </h3>
      <h2>My Projects (Overview)</h2> {/* Added (Overview) for clarity */}
      {/* Debug log */}
      {/*console.log('Projects data:', projects)*/}
      {projects.length === 0 ? (
        <p>You have no projects yet.</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="projectObjects">
            <h3>
              {/* CORRECTED LINK: Now links to the specific project's detail page */}
              <Link to={`/myproject/${project.id}`}>
                {project.project_name}
              </Link>
            </h3>
            {/* You can add more project summary details here if desired */}
            {/* <ul>
              <li>
                <Link to={`/myproject/${project.id}`}>View Details</Link>
              </li>
            </ul> */}
          </div>
        ))
      )}
    </div>
  );
}
