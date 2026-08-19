"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PositionsList } from "./_components/positions-list";

export default function StorePositionsPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-6 bg-white p-6 sm:p-10 rounded-3xl shadow-xs border border-border">
          
          {/* Top Bar / Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              href="/store/store-profile"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Voltar ao Perfil da Loja</span>
            </Link>

            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Cargos & Estrutura
            </span>
          </div>

          <div className="w-full h-px bg-border my-1" />

          {/* Positions List */}
          <PositionsList />

        </div>
      </main>
    </div>
  );
}
