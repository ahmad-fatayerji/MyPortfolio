"use client";

import ProjectCard from "./ProjectCard";
import { Project } from "@/types/project";

const projects: Project[] = [
  {
    title: "Next.js Portfolio",
    description:
      "A portfolio website built using Next.js, TailwindCSS, and TypeScript.",
    technologies: ["Next.js", "TailwindCSS", "TypeScript"],
    link: "https://example.com/portfolio",
  },
  {
    title: "E-commerce Platform",
    description:
      "An advanced e-commerce platform with secure payments and product management.",
    technologies: ["React", "Node.js", "MongoDB"],
    link: "https://example.com/ecommerce",
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid gap-4">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
}
