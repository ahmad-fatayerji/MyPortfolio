"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/app/projects/ProjectCard";
import { Project } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsModule = await import("@/data/projects.json");
        const data = projectsModule.default.map((project: any) => ({
          ...project,
          technologies: project.tags || [], // Convert `tags` to `technologies`
        }));
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid gap-4">
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">No projects found.</p>
        ) : (
          projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
