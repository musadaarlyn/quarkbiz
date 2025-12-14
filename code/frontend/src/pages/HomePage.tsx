import { useCallback, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar"

import TechStackCategoriesSection from "../components/sections/TechStackCategoriesSection";
import TechStackSection from "../components/sections/TechStackSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import DashboardSection from "../components/sections/DashboardSection";

const HomePage = () => {

  const [categoriesVersion, setCategoriesVersion] = useState(0);
  const [stacksVersion, setStacksVersion] = useState(0);
  const [projectsVersion, setProjectsVersion] = useState(0);

  const triggerCategoriesRefresh = useCallback(
    () => setCategoriesVersion((v) => v + 1),
    []
  );
  const triggerStacksRefresh = useCallback(
    () => setStacksVersion((v) => v + 1),
    []
  );
  const triggerProjectsRefresh = useCallback(
    () => setProjectsVersion((v) => v + 1),
    []
  );

  const refreshFunctions = useMemo(
    () => ({
      categories: triggerCategoriesRefresh,
      stacks: triggerStacksRefresh,
      projects: triggerProjectsRefresh,
    }),
    [triggerCategoriesRefresh, triggerStacksRefresh, triggerProjectsRefresh]
  );

  return (
    <>
      <Navbar />

      <div>
        <TechStackCategoriesSection
          refreshKey={categoriesVersion}
          requestRefresh={refreshFunctions}
        />
        <TechStackSection
          categoryRefreshKey={categoriesVersion}
          requestRefresh={refreshFunctions}
        />
        <ProjectsSection
          stackRefreshKey={stacksVersion}
          requestRefresh={refreshFunctions}
        />
        <DashboardSection />
      </div>
    </>
  );
};

export default HomePage;
