"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Store, X } from "lucide-react";

interface ConfirmProviderModalProps {
  open: boolean;
  cnpj: string;
  isRegistering: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmProviderModal({
  open,
  cnpj,
  isRegistering,
  onConfirm,
  onCancel,
}: ConfirmProviderModalProps) {
  const formattedCnpj = cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
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
              {formattedCnpj || cnpj}
            </p>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Ao confirmar, você será registrado como prestador de serviços e
              terá acesso ao painel de gerenciamento.
            </p>

            {/* Aviso */}
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3.5 dark:border-red-800/60 dark:bg-red-950/40">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-xs font-semibold leading-relaxed text-red-900 dark:text-red-200">
                Certifique-se de que o CNPJ informado é válido e pertence à sua
                empresa.
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isRegistering}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
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
                onClick={onCancel}
                disabled={isRegistering}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted disabled:opacity-50"
              >
                <X className="size-4" />
                Cancelar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
