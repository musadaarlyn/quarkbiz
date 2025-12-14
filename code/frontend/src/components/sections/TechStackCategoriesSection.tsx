import { SectionWrapper } from "../layout/SectionWrapper";
import Card from "../ui/Card";
import AddCard from "../ui/AddCard";
import AddCategoryModal from "../modals/add/AddCategoryModal";
import { useEffect, useState } from "react";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../services/CategoriesService";
import ViewCategoryModal from "../modals/view/ViewCategoryModal";
import UpdateCategoryModal from "../modals/update/UpdateCategoryModal";

type Category = {
  id: number;
  tscName: string;
  tscDescription?: string | null;
};

type RefreshActions = {
  categories: () => void;
  stacks: () => void;
  projects: () => void;
};

interface Props {
  refreshKey: number;
  requestRefresh: RefreshActions;
}

const TechStackCategoriesSection: React.FC<Props> = ({ refreshKey, requestRefresh }) => {


  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewOpen, setViewOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [isUpdateOpen, setUpdateOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setCategories(await fetchCategories());
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey]);

  const triggerAllSections = () => {
    requestRefresh.categories();
    requestRefresh.stacks();
    requestRefresh.projects();
  };

  const handleAddCategory = async (name: string, description?: string) => {
    try {
      const created = await createCategory({ tscName: name, tscDescription: description });
      setCategories((prev) => [...prev, created]);
      setModalOpen(false);
      triggerAllSections();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleUpdateCategory = async (id: number, name: string, description?: string) => {
    try{
      const updated = await updateCategory(id, { tscName: name, tscDescription: description });
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setUpdateOpen(false);
      setViewOpen(false);
      triggerAllSections();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    const confirmed = window.confirm(
      `Delete “${cat.tscName}”? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setViewOpen(false);
      triggerAllSections();
    } catch (err) {
      alert((err as Error).message);
    }
  };
  
  // RETURN -----------------------------------------
  return (
    <SectionWrapper id="categories" title="Categories" className="mt-20">
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading categories…</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <Card 
            key={cat.id} 
            title={cat.tscName} 
            onClick={() => {
              setSelectedCategory(cat);
              setViewOpen(true);
            }}
            />
          ))}

          <AddCard onClick={() => setModalOpen(true)} />
        </div>
      )}

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddCategory}
      />

     <ViewCategoryModal
        isOpen={isViewOpen}
        category={selectedCategory}
        onClose={() => setViewOpen(false)}
        onEdit={(cat) => { setSelectedCategory(cat); setUpdateOpen(true); }}
        onDelete={handleDeleteCategory}
      />

      <UpdateCategoryModal
        isOpen={isUpdateOpen}
        category={selectedCategory}
        onClose={() => setUpdateOpen(false)}
        onSubmit={handleUpdateCategory}
      />
    </SectionWrapper>
  );
};

export default TechStackCategoriesSection;
