import { useEffect, useState } from "react";
import { fetchProjects } from "../../services/ProjectsService";

type Project = {
  id: number,
  projName: string
};

function ListProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = async () => {
    const projectsData = await fetchProjects();
    setProjects(projectsData);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="p-4 font-sans">
      <h2 className="text-2xl font-bold mb-6">Projects</h2>

      <ul className="space-y-3">
        {projects.map((project, index) => (
          <li
            key={project.id}
            className="flex items-center space-x-4"
          >
            {/* Number */}
            <span className="font-semibold text-gray-700 w-6 text-right">{index + 1}.</span>

            {/* Card */}
            <div className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow">
              {project.projName}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListProjects;
