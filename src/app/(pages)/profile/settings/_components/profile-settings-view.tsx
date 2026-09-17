"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SettingsHeader } from "./changes/settings-header";
import { ThemeSettingsCard } from "./changes/theme-settings-card";
import { ChangePasswordCard } from "./changes/change-password-card";
import { NotificationSettingsCard } from "./changes/notification-settings-card";
import { ProviderNotificationsCard } from "./changes/provider-notifications-card";
import { StoreSettingsCard } from "./store-settings-card";
import { DeleteAccountCard } from "./delete/delete-account-card";

export function ProfileSettingsView() {
  const router = useRouter();

  const [isProvider, setIsProvider] = useState(false);
  const [hasActiveStore, setHasActiveStore] = useState(false);

  useEffect(() => {
    const storedCnpj = localStorage.getItem("provider_cnpj");
    const providerFlag = localStorage.getItem("is_provider");
    const storeFlag = localStorage.getItem("has_active_store");

    setIsProvider(Boolean(storedCnpj || providerFlag === "true"));
    setHasActiveStore(storeFlag === "true");
  }, []);

  return (
    <div className="relative flex flex-col bg-muted pb-20">
      {/* Conteúdo Principal */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <SettingsHeader onBack={() => router.back()} />
        <ThemeSettingsCard />
        <ChangePasswordCard />
        <NotificationSettingsCard />
        {isProvider && <ProviderNotificationsCard />}
        {isProvider && hasActiveStore && <StoreSettingsCard />}
        <DeleteAccountCard />
      </main>
    </div>
  );
}
