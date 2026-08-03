"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ─── Chat Header ─────────────────────────────────────────────────────────────

export function ChatHeader() {
  return (
    <header className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
      <Link
        href="/home"
        aria-label="Voltar"
        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
      >
        <ArrowLeft size={20} />
      </Link>
      <span className="text-base font-semibold">Chats</span>
    </header>
  );
}
