import Link from "next/link";

export function HomeFooterDesktop() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-between border-t border-primary/20 bg-primary px-6 py-4 text-xs text-primary-foreground font-medium">
      <p>© Copyright {year} – Agilis Services – Todos os direitos reservados</p>
      <nav className="flex gap-6">
        <Link
          href="/terms"
          className="text-primary-foreground/90 transition-colors hover:text-primary-foreground hover:underline"
        >
          Termos de Uso
        </Link>
        <Link
          href="/privacy"
          className="text-primary-foreground/90 transition-colors hover:text-primary-foreground hover:underline"
        >
          Política de Privacidade
        </Link>
      </nav>
    </footer>
  );
}