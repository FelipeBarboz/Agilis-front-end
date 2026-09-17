import Link from "next/link";

export function HomeFooterMobile() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center justify-center gap-2 border-t border-primary/20 bg-primary px-6 py-4 text-center text-xs text-primary-foreground font-medium">
      <p>© Copyright {year} – Agilis Services – Todos os direitos reservados</p>
      <nav className="flex gap-4">
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