"use client";

import { motion } from "motion/react";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function ForgotPasswordLink() {
  return (
    <motion.div
      className="flex justify-end"
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <a
        href="/auth/forgot-password"
        className="text-xs text-white/70 hover:text-white hover:underline"
      >
        Esqueci minha senha
      </a>
    </motion.div>
  );
}
