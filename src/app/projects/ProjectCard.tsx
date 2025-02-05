import React from "react";
import { Project } from "../../types/project";
import { Button } from "@/components/ui/button";

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
      <a
        href={project.link}
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
      </a>
      <Button>Learn more</Button>
    </div>
  );
};

export default ProjectCard;
