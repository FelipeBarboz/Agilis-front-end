"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import { mockUser } from "@/lib/mocks/user";
import { AvatarModal } from "../_components/avatar-modal";
import { EditPersonalForm } from "./_components/edit-personal-form";

export default function EditProfilePage() {
  const router = useRouter();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      {/* Seta de voltar flutuante — padrão auth, serviço e perfil */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Editar Perfil</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Atualize suas informações pessoais e dados de contato
          </p>
        </div>

        {/* Card 1: Foto de Perfil */}
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#006b49] text-4xl font-light text-white sm:h-28 sm:w-28 sm:text-5xl">
              {mockUser.name.charAt(0)}
            </div>
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              aria-label="Alterar foto de perfil"
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-muted-foreground shadow-sm transition-colors hover:text-foreground cursor-pointer"
            >
              <Camera className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsAvatarModalOpen(true)}
            className="text-xs font-semibold text-primary transition-colors hover:underline cursor-pointer"
          >
            Alterar foto
          </button>
        </div>

        {/* Formulário de edição */}
        <EditPersonalForm />
      </main>
    </div>
  );
}
