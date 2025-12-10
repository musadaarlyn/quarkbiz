import SectionCategories from "../components/categories/SectionCategories";
import SectionTechStacks from "../components/techstack/SectionTechStacks";
import SectionProjects from "../components/projects/SectionProjects";
import SectionDashboard from "../components/dashboard/SectionDashboard";

const HomePage = () => {
  return (
    <div className="space-y-20 p-6">
      <SectionCategories />
      <SectionTechStacks />
      <SectionProjects />
      <SectionDashboard />
    </div>
  );
};

export default HomePage;
