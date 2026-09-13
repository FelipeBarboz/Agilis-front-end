"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "../../../../../../components/google-button";
import { registerSchema, type RegisterFormData } from "@/lib/validations/register";
import { EmailField } from "./email-field";
import { PhoneField } from "./phone-field";
import { NameField } from "./name-field";
import { CpfField } from "./cpf-field";
import { PasswordField } from "./password-field";
import { TermsField } from "./terms-field";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Google */}
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <GoogleButton />
      </motion.div>

      {/* Divider */}
      <motion.div
        className="flex items-center gap-3"
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <div className="h-px flex-1 bg-white/30" />
        <span className="text-xs text-white/70">Ou Digite seu e-mail</span>
        <div className="h-px flex-1 bg-white/30" />
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <EmailField register={register} error={errors.email} />
        <PhoneField register={register} error={errors.phone} />
        <NameField register={register} error={errors.name} />
        <CpfField register={register} error={errors.cpf} />
        <PasswordField register={register} error={errors.password} />
        <TermsField register={register} error={errors.terms} />

        {/* Submit */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.55 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-1 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Aguarde..." : "Continuar"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
