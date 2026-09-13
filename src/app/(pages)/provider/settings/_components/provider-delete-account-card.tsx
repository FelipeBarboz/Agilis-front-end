"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProviderDeleteAccountModal } from "./provider-delete-account-modal";

export function ProviderDeleteAccountCard() {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    router.push("/login");
  };

  return (
    <>
      <div className="flex flex-col gap-4 rounded-3xl border border-destructive/30 bg-destructive/5 dark:bg-card p-5 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 text-destructive">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <Trash2 className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Excluir Conta</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Encerramento permanente do seu perfil e loja profissional no Agilis
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Ao excluir sua conta, todos os seus dados comerciais, fotos de serviços,
          histórico de atendimentos e avaliações serão apagados permanentemente.
          Esta ação não poderá ser desfeita.
        </p>

        <div className="flex justify-end pt-1">
          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            className="rounded-xl text-xs font-bold px-4 py-2 cursor-pointer shadow-xs"
          >
            Excluir minha conta
          </Button>
        </div>
      </div>

      <ProviderDeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
