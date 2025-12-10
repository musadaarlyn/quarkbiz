import Navbar from "../components/layout/Navbar";

import TechStackCategoriesSection from "../components/sections/TechStackCategoriesSection";
import TechStackSection from "../components/sections/TechStackSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import DashboardSection from "../components/sections/DashboardSection";

const HomePage = () => {
  return (
    <>
      <Navbar />

      {/* Add padding top so the fixed navbar doesn't overlap */}
      <div className="pt-20">
        <TechStackCategoriesSection />
        <TechStackSection />
        <ProjectsSection />
        <DashboardSection />
      </div>
    </>
  );
};

export default HomePage;
