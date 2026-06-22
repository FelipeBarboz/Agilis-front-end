import Link from "next/link";
import { RegisterForm } from "./_components/register-form";

export default function RegisterPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-brand-green-dark px-6 pb-32 pt-6 text-center">
        <h1 className="text-xl font-bold text-primary-foreground">
          Crie sua conta e agilize
          <br />
          sua vida
        </h1>
      </div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-md px-6">
        <div className="-mt-24 rounded-2xl bg-primary p-6 shadow-lg">
          <RegisterForm />
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-sm text-muted-foreground">
        Já possui uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Entrar
        </Link>
      </div>
    </>
  );
}