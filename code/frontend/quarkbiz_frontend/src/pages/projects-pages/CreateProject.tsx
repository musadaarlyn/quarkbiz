import '../../Pages.css'
import { useEffect, useState } from "react";
import { fetchTechStacks } from "../../services/TechStackService";
import { createProject } from "../../services/ProjectsService";

type Stack = {
    id: number,
    tsName: string
};

function CreateProject() {

    // form fields
    const [projName, setProjName] = useState("");
    const [projDescription, setDescription] = useState("");
    const [techStackIds, setTechStacks] = useState<number[]>([]);
    const [status, setStatus] = useState<'Planning' | 'In Progress' | 'Completed' | 'On Hold'>('Planning');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // tech stack list for dropdown input
    const [techStacks, getTechStacks] = useState<Stack[]>([]);

    const loadStacks = async() => {
        const stacksData = await fetchTechStacks();
        getTechStacks(stacksData);
    }

    // load page
    useEffect( () => {
        loadStacks();
    }, []
    );

    // form submit
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        // validate dates
        if(startDate > endDate) {
            alert("Start date must be before end date");
            return;
        }

        // create project
        try {
            await createProject({
                projName,
                projDescription,
                techStackIds,
                status,
                startDate,
                endDate
            });

            alert("Project Added");
        } catch(err) {
            alert("Error creating project");
        }
    };

    // -------------- RETURN -----------------------
    return (
        <>
            <h2>Create Project</h2>
            <form onSubmit={handleSubmit} className="form">

                {/* Name */}
                <div>
                    <label>Name: </label> 
                    <br />
                    <input
                        type="text" 
                        value={projName}
                        onChange={(e) => setProjName(e.target.value)}
                        required
                    />
                </div> <br />

                {/* Description */}
                <div>
                    <label>Description: </label>
                    <br />
                    <textarea 
                        value={projDescription}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div> <br />

                {/* Tech Stack */}
                <div>
                    <label>Tech Stack: </label>
                    <br />
                    <select 
                    multiple 
                    required
                    value={techStackIds.map(String)}
                    onChange={
                        (e) => {
                            const values = Array.from(e.target.selectedOptions).map(
                                (option) => Number(option.value)
                            );
                            setTechStacks(values);
                        }
                    }
                    >
                        {/* display techs in multi select */}
                        {
                            techStacks.map(
                                (tech) => (
                                    <option key={tech.id} value={tech.id}>{tech.tsName}</option>
                                )
                            )
                        }
                    </select>
                </div> <br />

                <div>
                    <label>Status</label>
                    <br />
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value as 'Planning' | 'In Progress' | 'Completed' | 'On Hold')}
                        required
                    >
                        <option value='Planning' selected>Planning</option>
                        <option value='In Progress'>In Progress</option>
                        <option value='Completed'>Completed</option>
                        <option value='On Hold'>On Hold</option>
                    </select>
                </div> <br />

                {/* Start Date */}
                <div>
                    <label>Start Date</label>
                    <br />
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div> <br />

                {/* End Date */}
                <div>
                    <label>End Date</label>
                    <br />
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <br />


                {/* submit button */}
                <button type="submit">Create</button>
            </form>
        </>
    );
}

export default CreateProject;