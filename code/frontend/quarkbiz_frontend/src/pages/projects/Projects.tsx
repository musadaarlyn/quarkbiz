import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './project-views/Home'
import ManageProjects from './project-views/ManageProjects'
import ListProjects from './project-crud/ListProjects'
import CreateProject from './project-crud/CreateProject'
import { useState, createContext } from 'react'
import { useAuth } from '../../context/AuthContext'
import "../../styles/projects/Projects.css";

export const SearchContext = createContext("");

function Projects() {

  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { logoutContext: logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // RETURN ------------------------------------------------------------
  return (
    <div className="projects-layout">
      {/* Navigation */}
      <nav className="projects-nav">
        {/* Links */}
        <ul className="projects-nav-list">
          <li className="projects-nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  "projects-nav-link",
                  isActive
                    ? "projects-nav-link--active"
                    : "projects-nav-link--inactive",
                ].join(" ")
              }
            >
              Home
            </NavLink>
          </li>

          <li className="projects-nav-item">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                [
                  "projects-nav-link",
                  isActive
                    ? "projects-nav-link--active"
                    : "projects-nav-link--inactive",
                ].join(" ")
              }
            >
              Projects
            </NavLink>
          </li>
        </ul>

        {/* Search */}
        <div className="projects-search">
          <input
            type="text"
            placeholder="Search..."
            value={search.trim().toLowerCase()}
            onChange={(e) => setSearch(e.target.value)}
            className="projects-search-input"
          />
        </div>

        {/* Logout */}
        <div className="projects-logout">
          <button
            type="button"
            onClick={handleLogout}
            className="projects-logout-button"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="projects-content">
        <SearchContext.Provider value={search}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ManageProjects />}>
              <Route path="list-projects" element={<ListProjects />} />
              <Route path="create-project" element={<CreateProject />} />
            </Route>
          </Routes>
        </SearchContext.Provider>
      </div>
    </div>
  )
}

export default Projects
