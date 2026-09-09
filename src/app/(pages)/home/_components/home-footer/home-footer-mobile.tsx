import Link from "next/link";

export function HomeFooterMobile() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-between border-t border-border bg-background px-6 py-4 text-xs text-muted-foreground">
      <p>© Copyright {year} – Agilis Services – Todos os direitos reservados</p>
      <nav className="flex gap-6">
        <Link href="/terms" className="hover:text-foreground hover:underline">
          Termos de Uso
        </Link>
        <Link href="/privacy" className="hover:text-foreground hover:underline">
          Política de Privacidade
        </Link>
      </nav>
    </footer>
  );
}