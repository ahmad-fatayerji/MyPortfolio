import React from "react";
import { Project } from "@/types/project";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="glow-card border rounded-lg p-4 shadow-md bg-background text-foreground transition-colors">
      <h2 className="text-xl font-bold mb-2">{project.title}</h2>
      <p className="text-muted-foreground mb-2">{project.description}</p>

      {/* Ensure tags exist before mapping */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex space-x-4">
        {project.link && (
          <Button asChild>
            <Link href={project.link}>Learn more</Link>
          </Button>
        )}
        {project.code ? (
          <Link
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "default" })}
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
