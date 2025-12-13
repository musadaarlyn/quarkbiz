import { SectionWrapper } from "../layout/SectionWrapper";
import Card from "../ui/Card";
import AddCard from "../ui/AddCard";
import { fetchTechStacks, createTechStack, updateTechStack, deleteTechStack } from "../../services/TechStackService";
import { fetchCategoryById } from "../../services/CategoriesService";
import { useState, useEffect } from "react";
import AddTechStackModal from "../modals/add/AddTechStackModal";
import ViewTechStackModal from "../modals/view/ViewTechStackModal";
import UpdateTechStackModal from "../modals/update/UpdateTechStackModal";

type Stack = {
  id: number;
  tsName: string;
  tsDescription?: string | null;
  categoryId: number;
};

type Category = {
  id: number;
  tscName: string;
};

const TechStackSection = () => {

 const [stacks, setTechStacks] = useState<Stack[]>([]);

 const [isModalOpen, setModalOpen] = useState(false);
 const [isLoading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const [isViewOpen, setViewOpen] = useState(false);
 const [selectedStack, setSelectedStack] = useState<Stack | null>(null);

 const [isUpdateOpen, setUpdateOpen] = useState(false);

 const[category, setCategory] = useState<Category| null>(null);


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

   const getCategoryName = async (category?: number)  => {
      try {
        if (category === undefined) {
          throw new Error("Category is required");
        }
          setCategory(await fetchCategoryById(category));
       } catch (err) {
         alert((err as Error).message);
       }
   }

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

    const handleUpdateTechStack = async (id: number, name: string, description?: string, category?: number) => {        
      try {
        if (category === undefined) {
          throw new Error("Category is required");
        }

        const updated = await updateTechStack(id, { tsName: name, tsDescription: description, categoryId: category });
        setTechStacks((prev) => prev.map((c) => (c.id === id ? updated : c)));
        setUpdateOpen(false);
        setViewOpen(false);
        } catch (err) {
          alert((err as Error).message);
        }
      };
    
      const handleDeleteTechStack = async (stack: Stack) => {
        const confirmed = window.confirm(
          `Delete “${stack.tsName}”? This cannot be undone.`
        );
        if (!confirmed) return;
    
        try {
          await deleteTechStack(stack.id);
          setTechStacks((prev) => prev.filter((c) => c.id !== stack.id));
          setViewOpen(false);
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
          {stacks.map((stack) => (
            <Card 
            key={stack.id} 
            title={stack.tsName} 
            onClick={() => {
              setSelectedStack(stack);
              getCategoryName(stack.categoryId);
              setViewOpen(true);
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

      <ViewTechStackModal
        isOpen={isViewOpen}
        stack={selectedStack}
        onClose={() => setViewOpen(false)}
        onEdit={(cat) => { setSelectedStack(cat); setUpdateOpen(true); }}
        onDelete={handleDeleteTechStack}
        category={category}
      />

      <UpdateTechStackModal
        isOpen={isUpdateOpen}
        stack={selectedStack}
        onClose={() => setUpdateOpen(false)}
        onSubmit={handleUpdateTechStack}
      />
    </SectionWrapper>
  );
};


export default TechStackSection;
