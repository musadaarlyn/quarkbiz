import { useEffect, useState } from "react";
import { fetchProjects } from "../../services/ProjectsService";

type Project = {
    id: number,
    projName: string
}

function ListProjects() {

    const [projects, setProjects] = useState<Project[]>([]);

    const loadProjects = async() => {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
    };

    useEffect( () => {
        loadProjects();
    }, []
    ); 

    return (
        <>
            <h2>Projects</h2>
            <ul>
                {
                    projects.map((project) => 
                    (
                        <li
                            key={project.id}
                        >
                        {project.projName}
                        </li>
                    )
                    )
                }
            </ul>
            
        </>
    );
}

export default ListProjects