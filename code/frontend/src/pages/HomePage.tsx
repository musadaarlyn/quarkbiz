import TechStackCategoriesSection from "../components/sections/TechStackCategoriesSection";
import TechStackSection from "../components/sections/TechStackSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import DashboardSection from "../components/sections/DashboardSection";

const HomePage = () => {
  return (
    <div className="flex flex-col space-y-20 px-6 py-10">
      
      {/* 1. Tech Stack Categories */}
      <section id="categories">
        <TechStackCategoriesSection />
      </section>

      {/* 2. Tech Stack */}
      <section id="techstack">
        <TechStackSection />
      </section>

      {/* 3. Projects */}
      <section id="projects">
        <ProjectsSection />
      </section>

      {/* 4. Dashboard (empty for now) */}
      <section id="dashboard">
        <DashboardSection />
      </section>

    </div>
  );
};

export default HomePage;
