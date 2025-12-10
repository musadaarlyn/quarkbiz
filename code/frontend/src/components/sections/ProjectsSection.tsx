import { SectionWrapper } from "../layout/SectionWrapper";
import Card from "../ui/Card";
import AddCard from "../ui/AddCard";

const sampleProjects = [
  { id: 1, name: "Portfolio Website" },
  { id: 2, name: "Inventory App" },
];


const ProjectsSection = () => {
  return (
    <SectionWrapper id="projects" title="Projects">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {sampleProjects.map((proj) => (
          <Card key={proj.id} title={proj.name} />
        ))}

        <AddCard onClick={() => console.log("Add Project clicked")} />
      </div>
    </SectionWrapper>
  );
};


export default ProjectsSection;
