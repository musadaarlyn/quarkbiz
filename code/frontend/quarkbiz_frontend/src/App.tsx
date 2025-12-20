import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ListProjects from './pages/projects-pages/ListProjects'
import CreateProject from './pages/projects-pages/CreateProject'

function App() {

  return (
    <div className="app-wrapper">
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <Routes>
          <Route path='/' element={<Home />}  />
          <Route path='/projects' element={<Projects />}>
            <Route path='list-projects' element={<ListProjects />} />
            <Route path='create-project' element={<CreateProject />}  />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
