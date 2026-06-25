"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SearchBar } from "./search-bar";

export function HeroSection() {
  return (
    <div className="relative flex min-h-65 items-center justify-between overflow-hidden rounded-2xl bg-secondary px-12 py-10">

      {/* LEFT */}
      <div className="z-10 max-w-130">
        <motion.h1
          className="text-4xl font-bold leading-tight text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Agilize sua vida com
          <br />
          <span className="text-primary">os serviços Agilis</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* RIGHT */}
      <div className="pointer-events-none absolute right-0 bottom-0 flex items-end justify-end">
        <div className="absolute -right-10 -bottom-10 h-75 w-75 rounded-full bg-brand-green-dark" />
        <div className="absolute right-15 -bottom-15 h-45 w-45 rounded-full bg-primary" />

        <motion.div
          className="relative z-10 h-75 w-65"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        >
          <Image
            src="/img/img-agilizador.png"
            alt="Profissional Agilis"
            fill
            className="object-contain object-bottom"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}