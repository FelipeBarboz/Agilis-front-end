"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/auth/auth-service";
import { Loader2 } from "lucide-react";

interface GoogleButtonProps {
  redirect?: string;
  className?: string;
  text?: string;
  onError?: (error: Error) => void;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function GoogleButton({
  redirect,
  className,
  text = "Continuar com o Google",
  onError,
}: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle(redirect);
      if (error) {
        console.error("[Google OAuth Error]:", error);
        if (onError) {
          onError(error);
        } else {
          alert(error.message || "Erro ao conectar com Google");
        }
      }
    } catch (err: unknown) {
      console.error("[Google OAuth Exception]:", err);
      const errorObj =
        err instanceof Error
          ? err
          : new Error("Erro inesperado ao conectar com Google");
      if (onError) {
        onError(errorObj);
      } else {
        alert(errorObj.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={text}
      className={`flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${
        className ?? ""
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
          <span>Conectando...</span>
        </>
      ) : (
        <>
          <GoogleIcon className="shrink-0" />
          <span>{text}</span>
        </>
      )}
    </button>
  );
}