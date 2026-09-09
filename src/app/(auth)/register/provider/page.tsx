"use client";

import { motion } from "motion/react";
import { StoreForm } from "./_components/store-form";

export default function StoreRegisterPage() {
  return (
    <>
      {/* Hero */}
      <motion.div
        className="bg-brand-green-dark px-6 pb-32 pt-6 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-xl font-bold text-primary-foreground">
          Preencha os dados para criar
          <br />
          sua conta
        </h1>
      </motion.div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-md px-6">
        <motion.div
          className="-mt-24 rounded-2xl bg-primary p-6 shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        >
          <StoreForm />
        </motion.div>
      </div>
    </>
  );
}