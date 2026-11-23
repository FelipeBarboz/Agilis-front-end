"use client";

import Link from "next/link";
import {
  UserCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MyStore } from "@/lib/services/stores-service";

interface StoreCardItemProps {
  store: MyStore;
  isCurrent?: boolean;
  onSelectStore: (store: MyStore) => void;
}

export function StoreCardItem({
  store,
  isCurrent = false,
  onSelectStore,
}: StoreCardItemProps) {
  const isOwner =
    store.role?.toUpperCase() === "OWNER" ||
    store.role?.toLowerCase() === "proprietario" ||
    store.role?.toLowerCase() === "owner";

  const initials = (store.storeName || "Loja")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex flex-col justify-between gap-5 rounded-3xl border bg-card p-5 sm:p-6 shadow-xs transition-all ${
        isCurrent
          ? "border-primary bg-primary/[0.02] ring-2 ring-primary/20"
          : "border-border hover:border-primary/30"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Logo / Iniciais e dados */}
        <div className="flex items-start gap-4">
          {store.profileImgUrl ? (
            <img
              src={store.profileImgUrl}
              alt={store.storeName}
              className="size-14 shrink-0 rounded-2xl object-cover border border-border shadow-xs"
            />
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-xs">
              {initials}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                {store.storeName}
              </h3>

              {isOwner ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <ShieldCheck className="size-3.5" />
                  Proprietário
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                  <UserCheck className="size-3.5 text-primary" />
                  {store.role || "Funcionário"}
                </span>
              )}

              {isCurrent && (
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  Loja Atual
                </span>
              )}
            </div>

            {store.slug && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Store className="size-3 text-muted-foreground" />
                <span>agilis.com/{store.slug}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
        {store.storeId ? (
          <Link
            href={`/store-page?slug=${encodeURIComponent(store.slug || store.storeId)}&id=${encodeURIComponent(store.storeId)}`}
            className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1"
          >
            <span>Ver perfil público</span>
            <ExternalLink className="size-3" />
          </Link>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {isOwner ? (
            <Button
              onClick={() => onSelectStore(store)}
              className="gap-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <span>Acessar Painel da Loja</span>
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button
              onClick={() => onSelectStore(store)}
              className="gap-2 rounded-xl text-xs font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span>Acessar Área do Funcionário</span>
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
