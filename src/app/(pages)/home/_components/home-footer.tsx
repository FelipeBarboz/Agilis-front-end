import Link from "next/link";

export function HomeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-between border-t border-[#E5E7EB] bg-white px-6 py-4 text-xs text-[#6B7280]">
      <p>© Copyright {year} – Agilis Services – Todos os direitos reservados</p>
      <nav className="flex gap-6">
        <Link href="/terms" className="hover:text-[#1A1A1A] hover:underline">
          Termos de Uso
        </Link>
        <Link href="/privacy" className="hover:text-[#1A1A1A] hover:underline">
          Política de Privacidade
        </Link>
      </nav>
    </footer>
  );
}
