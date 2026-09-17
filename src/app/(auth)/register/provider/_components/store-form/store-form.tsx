"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { storeSchema, type StoreFormData } from "../store";
import { CnpjField } from "./cnpj-field";
import { ConfirmProviderModal } from "./confirm-provider-modal";

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
    setPendingData(data);
    setShowConfirm(true);
  }

  async function handleConfirm() {
    if (!pendingData) return;
    setIsRegistering(true);

    // Simula registro (aqui entraria a chamada real à API)
    await new Promise((res) => setTimeout(res, 1000));

    localStorage.setItem("provider_cnpj", pendingData.cnpj);
    localStorage.setItem("is_provider", "true");

    setIsRegistering(false);
    setShowConfirm(false);
    router.push("/profile");
  }

  function handleCancel() {
    setShowConfirm(false);
    setPendingData(null);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <CnpjField register={register} error={errors.cnpj} />

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

      <ConfirmProviderModal
        open={showConfirm}
        cnpj={cnpjValue ?? pendingData?.cnpj ?? ""}
        isRegistering={isRegistering}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}