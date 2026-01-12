import { useEffect, useState, useContext } from "react";
import { fetchProjects } from "../../services/projects/ProjectsService";
import { SearchContext } from "./Projects";
import ViewProjectCard from "./ViewProjectCard";
import "../../styles/projects/ListProjects.css";

type Project = {
  id: number;
  projName: string;
  projDescription?: string | null;
  techStackIds: number[];
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

function ListProjects() {

  // states
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // context values
  const searchValue = useContext(SearchContext); // receives normalized search value

  // use memo to filter projects without unnecessary recalculation
  const filteredProjects = projects.filter(project =>
      project.projName.toLowerCase().includes(searchValue.trim())
  );

  // load projects from database
  const loadProjects = async () => {
    const projectsData = await fetchProjects();
    setProjects(projectsData);
  };

  // use effects
  useEffect(() => {
    loadProjects();
  }, []);

  // Handle project click
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  // RETURN ------------------------------------------
  return (
    <div className="list-projects">
      <div className="list-projects-sidebar">
        <h2 className="list-projects-title">Projects</h2>

        <ul className="list-projects-list">
          {filteredProjects.map((project, index) => (
            <li key={project.id} className="list-projects-item">
              {/* Number */}
              <span className="list-projects-number">{index + 1}.</span>

              {/* Card */}
              <div
                onClick={() => handleProjectClick(project)}
                className={`list-projects-card ${
                  selectedProject?.id === project.id
                    ? "list-projects-card--selected"
                    : ""
                }`}
              >
                {project.projName}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ViewProjectCard project={selectedProject} />
    </div>
  );
}

export default ListProjects;
