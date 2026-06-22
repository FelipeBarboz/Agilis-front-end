"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "../../register/_components/google-button";
import { loginSchema, type LoginFormData } from "@/lib/validations/login";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    resolver: zodResolver(loginSchema) as Resolver<LoginFormData>,
  });

  async function onSubmit(data: LoginFormData) {
    // TODO: integrar com backend
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Google */}
      <GoogleButton />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/30" />
        <span className="text-xs text-white/70">Ou Digite seu e-mail</span>
        <div className="h-px flex-1 bg-white/30" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

        {/* E-mail */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-white">E-mail</label>
          <Input
            type="email"
            autoComplete="email"
            className="border-white/20 bg-white text-foreground"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-200">{errors.email.message}</p>
          )}
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-white">Senha</label>
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="border-white/20 bg-white text-foreground"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-200">{errors.password.message}</p>
          )}
        </div>

        {/* Esqueci a senha */}
        <div className="flex justify-end">
            
            <a href="/auth/forgot-password"
            className="text-xs text-white/70 hover:text-white hover:underline"
            >
            Esqueci minha senha
          </a>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="mt-1 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Aguarde..." : "Entrar"}
        </Button>

      </form>
    </div>
  );
}