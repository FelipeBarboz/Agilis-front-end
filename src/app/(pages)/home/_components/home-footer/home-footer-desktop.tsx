import Link from "next/link";

export function HomeFooterDesktop() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 text-xs text-gray-400 font-medium">
      <p>© Copyright {year} – Agilis Services – Todos os direitos reservados</p>
      <nav className="flex gap-6">
        <Link
          href="/terms"
          className="text-gray-400 transition-colors hover:text-gray-600 hover:underline"
        >
          Termos de Uso
        </Link>
        <Link
          href="/privacy"
          className="text-gray-400 transition-colors hover:text-gray-600 hover:underline"
        >
          Política de Privacidade
        </Link>
      </nav>
    </footer>
  );
}