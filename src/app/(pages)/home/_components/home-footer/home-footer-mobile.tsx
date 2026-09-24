import Link from "next/link";

export function HomeFooterMobile() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#005b31] py-3.5 px-4 text-center text-white">
      {/* Copyright text */}
      <p className="text-[10px] sm:text-xs font-normal text-white/90 leading-tight">
        © Copyright {year} - Agilis Services - Todos os direitos reservados
      </p>

      {/* Legal navigation links */}
      <nav className="mt-2 flex items-center justify-center gap-8 sm:gap-12">
        <Link
          href="/terms"
          className="text-[11px] sm:text-xs font-semibold text-white/95 transition-colors hover:text-white hover:underline"
        >
          Termos de Uso
        </Link>
        <Link
          href="/privacy"
          className="text-[11px] sm:text-xs font-semibold text-white/95 transition-colors hover:text-white hover:underline"
        >
          Política de Privacidade
        </Link>
      </nav>
    </footer>
  );
}