import { NavLink, Outlet } from "react-router-dom";

function ManageProjects() {
  return (
    <div className="projects-wrapper p-4 font-sans">
      <div className="flex flex-wrap gap-4 mb-6">
        <NavLink
          to="list-projects"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md border transition-colors font-medium ${
              isActive
                ? "bg-[#414547] text-white border-none"
                : "bg-transparent text-[#414547] border border-[#414547] hover:bg-gray-100"
            }`
          }
        >
          Projects List
        </NavLink>

        <NavLink
          to="create-project"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md border transition-colors font-medium ${
              isActive
                ? "bg-[#414547] text-white border-none"
                : "bg-transparent text-[#414547] border border-[#414547] hover:bg-gray-100"
            }`
          }
        >
          Create Project
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}

export default ManageProjects;