"use client";

import { motion } from "framer-motion";
import experiences from "@/data/experiences.json"; // Importing JSON data

export default function CareerTimeline() {
  return (
    <section className="py-16 px-6">
      <h2 className="text-4xl font-bold text-center mb-10">Career History</h2>

      <div className="relative max-w-4xl mx-auto">
        {/* Central Timeline Line */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gray-300 dark:bg-gray-600 z-0" />

        <div className="space-y-28">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row md:items-center 
                ${index % 2 === 0 ? "md:flex-row-reverse" : ""}
              `}
            >
              {/* Connecting Line */}
              {index < experiences.length - 1 && (
                <div
                  className="hidden md:block absolute left-1/2 transform -translate-x-1/2 
                  w-[2px] h-20 bg-gray-300 dark:bg-gray-600 top-full z-0"
                />
              )}

              {/* Date */}
              <div
                className={`mb-4 md:w-1/3 text-center md:text-${
                  index % 2 === 0 ? "left" : "right"
                } md:px-8`}
              >
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {exp.date}
                </p>
              </div>

              {/* Experience Card */}
              <div
                className={`
    glow-card md:w-2/3 rounded-lg shadow-lg p-6 border transition-all hover:scale-[1.02]
    bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-200
    border-gray-300 dark:border-gray-700
    ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}
  `}
              >
                <h3 className="text-xl font-semibold">{exp.title}</h3>
                <p className="text-primary font-medium">{exp.company}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
