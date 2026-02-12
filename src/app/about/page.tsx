"use client";

import { m } from "framer-motion";
import { Code2, Layers, Wrench, Languages } from "lucide-react";
import skillsData from "@/data/skills.json";

interface Skill {
  icon: string;
  title: string;
  items: string[];
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
  {
    Code2,
    Layers,
    Wrench,
    Languages,
  };

export default function AboutPage() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-8 sm:py-16"
    >
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="section-heading mb-4">
          About <span className="gradient-text">Me</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
          I&apos;m a software engineer based in France, currently pursuing a
          Master&apos;s in Software Engineering at Nantes Universit&eacute;. I
          love building modern, clean applications that solve real problems.
        </p>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {skillsData.map((skill: Skill, i) => {
          const IconComponent = iconMap[skill.icon];
          return (
            <m.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="glass-card gradient-border p-6 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">{skill.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span key={item} className="tag-pill">
                    {item}
                  </span>
                ))}
              </div>
            </m.div>
          );
        })}
      </m.div>
    </m.div>
  );
}
