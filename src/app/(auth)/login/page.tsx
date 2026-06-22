// src/app/auth/login/page.tsx
import Link from "next/link";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-brand-green-dark px-6 pb-32 pt-6 text-center">
        <h1 className="text-xl font-bold text-primary-foreground">
          Bem-vindo de volta
        </h1>
      </div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-md px-6">
        <div className="-mt-24 rounded-2xl bg-primary p-6 shadow-lg">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-sm text-muted-foreground">
        Não possui uma conta?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Cadastre-se
        </Link>
      </div>
    </>
  );
}