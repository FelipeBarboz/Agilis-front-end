import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  // Se backHref for fornecido, renderiza um <Link> de volta para esse href. Caso contrário, renderiza um <button> que chama onBack.
  backHref?: string;
  onBack?: () => void;
}

export function PageHeader({ backHref, onBack }: PageHeaderProps) {
  const backControl = backHref ? (
    <Link
      href={backHref}
      aria-label="Voltar"
      className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
    >
      <ArrowLeft size={20} />
    </Link>
  ) : (
    <button
      onClick={onBack}
      type="button"
      aria-label="Voltar"
      className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
    >
      <ArrowLeft size={24} />
    </button>
  );

  return (
    <header className="flex items-center justify-between bg-brand-green-dark px-6 py-4">
      {backControl}
      <Image
        src="/img/logo-opened.png"
        alt="Agilis"
        width={80}
        height={32}
        className="object-contain"
        priority
      />
    </header>
  );
}
