"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

type Props = {
  eyebrow: string;
  title: string;
  desc: string;
  btn: string;
  href: string;
};

/**
 * Banner de cruce entre las dos secciones de landing pages:
 * "Landing bajo demanda" (renta mensual) <-> "Landing a la medida" (pago único + mantenimiento).
 * Se usa en ambas páginas para que el visitante encuentre fácilmente la otra opción.
 */
export default function LandingSwitchBanner({
  eyebrow,
  title,
  desc,
  btn,
  href,
}: Props) {
  return (
    <section className="w-[85%] max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="
          flex flex-col md:flex-row items-center justify-between gap-6
          rounded-2xl border border-white/10 bg-white/5 backdrop-blur
          px-8 py-8
        "
      >
        <div className="text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
            {eyebrow}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold mt-1">{title}</h3>
          <p className="text-gray-400 mt-2 max-w-xl">{desc}</p>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <Link
            href={href}
            className="
              h-12 px-6 rounded-xl font-semibold
              border border-white/20 text-white bg-transparent
              hover:bg-white/10 transition duration-200
              flex items-center justify-center gap-2 text-center
            "
          >
            {btn}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
