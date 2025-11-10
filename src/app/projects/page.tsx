"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/app/projects/ProjectCard";
import { Project } from "@/types/project";
import projectsData from "@/data/projects.json";

export default function ProjectsPage() {
  // Prefer static import for JSON with Turbopack; avoids CSR-only fetch and timing issues
  const projects = (projectsData as unknown as Project[]) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto p-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-4xl font-bold text-center mb-10"
      >
        My Projects
      </motion.h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="grid gap-4"
      >
        {projects.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500"
          >
            No projects found.
          </motion.p>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
