import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function Projects() {
  const [activeButton, setActiveButton] = useState<"list" | "create">();

  return (
    <div className="projects-wrapper p-4 font-sans">
      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          to="list-projects"
          onClick={() => setActiveButton("list")}
          className={`px-4 py-2 rounded-md border transition-colors font-medium ${
            activeButton === "list"
              ? "bg-[#414547] text-white border-none"
              : "bg-transparent text-[#414547] border border-[#414547] hover:bg-gray-100"
          }`}
        >
          Projects List
        </Link>

        <Link
          to="create-project"
          onClick={() => setActiveButton("create")}
          className={`px-4 py-2 rounded-md border transition-colors font-medium ${
            activeButton === "create"
              ? "bg-[#414547] text-white border-none"
              : "bg-transparent text-[#414547] border border-[#414547] hover:bg-gray-100"
          }`}
        >
          Create Project
        </Link>
      </div>

      <Outlet />
    </div>
  );
}

export default Projects;
