import { SectionWrapper } from "../layout/SectionWrapper";
import Card from "../ui/Card";
import AddCard from "../ui/AddCard";

const sampleCategories = [
  { id: 1, name: "Frontend" },
  { id: 2, name: "Backend" },
  { id: 3, name: "DevOps" },
];

const TechStackCategoriesSection = () => {
  return (
    <SectionWrapper id="categories" title="Categories" className="mt-20">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {sampleCategories.map((cat) => (
          <Card key={cat.id} title={cat.name} />
        ))}

        <AddCard onClick={() => console.log("Add Category clicked")} />
      </div>
    </SectionWrapper>
  );
};

export default TechStackCategoriesSection;
