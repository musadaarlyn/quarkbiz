import { NavLink, Outlet } from "react-router-dom";
import "../../../styles/projects/ManageProjects.css";

function ManageProjects() {
  return (
    <div className="manage-projects">
      <div className="manage-projects-nav">
        <NavLink
          to="list-projects"
          className={({ isActive }) =>
            [
              "manage-projects-link",
              isActive
                ? "manage-projects-link--active"
                : "manage-projects-link--inactive",
            ].join(" ")
          }
        >
          Projects List
        </NavLink>

        <NavLink
          to="create-project"
          className={({ isActive }) =>
            [
              "manage-projects-link",
              isActive
                ? "manage-projects-link--active"
                : "manage-projects-link--inactive",
            ].join(" ")
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