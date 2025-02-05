import React from "react";
import { Project } from "../../types/project";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-2">{project.title}</h2>
      <p className="text-gray-700 mb-2">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="bg-gray-200 px-2 py-1 rounded-full text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
      <Button asChild>
        <Link href={project.link}>Learn more</Link>
      </Button>
    </div>
  );
};

export default ProjectCard;
