"use client";

import { useRouter } from "next/navigation";
import { ProviderSettingsHeader } from "./provider-settings-header";
import { ProviderThemeCard } from "./provider-theme-card";
import { ProviderPasswordCard } from "./provider-password-card";
import { ProviderNotificationsSettingsCard } from "./provider-notifications-settings-card";
import { ProviderStoreCard } from "./provider-store-card";
import { ProviderDeleteAccountCard } from "./provider-delete-account-card";

export function ProviderSettingsView() {
  const router = useRouter();

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      {/* Conteúdo Principal */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <ProviderSettingsHeader onBack={() => router.back()} />
        <ProviderThemeCard />
        <ProviderPasswordCard />
        <ProviderNotificationsSettingsCard />
        <ProviderStoreCard />
        <ProviderDeleteAccountCard />
      </main>
    </div>
  );
}
