import { DocumentForm } from "./_components/document-form";
import { PageTransition } from "@/components/ui/motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function DocumentPage() {
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
          Qual é o documento do titular da conta?
        </h1>
      </div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-md px-6">
        <PageTransition className="-mt-16 flex flex-col items-center gap-6">
          <DocumentForm />
        </PageTransition>
      </div>
    </div>
  );
}