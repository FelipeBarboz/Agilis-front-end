"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CpfInput } from "../../register/user/_components/cpf-input";
import { PhoneInput } from "../../register/user/_components/phone-input";
import { TermsCheckbox } from "../../register/user/_components/terms-checkbox";
import { supabase } from "@/lib/supabase";
import { registerClientProfile } from "@/lib/auth/auth-service";
import { saveStoredSession } from "@/lib/auth/token-storage";
import { useAuth } from "@/lib/auth/auth-context";
import { Loader2 } from "lucide-react";

const completeProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  phone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .min(10, "Telefone inválido")
        .max(11, "Telefone inválido")
        .regex(/^\d+$/, "Apenas números")
    ),
  cpf: z
    .string()
    .min(1, "CPF obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .length(11, "CPF deve ter 11 dígitos")
        .regex(/^\d+$/, "Apenas números")
    ),
  terms: z
    .boolean()
    .refine((val) => val === true, "Você deve aceitar os termos"),
});

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

function CompleteProfileInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUserProfile } = useAuth();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema) as Resolver<CompleteProfileFormData>,
    defaultValues: {
      name: "",
      phone: "",
      cpf: "",
      terms: false,
    },
  });

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUserEmail(data.user.email ?? "");
      const fullName =
        (data.user.user_metadata?.full_name as string | undefined) ??
        (data.user.user_metadata?.name as string | undefined) ??
        "";
      if (fullName) {
        setValue("name", fullName);
      }
      setLoadingInitial(false);
    }

    void loadUser();
  }, [router, setValue]);

  async function onSubmit(data: CompleteProfileFormData) {
    try {
      setServerError(null);
      const updatedProfile = await registerClientProfile({
        name: data.name,
        email: userEmail,
        phone: data.phone,
        cpf: data.cpf,
      });

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        saveStoredSession(sessionData.session.access_token, {
          id: updatedProfile.id || sessionData.session.user.id,
          name: data.name,
          email: userEmail,
          phone: data.phone,
          cpf: data.cpf,
          avatarUrl: updatedProfile.avatarUrl ?? null,
          role: updatedProfile.role ?? "Cliente",
        });
      }

      await refreshUserProfile();
      const redirectUrl = searchParams.get("redirect") || "/home";
      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error("[CompleteProfile] Erro ao cadastrar perfil:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao criar perfil. Verifique seus dados e tente novamente.";
      setServerError(msg);
    }
  }

  if (loadingInitial) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <motion.div
        className="bg-brand-green-dark px-6 pb-28 pt-6 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-xl font-bold text-primary-foreground">
          Complete seu perfil
        </h1>
        <p className="mt-1 text-xs text-white/70">
          Só precisamos de mais alguns dados para finalizar seu cadastro
        </p>
      </motion.div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-md px-6">
        <motion.div
          className="-mt-20 rounded-2xl bg-primary p-6 shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        >
          {serverError && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-500">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
            {/* E-mail (read-only) */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-white/90">
                E-mail
              </label>
              <input
                type="email"
                disabled
                value={userEmail}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white/70 cursor-not-allowed"
              />
            </div>

            {/* Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-white/90">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Seu nome completo"
                {...register("name")}
                className="w-full rounded-lg border border-white/20 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.name && (
                <span className="text-xs text-red-400">{errors.name.message}</span>
              )}
            </div>

            {/* Telefone */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-white/90">
                Telefone
              </label>
              <PhoneInput {...register("phone")} />
              {errors.phone && (
                <span className="text-xs text-red-400">{errors.phone.message}</span>
              )}
            </div>

            {/* CPF */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-white/90">
                CPF
              </label>
              <CpfInput {...register("cpf")} />
              {errors.cpf && (
                <span className="text-xs text-red-400">{errors.cpf.message}</span>
              )}
            </div>

            {/* Termos */}
            <div className="pt-1">
              <TermsCheckbox {...register("terms")} />
              {errors.terms && (
                <span className="mt-1 block text-xs text-red-400">
                  {errors.terms.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Finalizando..." : "Concluir Cadastro"}
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green-primary" />
        </div>
      }
    >
      <CompleteProfileInner />
    </Suspense>
  );
}
