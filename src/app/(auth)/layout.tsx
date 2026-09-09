import { type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-secondary">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-brand-green-dark">
        <Link
          href="/home"
          aria-label="Voltar para home"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
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

      {children}

    </div>
  );
}