import { Suspense } from "react";
import { RefundConfirmationForm } from "./_components/refund-confirmation-form";
import { PageTransition } from "@/components/ui/motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function RefundConfirmationPage() {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="flex items-center justify-between bg-brand-green-dark px-6 py-4">
        <Link
          href="/history"
          aria-label="Voltar ao histórico"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </Link>
        <Image
          src="/img/logo-opened.png"
          alt="Agilis"
          width={80}
          height={32}
          className="object-contain"
          priority
        />
      </header>

      {/* Hero section */}
      <div className="bg-brand-green-dark px-6 pb-28 pt-10 text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Cancelamento e Reembolso
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
          Revise os detalhes do cancelamento do serviço e a solicitação do seu reembolso.
        </p>
      </div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-lg px-4 pb-12 sm:px-6">
        <PageTransition className="-mt-16 flex flex-col items-center gap-6">
          <Suspense
            fallback={
              <div className="flex w-full items-center justify-center rounded-2xl bg-background p-12 shadow-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Carregando informações...</p>
                </div>
              </div>
            }
          >
            <RefundConfirmationForm />
          </Suspense>
        </PageTransition>
      </div>
    </div>
  );
}
