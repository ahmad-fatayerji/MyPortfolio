import React from "react";
import { Project } from "@/types/project";
import Link from "next/link";
import { ExternalLink, Github, Lock } from "lucide-react";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="glass-card gradient-border p-6 group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
          {project.link && (
            <Link
              href={project.link}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 bg-card/30 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
              aria-label="View project"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Link>
          )}
          {project.code ? (
            <Link
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 bg-card/30 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
              aria-label="View source code"
            >
              <Github className="w-4 h-4 text-muted-foreground" />
            </Link>
          ) : (
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 bg-card/30 opacity-40 cursor-not-allowed"
              aria-label="Source code unavailable"
            >
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
