import { useState, useEffect } from "react";
import { fetchTechStacks } from "../../services/TechStackService";
import React from "react";

type Project = {
  id: number;
  projName: string;
  projDescription?: string | null;
  techStackIds: number[];
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

type TechStack = {
  id: number;
  tsName: string;
};

interface Props {
  project?: Project | null;
}

const ViewProjectCard: React.FC<Props> = ({project}: Props) => {

    if (!project) return null;

    // states
    const [techStacks, setTechStacks] = useState<TechStack[]>([]);

    // get tech stacks
    const getTechStackNames = (ids: number[]): string[] => {
        if (!ids || ids.length === 0) return [];
        return ids.map(id => {
        const stack = techStacks.find(ts => ts.id === id);
        return stack?.tsName || `Unknown (ID: ${id})`;
        });
    };

    // use effects

    // testing if getting rerendered
    useEffect(() => {
        console.log("rerendered");
    })

    // fetch tech stacks from database
    useEffect(() => {
        const load = async () => {
        try {
            const [stacksData] = await Promise.all([
            fetchTechStacks()
            ]);
            setTechStacks(stacksData);
        } catch (err) {
            console.log(err);
        }
        };
        load();
    }, []);

    // RETURN -------------------------------------
    return(
        <div className="m-8 flex-1 border border-gray-200 rounded-md shadow-sm p-8">
            <div className="space-y-3 text-sm">
                <div>
                    <p className="text-slate-500 uppercase tracking-wide text-xs">Name</p>
                    <p className="font-medium">{project.projName}</p>
                </div>

                <div>
                    <p className="text-slate-500 uppercase tracking-wide text-xs">Status</p>
                    <p>{project.status}</p>
                </div>

                <div>
                    <p className="text-slate-500 uppercase tracking-wide text-xs">Description</p>
                    <p>{project.projDescription || "—"}</p>
                </div>

                <div>
                    <p className="text-slate-500 uppercase tracking-wide text-xs">Tech Stack</p>
                    <p>
                    {project.techStackIds.length > 0 ? getTechStackNames(project.techStackIds).join(", ") : "—"}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <p className="text-slate-500 uppercase tracking-wide text-xs">Start Date</p>
                    <p>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</p>
                    </div>
                    <div>
                    <p className="text-slate-500 uppercase tracking-wide text-xs">End Date</p>
                    <p>{project.endDate ? new Date(project.endDate).toLocaleDateString() : "—"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <p className="text-slate-500 uppercase tracking-wide text-xs">Created</p>
                    <p>{project.createdAt ? new Date(project.createdAt).toLocaleString() : "—"}</p>
                    </div>
                    <div>
                    <p className="text-slate-500 uppercase tracking-wide text-xs">Updated</p>
                    <p>{project.updatedAt ? new Date(project.updatedAt).toLocaleString() : "—"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(ViewProjectCard, (prevProps, nextProps) => {

  if (prevProps.project === nextProps.project) return true;
  if (!prevProps.project || !nextProps.project) return false;
  
  // Compare projects
  return prevProps.project.id === nextProps.project.id;
});