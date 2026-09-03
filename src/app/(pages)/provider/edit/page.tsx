"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { AvatarModal } from "../../profile/_components/avatar-modal";
import { EditProviderForm } from "./_components/edit-provider-form";

export default function EditProviderPage() {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      {/* Seta de voltar flutuante — redireciona para tela de prestador */}
      <Link
        href="/provider"
        aria-label="Voltar para tela de prestador"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Editar Perfil de Prestador</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Atualize suas informações pessoais e dados de contato profissional
          </p>
        </div>

        {/* Card 1: Foto de Perfil */}
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#006b49] text-4xl font-light text-white sm:h-28 sm:w-28 sm:text-5xl">
              C
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
        <EditProviderForm />
      </main>
    </div>
  );
}
