import '../Pages.css'
import { Link, Outlet } from "react-router-dom";

function Projects() {

    return (
        <div className="projects-wrapper">
            <button>
                <Link to='list-projects'>Projects List</Link>
            </button>
            <button>
                <Link to='create-project'>Create Project</Link>
            </button>

            <Outlet />
        </div>
    );
}

export default Projects