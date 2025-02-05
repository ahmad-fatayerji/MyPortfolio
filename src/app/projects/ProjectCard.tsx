import React from "react";
import { Project } from "../../types/project";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-background text-foreground transition-colors">
      <h2 className="text-xl font-bold mb-2">{project.title}</h2>
      <p className="text-muted-foreground mb-2">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href={project.link}>Learn more</Link>
        </Button>
        {project.code ? (
          <Link
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants()}
          >
            View code
          </Link>
        ) : (
          <button
            className={clsx(
              buttonVariants({ variant: "default" }),
              "opacity-50 cursor-not-allowed"
            )}
            disabled
          >
            View code
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
