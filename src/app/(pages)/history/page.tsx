import { Clock } from "lucide-react";
import { HistorySection } from "./_components/history-section";
import { PageTransition } from "@/components/ui/motion";

export default async function HistoryPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto bg-muted p-4 sm:p-6 lg:p-8">
      <PageTransition className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Header da página */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Acompanhe os serviços que você contratou ou prestou
              </p>
            </div>
          </div>
        </div>

        <HistorySection />
      </PageTransition>
    </main>
  );
}
