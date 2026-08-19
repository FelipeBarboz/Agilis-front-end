"use client";

import { SchedulingList } from "./_components/scheduling-list";

export default function StoreSchedulingPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 mx-auto w-full max-w-4xl space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold md:text-3xl text-foreground">Agendamentos</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Visualize os próximos serviços e os funcionários responsáveis.
          </p>
        </div>

        {/* Conteúdo principal */}
        <div className="rounded-2xl border bg-white p-5 sm:p-8 shadow-sm">
          <SchedulingList />
        </div>

      </main>
    </div>
  );
}

