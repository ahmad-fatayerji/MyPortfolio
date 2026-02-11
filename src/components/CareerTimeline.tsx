"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import experiences from "@/data/experiences.json";

export default function CareerTimeline() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="section-heading mb-4">
          Career <span className="gradient-text">History</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          My academic journey and professional milestones.
        </p>
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        {/* Gradient timeline line */}
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 w-px h-full z-0"
          style={{
            background:
              "linear-gradient(to bottom, hsl(var(--gradient-from) / 0.3), hsl(var(--gradient-to) / 0.3), transparent)",
          }}
        />

        <div className="space-y-16 md:space-y-20">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row md:items-start gap-6 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Center dot */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 z-10">
                <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
              </div>

              {/* Date */}
              <div
                className={`md:w-[45%] flex items-center gap-2 ${
                  index % 2 === 0
                    ? "md:justify-start md:pl-8"
                    : "md:justify-end md:pr-8"
                }`}
              >
                <span className="text-sm font-medium text-muted-foreground tracking-wide">
                  {exp.date}
                </span>
              </div>

              {/* Card */}
              <div className="md:w-[45%] glass-card p-6 gradient-border group cursor-default">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    {index === experiences.length - 1 ? (
                      <Award className="w-4 h-4 text-primary" />
                    ) : (
                      <GraduationCap className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base leading-snug">
                      {exp.title}
                    </h3>
                    <p className="text-sm font-medium text-primary mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
