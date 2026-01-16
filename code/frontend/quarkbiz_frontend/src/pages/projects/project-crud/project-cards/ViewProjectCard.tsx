import { useState, useEffect } from "react";
import { fetchTechStacks } from "../../../../services/projects/TechStackService";
import React from "react";
import "../../../../styles/projects/ViewProjectCard.css";
import type { Project } from "../../../../types/entity-types/Project";

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
        <div className="view-project-card">
        <div className="view-project-card-content">
            <div className="view-project-card-field">
            <p className="view-project-card-label">Name</p>
            <p className="view-project-card-value">{project.projName}</p>
            </div>

            <div className="view-project-card-field">
            <p className="view-project-card-label">Status</p>
            <p className="view-project-card-value">{project.status}</p>
            </div>

            <div className="view-project-card-field">
            <p className="view-project-card-label">Description</p>
            <p className="view-project-card-value">{project.projDescription || "—"}</p>
            </div>

            <div className="view-project-card-field">
            <p className="view-project-card-label">Tech Stack</p>
            <p className="view-project-card-value">
                {project.techStackIds.length > 0
                ? getTechStackNames(project.techStackIds).join(", ")
                : "—"}
            </p>
            </div>

            <div className="view-project-card-grid">
            <div>
                <p className="view-project-card-label">Start Date</p>
                <p className="view-project-card-value">
                {project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}
                </p>
            </div>
            <div>
                <p className="view-project-card-label">End Date</p>
                <p className="view-project-card-value">
                {project.endDate ? new Date(project.endDate).toLocaleDateString() : "—"}
                </p>
            </div>
            </div>

            <div className="view-project-card-grid">
            <div>
                <p className="view-project-card-label">Created</p>
                <p className="view-project-card-value">
                {project.createdAt ? new Date(project.createdAt).toLocaleString() : "—"}
                </p>
            </div>
            <div>
                <p className="view-project-card-label">Updated</p>
                <p className="view-project-card-value">
                {project.updatedAt ? new Date(project.updatedAt).toLocaleString() : "—"}
                </p>
            </div>
            </div>
        </div>
        </div>
    );
}

export default React.memo(ViewProjectCard, (prevProps, nextProps) => {

  let isTheSame = false;

  if (prevProps.project === nextProps.project) {
    isTheSame = true;
  }
    
  return isTheSame;
  
});