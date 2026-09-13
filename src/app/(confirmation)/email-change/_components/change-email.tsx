"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { PageHeader } from "./page-header";
import { EmailForm } from "./email-form";
import EmailValidationCode from "./email-validation-code";

export default function ChangeEmailPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  function handleSubmit(_e: FormEvent) {
    setStep(2);
  }

  if (step === 2) {
    return (
      <EmailValidationCode
        email={email}
        onBack={() => setStep(1)}
        onConfirm={(code) => {
          console.log("Código confirmado:", code);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <PageHeader backHref="/profile" />

      {/* Hero section */}
      <motion.div
        className="bg-brand-green-dark px-6 pb-32 pt-6 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-xl font-bold text-primary-foreground">
          Altere seu E-mail
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
          <EmailForm
            email={email}
            confirmEmail={confirmEmail}
            onEmailChange={setEmail}
            onConfirmEmailChange={setConfirmEmail}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </div>
    </div>
  );
}