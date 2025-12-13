import { SectionWrapper } from "../layout/SectionWrapper";
import Card from "../ui/Card";
import AddCard from "../ui/AddCard";
import { fetchTechStacks, createTechStack } from "../../services/techstack.service";
import { useState, useEffect } from "react";
import AddTechStackModal from "../modals/add/AddTechStackModal";

type Stack = {
  id: number;
  tsName: string;
  tsDescription?: string | null;
  categoryId: number;
};

const TechStackSection = () => {

 const [stacks, setTechStacks] = useState<Stack[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);
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

   const handleAddStack = async (name: string, description?: string, category?: number) => {
       try {
        if (category === undefined) {
          throw new Error("Category is required");
        }

         const created = await createTechStack({ tsName: name, tsDescription: description, categoryId:  category});
         setTechStacks((prev) => [...prev, created]);
         setModalOpen(false);
       } catch (err) {
         alert((err as Error).message);
       }
     };

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

          <AddCard   onClick={() => setModalOpen(true)}/>
        </div>
      )}

      <AddTechStackModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddStack}
      />
    </SectionWrapper>
  );
};


export default TechStackSection;
