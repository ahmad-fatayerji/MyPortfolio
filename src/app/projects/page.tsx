"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/app/projects/ProjectCard";
import { Project } from "@/types/project";
import projectsData from "@/data/projects.json";

export default function ProjectsPage() {
  const projects = (projectsData as unknown as Project[]) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="section-heading mb-4">
          My <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          A collection of things I&apos;ve built and contributed to.
        </p>
      </motion.div>

      <div className="grid gap-5">
        {projects.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground"
          >
            No projects found.
          </motion.p>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
