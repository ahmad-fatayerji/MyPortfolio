"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";

const experiences = [
  {
    id: 1,
    date: "Jan 2024 - Present",
    title: "ReactJS Developer",
    company: "FAB Web Studio",
    description:
      "Building and managing interactive UIs using React and Next.js. Collaborating with design teams to ensure engaging user experiences.",
  },
  {
    id: 2,
    date: "Jan 2023 - Jan 2024",
    title: "Software Engineer",
    company: "Edvolve",
    description:
      "Developed web applications from scratch using React. Planned and prioritized feature development.",
  },
  // ... add as many experiences as you want
];

export default function CareerTimeline() {
  return (
    <section className="py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-10">Career History</h2>

      <div className="relative max-w-4xl mx-auto">
        {/* 
          The main vertical "Git branch" line.
          Hidden on mobile for a cleaner layout, but you can remove `hidden md:block` if you want it always visible.
        */}
        <div className="hidden md:block absolute left-1/2 top-0 transform -translate-x-1/2 w-[2px] h-full bg-muted-foreground z-0" />

        <div className="space-y-14">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative flex flex-col md:flex-row md:items-center md:justify-between"
            >
              {/* 
                -- The "commit node" dot 
                Absolute positioning to place it in the center line on desktop.
              */}
              <div
                className="
                  hidden md:flex 
                  absolute left-1/2 transform -translate-x-1/2
                  w-6 h-6 bg-primary
                  items-center justify-center 
                  rounded-full 
                  z-10
                "
              >
                <Circle className="text-white w-3 h-3" />
              </div>

              {/* 
                Connect the dot to the next dot with a small vertical line segment 
                (like a commit chain).
              */}
              {index < experiences.length - 1 && (
                <div
                  className="
                    hidden md:block 
                    absolute left-1/2 transform -translate-x-1/2
                    w-[2px] h-14 bg-primary
                    top-full 
                    z-0
                  "
                />
              )}

              {/* Date side (or top on mobile) */}
              <div className="mb-2 md:mb-0 md:w-1/3 text-center md:text-right md:pr-8">
                <p className="text-sm font-semibold text-muted-foreground">
                  {exp.date}
                </p>
              </div>

              {/* Content box side (or below on mobile) */}
              <div
                className="
                  md:w-2/3 
                  bg-card text-card-foreground 
                  rounded-lg shadow-md 
                  p-6 
                "
              >
                <h3 className="text-xl font-semibold">{exp.title}</h3>
                <p className="text-primary font-medium">{exp.company}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
