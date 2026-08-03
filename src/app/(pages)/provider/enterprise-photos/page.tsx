import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EnterprisePhotosForm } from "./_components/enterprise-photos-form";

export default function EnterprisePhotosPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-primary text-primary-foreground shadow-sm">
        <div className="flex h-16 w-full items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-4">
            <Link
              href="/provider"
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="size-5" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/img/logo-opened.png"
              alt="Agilis"
              width={80}
              height={32}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <h2 className="text-2xl font-bold md:text-3xl">
            Mostre o seu trabalho
          </h2>

          {/* Form Card */}
          <div className="overflow-hidden rounded-3xl bg-primary shadow-xl">
            <div className="p-6 md:p-10">
              <EnterprisePhotosForm />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-primary py-4 text-center text-xs text-primary-foreground/80">
        <p className="font-medium">
          © Copyright 2026 - Agilis Services - Todos os direitos reservados
        </p>
        <div className="mt-1 flex justify-center gap-6">
          <Link href="/terms" className="underline underline-offset-2 hover:text-primary-foreground">
            Termos de Uso
          </Link>
          <Link href="/privacy" className="underline underline-offset-2 hover:text-primary-foreground">
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </div>
  );
}
