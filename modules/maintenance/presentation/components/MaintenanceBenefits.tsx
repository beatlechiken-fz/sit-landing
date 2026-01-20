"use client";

import { motion } from "framer-motion";

export default function MaintenanceBenefits() {
  const benefits = [
    "Mayor rendimiento",
    "Menos calentamiento",
    "Arranque más rápido",
    "Prevención de fallas",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-[85%] max-w-7xl flex flex-col items-center gap-16"
    >
      <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-bold text-center">
        <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
          ¿Por qué hacer mantenimiento?
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {benefits.map((b, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-teal-400/40 transition"
          >
            {b}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
