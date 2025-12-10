import { SectionWrapper } from "../layout/SectionWrapper";
import Card from "../ui/Card";
import AddCard from "../ui/AddCard";

const sampleStacks = [
  { id: 1, name: "React" },
  { id: 2, name: "Node.js" },
  { id: 3, name: "Docker" },
];

const TechStackSection = () => {
  return (
    <SectionWrapper id="techstack" title="Tech Stack">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {sampleStacks.map((stack) => (
          <Card key={stack.id} title={stack.name} />
        ))}

        <AddCard onClick={() => console.log("Add Tech Stack clicked")} />
      </div>
    </SectionWrapper>
  );
};


export default TechStackSection;
