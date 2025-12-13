import { SectionWrapper } from "../layout/SectionWrapper";
import Card from "../ui/Card";
import AddCard from "../ui/AddCard";
import { useState, useEffect } from "react";
import AddProjectModal from "../modals/add/AddProjectModal";

import { 
  fetchProjects, 
  createProject 
} from "../../services/ProjectsService";

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

type TechStack = {
  id: number;
  tsName: string;
  tsDescription?: string | null;
  categoryId: number;
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isUpdateOpen, setUpdateOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectsData] = await Promise.all([
          fetchProjects()
        ]);
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getTechStackNames = (ids: number[]): string[] => {
    return ids.map(id => {
      const stack = techStacks.find(ts => ts.id === id);
      return stack?.tsName || `Unknown (ID: ${id})`;
    });
  };

  const handleAddProject = async (
    name: string, 
    description?: string, 
    techStackIds: number[] = [], 
    status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' = 'Planning',
    startDate?: string,
    endDate?: string
  ) => {
    try {
      const created = await createProject({ 
        projName: name, 
        projDescription: description, 
        techStackIds,
        status,
        startDate,
        endDate
      });
      setProjects(prev => [...prev, created]);
      setModalOpen(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // RETURN -----------------------------------------
  return (
    <SectionWrapper id="projects" title="Projects" className="mt-20">
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading projects…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              title={project.projName}
              onClick={() => {
                setSelectedProject(project);
                setViewOpen(true);
              }}
            />
          ))}

          <AddCard onClick={() => setModalOpen(true)} />
        </div>
      )}

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddProject}
      />

    </SectionWrapper>
  );
};

export default ProjectsSection;