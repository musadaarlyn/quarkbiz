import { SectionWrapper } from "../layout/SectionWrapper";
import Card from "../ui/Card";
import AddCard from "../ui/AddCard";
import { fetchProjects, createProject, updateProject, deleteProject } from "../../services/ProjectsService";
import { fetchTechStacks } from "../../services/TechStackService";
import { useState, useEffect } from "react";
import AddProjectModal from "../modals/add/AddProjectModal";
import ViewProjectModal from "../modals/view/ViewProjectModal";
import UpdateProjectModal from "../modals/update/UpdateProjectModal";

type RefreshActions = {
  categories: () => void;
  stacks: () => void;
  projects: () => void;
};

interface Props {
  requestRefresh: RefreshActions;
  stackRefreshKey: number;
}

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
};

const ProjectsSection: React.FC<Props> = ({ requestRefresh, stackRefreshKey }) => {

  const [projects, setProjects] = useState<Project[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewOpen, setViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isUpdateOpen, setUpdateOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [projectsData, stacksData] = await Promise.all([
          fetchProjects(),
          fetchTechStacks()
        ]);
        setProjects(projectsData);
        setTechStacks(stacksData);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const triggerAllSections = () => {
    requestRefresh.categories();
    requestRefresh.stacks();
    requestRefresh.projects();
  };

  const getTechStackNames = (ids: number[]): string[] => {
    if (!ids || ids.length === 0) return [];
    return ids.map(id => {
      const stack = techStacks.find(ts => ts.id === id);
      return stack?.tsName || `Unknown (ID: ${id})`;
    });
  };

  const handleAddProject = async (
    name: string, 
    description?: string, 
    techStackIds?: number[], 
    status?: 'Planning' | 'In Progress' | 'Completed' | 'On Hold',
    startDate?: string,
    endDate?: string
  ) => {
    try {
      if (!techStackIds || techStackIds.length === 0) {
        throw new Error("At least one tech stack is required");
      }
      if (!status) {
        throw new Error("Status is required");
      }

      const created = await createProject({ 
        projName: name, 
        projDescription: description, 
        techStackIds,
        status,
        startDate,
        endDate
      });
      setProjects((prev) => [...prev, created]);
      setModalOpen(false);
      triggerAllSections();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleUpdateProject = async (
    id: number, 
    name: string, 
    description?: string, 
    techStackIds?: number[], 
    status?: 'Planning' | 'In Progress' | 'Completed' | 'On Hold',
    startDate?: string,
    endDate?: string
  ) => {
    try {
      if (!techStackIds || techStackIds.length === 0) {
        throw new Error("At least one tech stack is required");
      }
      if (!status) {
        throw new Error("Status is required");
      }

      const updated = await updateProject(id, { 
        projName: name, 
        projDescription: description, 
        techStackIds,
        status,
        startDate,
        endDate
      });
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setUpdateOpen(false);
      setViewOpen(false);
      triggerAllSections();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm(
      `Delete project "${project.projName}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setViewOpen(false);
      triggerAllSections();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // RETURN -----------------------------------------
  return (
    <SectionWrapper id="projects" title="Projects">
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading projects…</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
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
        stackRefreshKey={stackRefreshKey}
      />

      <ViewProjectModal
        isOpen={isViewOpen}
        project={selectedProject}
        onClose={() => setViewOpen(false)}
        onEdit={(project) => { 
          setSelectedProject(project); 
          setUpdateOpen(true); 
        }}
        onDelete={handleDeleteProject}
        getTechStackNames={getTechStackNames}
      />

      <UpdateProjectModal
        isOpen={isUpdateOpen}
        project={selectedProject}
        onClose={() => setUpdateOpen(false)}
        onSubmit={handleUpdateProject}
        stackRefreshKey={stackRefreshKey}
      />
    </SectionWrapper>
  );
};

export default ProjectsSection;