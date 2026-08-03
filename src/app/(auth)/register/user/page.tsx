"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { RegisterForm } from "./_components/register-form";

export default function RegisterPage() {
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
          Crie sua conta e agilize
          <br />
          sua vida
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
          <RegisterForm />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="py-8 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
      >
        Já possui uma conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </motion.div>
    </>
  );
}