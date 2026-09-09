import { PreferredNameForm } from "./_components/preferred-name-form";
import { PageTransition } from "@/components/ui/motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function PreferredNamePage() {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="flex items-center justify-between bg-brand-green-dark px-6 py-4">
        <Link
          href="/profile"
          aria-label="Voltar"
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
      <div className="bg-brand-green-dark px-6 pb-32 pt-10 text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Como você quer que te chamemos
        </h1>
        <div className="mx-auto mt-4 max-w-md flex flex-col gap-2 text-sm text-white/80">
          <p>
            O nome que você escolher será exibido para todas as pessoas que
            interagirem com você no Agilis.
          </p>
          <p>
            O nome que consta no seu documento de identidade será usado
            apenas por questões legais, caso necessário.
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-md px-6">
        <PageTransition className="-mt-16 flex flex-col items-center gap-6">
          <PreferredNameForm />
        </PageTransition>
      </div>
    </div>
  );
}