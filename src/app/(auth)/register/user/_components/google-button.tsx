import Image from "next/image";

export function GoogleButton() {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      <Image
        src="https://www.google.com/favicon.ico"
        alt="Google"
        width={18}
        height={18}
        className="object-contain"
      />
      Continuar com o Google
    </button>
  );
}