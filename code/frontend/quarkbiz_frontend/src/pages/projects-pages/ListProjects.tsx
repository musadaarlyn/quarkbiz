import { useEffect, useState, useContext, useRef } from "react";
import { fetchProjects } from "../../services/ProjectsService";
import { SearchContext } from "../../App";
import ViewProjectCard from "./ViewProjectCard";

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
    <div className="p-4 font-sans flex flex-col md:flex-row ">
      <div className="md:w-1/3">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>

        <ul className="space-y-3">
          {filteredProjects.map((project, index) => (
            <li
              key={project.id}
              className="flex items-center space-x-4"
            >
              {/* Number */}
              <span className="font-semibold text-gray-700 w-6 text-right">{index + 1}.</span>

              {/* Card */}
              <div 
                onClick={() => handleProjectClick(project)}
                className= {
                  `flex-1 px-4 py-3 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow
                   ${selectedProject?.id === project.id ? 'ring-2 ring-[#05b7f5] bg-blue-50' : ''}
                  `}>
                {project.projName}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ViewProjectCard project={selectedProject}/>
    </div>
  );
}

export default ListProjects;
