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
import { getMyStores } from "@/lib/services/stores-service";

export function ProfileSettingsView() {
  const router = useRouter();

  const [isProvider, setIsProvider] = useState(false);
  const [hasActiveStore, setHasActiveStore] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadStoreRole() {
      try {
        const myStores = await getMyStores();
        if (isCancelled) return;
        const hasStore = Array.isArray(myStores) && myStores.length > 0;
        setHasActiveStore(hasStore);
        setIsProvider(hasStore);
      } catch {
        if (!isCancelled) {
          setHasActiveStore(false);
          setIsProvider(false);
        }
      }
    }

    void loadStoreRole();
    return () => {
      isCancelled = true;
    };
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
