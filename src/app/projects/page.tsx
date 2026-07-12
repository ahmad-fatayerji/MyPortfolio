"use client";

import { m } from "framer-motion";
import ProjectCard from "@/app/projects/ProjectCard";
import { Project } from "@/types/project";
import projectsData from "@/data/projects.json";
import { useLiteMotion } from "@/lib/useLiteMotion";

export default function ProjectsPage() {
  const projects = (projectsData as unknown as Project[]) ?? [];
  const useLite = useLiteMotion();

  return (
    <m.div
      initial={useLite ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: useLite ? 0 : 0.5 }}
      className="max-w-4xl mx-auto py-8"
    >
      <m.div
        initial={useLite ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: useLite ? 0 : 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="section-heading mb-4">
          My <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          A collection of things I&apos;ve built and contributed to.
        </p>
      </m.div>

      <div className="grid gap-5">
        {projects.length === 0 ? (
          <m.p
            initial={useLite ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: useLite ? 0 : 0.3 }}
            className="text-center text-muted-foreground"
          >
            No projects found.
          </m.p>
        ) : (
          projects.map((project, index) => (
            <m.div
              key={index}
              initial={useLite ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: useLite ? 0 : 0.4,
                delay: useLite ? 0 : index * 0.1,
              }}
            >
              <ProjectCard project={project} />
            </m.div>
          ))
        )}
      </div>
    </m.div>
  );
}
