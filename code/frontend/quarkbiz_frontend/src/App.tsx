import { NavLink, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ListProjects from './pages/projects-pages/ListProjects'
import CreateProject from './pages/projects-pages/CreateProject'
import { useState, createContext } from 'react'

export const SearchContext = createContext("");

function App() {

  const [search, setSearch] = useState("");

  // RETURN ------------------------------------------------------------
  return (
    <div className="flex flex-col min-h-screen md:flex-row font-sans">
      
      {/* Navigation */}
      <nav className="bg-[#414547] p-4 md:w-1/6 flex flex-col">

        {/* Links */}
        <ul className="flex flex-row md:flex-col gap-3 list-none w-full">
          <li className="w-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block w-full text-center py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#05b7f5] text-white'
                    : 'text-gray-300 hover:bg-[#c0c1c2] hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `block w-full text-center py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#05b7f5] text-white'
                    : 'text-gray-300 hover:bg-[#c0c1c2] hover:text-white'
                }`
              }
            >
              Projects
            </NavLink>
          </li>
        </ul>

        {/* Search bar (bottom) */}
        <div className="mt-10 w-full pt-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 rounded-md bg-[#2f3234] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#05b7f5]"
            value={search.trim().toLowerCase()} // normalized
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <SearchContext.Provider value={search}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />}>
                  <Route path="list-projects" element={<ListProjects />} />
                  <Route path="create-project" element={<CreateProject />} />
                </Route>
              </Routes>
        </SearchContext.Provider>
      </div>
    </div>
  )
}

export default App
