"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// ─── Variantes reutilizáveis ──────────────────────────────────────────────────

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// ─── Page transition — envolve o conteúdo de cada página ─────────────────────

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── FadeIn — para itens individuais com delay opcional ──────────────────────

export function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── FadeInSection — para seções que animam ao entrar no viewport ─────────────

export function FadeInSection({ children, delay = 0, className = "" }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUpVariants}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Componentes motion exportados para uso direto ───────────────────────────

export const MotionDiv = motion.div;
export const MotionSection = motion.section;