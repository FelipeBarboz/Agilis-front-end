"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { storeSchema, type StoreFormData } from "../store";
import { formatCnpj } from "@/lib/services/stores-service";
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

  function handleConfirm() {
    if (!pendingData) return;
    setIsRegistering(true);

    const formattedCnpj = formatCnpj(pendingData.cnpj);
    try {
      sessionStorage.setItem("provider_cnpj", formattedCnpj);
      localStorage.setItem("provider_cnpj", formattedCnpj);
    } catch {}

    setShowConfirm(false);
    router.push("/provider/create-store");
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