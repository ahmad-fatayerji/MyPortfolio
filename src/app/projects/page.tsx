"use client";

import ProjectCard from "./ProjectCard";
import { Project } from "@/types/project";

const projects: Project[] = [
  {
    title: "Next.js Portfolio",
    description:
      "A portfolio website built using Next.js, TailwindCSS, and TypeScript to showcase my development skills.",
    technologies: ["Next.js", "TailwindCSS", "TypeScript"],
    link: "/",
    code: "https://github.com/ahmad-fatayerji/MyPortfolio",
  },
  {
    title: "Interesting Project",
    description: "Cool project!",
    technologies: ["C++", "Python", "C#"],
    link: "/testing",
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
