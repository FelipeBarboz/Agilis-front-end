"use client";

import Image from "next/image";
import { useState } from "react";
import { signInWithGoogle } from "@/lib/auth/auth-service";

interface GoogleButtonProps {
  redirect?: string;
  className?: string;
}

export function GoogleButton({ redirect, className }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle(redirect);
      if (error) {
        console.error("[Google OAuth Error]:", error);
        alert(error.message || "Erro ao conectar com Google");
      }
    } catch (err) {
      console.error("[Google OAuth Exception]:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 ${
        className ?? ""
      }`}
    >
      <Image
        src="https://www.google.com/favicon.ico"
        alt="Google"
        width={18}
        height={18}
        className="object-contain"
      />
      {loading ? "Conectando..." : "Continuar com o Google"}
    </button>
  );
}