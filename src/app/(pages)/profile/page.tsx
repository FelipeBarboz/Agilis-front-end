"use client";

import { useRouter } from "next/navigation";
import { mockUser } from "@/lib/mocks/user";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileUserCard } from "./_components/profile-user-card";
import { ProfileInfo } from "./_components/profile-info";
import { CnpjProviderCard } from "./_components/cnpj-provider-card";
import { ProviderButton } from "./_components/provider-button";
import { ProfileMenu } from "./_components/profile-menu";

export default function ProfilePage() {
  const router = useRouter();

  function handleLogout() {
    // Limpa todo o localStorage
    localStorage.clear();

    // Limpa todos os cookies
    document.cookie.split(";").forEach((cookie) => {
      const name = (cookie.split("=")[0] ?? "").trim();
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });

    window.location.href = "/login";
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <ProfileHeader onBack={() => router.back()} />

        {/* Perfil do Usuário */}
        <ProfileUserCard user={mockUser} />

        {/* Informações pessoais */}
        <ProfileInfo user={mockUser} />

        {/* CNPJ — Tornar-se Provedor */}
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground px-1 mb-2">
              Conta Provedor
            </h2>
            <CnpjProviderCard />
          </div>
        </div>

        {/* Botões do Prestador (Só visível se CNPJ cadastrado) */}
        <ProviderButton />

        {/* Configurações e Sair */}
        <ProfileMenu onLogout={handleLogout} />
      </main>
    </div>
  );
}