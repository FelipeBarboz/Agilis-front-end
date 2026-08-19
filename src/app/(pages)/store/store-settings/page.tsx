"use client";

import { SettingsForm } from "./_components/settings-form";

export default function StoreSettingsPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-6 bg-white p-6 sm:p-10 rounded-3xl shadow-xs border border-border">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Configurações
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                Perfil da Loja
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Atualize as informações públicas, logotipo e canais de contato da sua loja no Agilis.
              </p>
            </div>
          </div>
          
          <div className="w-full h-px bg-border my-2" />

          {/* Form */}
          <SettingsForm />

        </div>
      </main>
    </div>
  );
}

