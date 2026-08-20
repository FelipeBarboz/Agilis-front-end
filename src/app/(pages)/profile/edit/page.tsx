"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { mockUser } from "@/lib/mocks/user";
import { EditPersonalForm } from "./_components/edit-personal-form";

export default function EditProfilePage() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-muted">

      {/* Wrapper relativo: div verde idêntico ao perfil + botão voltar flutuando */}
      <div className="relative">
        {/* Banda verde — sem nenhum filho no fluxo, idêntico ao profile/page.tsx */}
        <div className="bg-primary px-6 pb-20 pt-8" />

        {/* Botão voltar absoluto em cima da banda */}
        <Link
          href="/profile"
          aria-label="Voltar ao perfil"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-primary-foreground transition-colors hover:bg-white/25"
        >
          <ArrowLeft size={18} />
        </Link>
      </div>

      {/* Conteúdo sobreposto com -mt-16 — z-10 garante que fica na frente da banda verde */}
      <div className="relative z-10 mx-auto w-full max-w-lg px-6">
        <motion.div
          className="-mt-16 flex flex-col gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Card com avatar, nome e e-mail */}
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-sm border border-border">
            <UserAvatar user={mockUser} size={88} />
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{mockUser.name}</p>
              <p className="text-sm text-muted-foreground">{mockUser.email}</p>
            </div>
          </div>

          {/* Formulário de edição */}
          <EditPersonalForm />
        </motion.div>
      </div>

    </main>
  );
}
