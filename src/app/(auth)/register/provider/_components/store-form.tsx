"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { CnpjInput } from "./cnpj-input";
import { storeSchema, type StoreFormData } from "./store";
import { Store, X, CheckCircle2, AlertCircle } from "lucide-react";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function StoreForm() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<StoreFormData | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
  });

  const cnpjValue = watch("cnpj");

  async function onSubmit(data: StoreFormData) {
    // Abre pop-up de confirmação em vez de redirecionar direto
    setPendingData(data);
    setShowConfirm(true);
  }

  async function handleConfirm() {
    if (!pendingData) return;
    setIsRegistering(true);

    // Simula registro (aqui entraria a chamada real à API)
    await new Promise((res) => setTimeout(res, 1000));

    setIsRegistering(false);
    setShowConfirm(false);
    router.push("/provider");
  }

  function handleCancel() {
    setShowConfirm(false);
    setPendingData(null);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* CNPJ */}
        <motion.div
          className="flex flex-col gap-1"
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="text-xs font-medium text-white">CNPJ</label>
          <CnpjInput {...register("cnpj")} />
          {errors.cnpj && (
            <p className="text-xs text-red-200">{errors.cnpj.message}</p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.25 }}
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

      {/* Pop-up de confirmação */}
      <AnimatePresence>
        {showConfirm && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 rounded-3xl bg-card p-6 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2"
              initial={{ opacity: 0, scale: 0.92, y: "-40%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.92, y: "-40%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Ícone */}
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Store className="size-8 text-primary" />
                </div>
              </div>

              {/* Título e descrição */}
              <div className="mb-2 text-center">
                <h2 className="text-lg font-bold text-foreground">
                  Registrar como Prestador?
                </h2>
              </div>
              <p className="mb-1 text-center text-sm text-muted-foreground">
                CNPJ informado:
              </p>
              <p className="mb-5 text-center text-base font-bold text-foreground">
                {cnpjValue
                  ? cnpjValue.replace(
                      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                      "$1.$2.$3/$4-$5"
                    )
                  : pendingData?.cnpj}
              </p>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Ao confirmar, você será registrado como prestador de serviços e
                terá acesso ao painel de gerenciamento.
              </p>

              {/* Aviso */}
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Certifique-se de que o CNPJ informado é válido e pertence à sua empresa.
                </p>
              </div>

              {/* Botões */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isRegistering}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70 cursor-pointer"
                >
                  {isRegistering ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      Sim, quero ser prestador
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isRegistering}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted disabled:opacity-50 cursor-pointer"
                >
                  <X className="size-4" />
                  Cancelar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}