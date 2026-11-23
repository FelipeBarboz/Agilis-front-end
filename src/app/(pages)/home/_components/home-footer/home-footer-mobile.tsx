import Link from "next/link";

export function HomeFooterMobile() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 py-3.5 px-4 text-center">
      {/* Copyright text */}
      <p className="text-[10px] sm:text-xs font-normal text-gray-400 dark:text-zinc-500 leading-tight">
        © Copyright {year} - Agilis Services - Todos os direitos reservados
      </p>

      {/* Legal navigation links */}
      <nav className="mt-2 flex items-center justify-center gap-8 sm:gap-12">
        <Link
          href="/terms"
          className="text-[11px] sm:text-xs font-medium text-gray-400 dark:text-zinc-500 transition-colors hover:text-gray-600 dark:hover:text-zinc-300 hover:underline"
        >
          Termos de Uso
        </Link>
        <Link
          href="/privacy"
          className="text-[11px] sm:text-xs font-medium text-gray-400 dark:text-zinc-500 transition-colors hover:text-gray-600 dark:hover:text-zinc-300 hover:underline"
        >
          Política de Privacidade
        </Link>
      </nav>
    </footer>
  );
}