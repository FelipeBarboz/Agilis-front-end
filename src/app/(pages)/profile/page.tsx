"use client";

import { useRouter } from "next/navigation";
import { mockUser } from "@/lib/mocks/user";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileUserCard } from "./_components/profile-user-card";
import { ProfileInfo } from "./_components/profile-info";
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
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <ProfileHeader onBack={() => router.back()} />

        {/* Perfil do Usuário */}
        <ProfileUserCard user={mockUser} />

        {/* Informações pessoais */}
        <ProfileInfo user={mockUser} />

        {/* Prestador / Criar Loja */}
        <ProviderButton />

        {/* Configurações e Sair */}
        <ProfileMenu onLogout={handleLogout} />
      </main>
    </div>
  );
}