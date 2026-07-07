import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { HistorySection } from "./_components/history-section";

export default async function HistoryPage() {
  const supabase = await createClient();

  // getUser() revalida o token direto com o Supabase Auth,
  // por isso é mais seguro que getSession() para checagens server-side.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/register");
  }

  return (
    <main className="flex flex-1 flex-col gap-8 overflow-y-auto bg-muted p-6">

      {/* Header da página */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acompanhe os serviços que você contratou ou prestou
        </p>
      </div>

      <HistorySection />

    </main>
  );
}
