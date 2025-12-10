import Navbar from "../components/layout/Navbar"

import TechStackCategoriesSection from "../components/sections/TechStackCategoriesSection";
import TechStackSection from "../components/sections/TechStackSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import DashboardSection from "../components/sections/DashboardSection";

const HomePage = () => {
  return (
    <>
      <Navbar />

      <div>
        <TechStackCategoriesSection />
        <TechStackSection />
        <ProjectsSection />
        <DashboardSection />
      </div>
    </>
  );
};

export default HomePage;
