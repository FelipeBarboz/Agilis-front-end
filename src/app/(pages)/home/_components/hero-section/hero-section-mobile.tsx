"use client";

import { motion } from "motion/react";
import { SearchBar } from "../search/search-bar";

export function HeroSectionMobile() {
  return (
    <section className="relative flex flex-col items-center justify-center bg-secondary px-4 pt-9 pb-8 text-center overflow-hidden">
      {/* Title with Agilis desktop brand typography and green highlight */}
      <motion.h1
        className="text-2xl sm:text-3xl font-extrabold leading-tight text-foreground tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        Agilize sua vida com
        <br />
        <span className="text-primary font-black">os serviços Agilis</span>
      </motion.h1>

      {/* Search Bar */}
      <motion.div
        className="mt-6 flex w-full justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      >
        <SearchBar
          className="w-full max-w-[320px] sm:max-w-xs"
          placeholder="Encontre seu serviço..."
        />
      </motion.div>
    </section>
  );
}