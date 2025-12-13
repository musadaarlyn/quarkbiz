import { SectionWrapper } from "../layout/SectionWrapper";
import Card from "../ui/Card";
import AddCard from "../ui/AddCard";
import { fetchTechStacks } from "../../services/techstack.service";
import { useState, useEffect } from "react";

const sampleStacks = [
  { id: 1, name: "React" },
  { id: 2, name: "Node.js" },
  { id: 3, name: "Docker" },
];

type Stack = {
  id: number;
  tsName: string;
  tsDescription?: string | null;
  categoryId: number;
};

const TechStackSection = () => {

 const [stacks, setTechStacks] = useState<Stack[]>([]);

 const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
     const load = async () => {
       try {
         setLoading(true);
         setTechStacks(await fetchTechStacks());
         setError(null);
       } catch (err) {
         setError((err as Error).message);
       } finally {
         setLoading(false);
       }
     };
     load();
   }, []);

  // RETURN -----------------------------------------
  return (
    <SectionWrapper id="techstack" title="Tech Stack">
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading categories…</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stacks.map((cat) => (
            <Card 
            key={cat.id} 
            title={cat.tsName} 
            onClick={() => {
              // setSelectedCategory(cat);
              // setViewOpen(true);
            }}
            />
          ))}

          <AddCard  />
          {/* onClick={() => setModalOpen(true)} */}
        </div>
      )}
    </SectionWrapper>
  );
};


export default TechStackSection;
