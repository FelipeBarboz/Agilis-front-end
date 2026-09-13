"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (/[A-Z]/.test(newPassword)) score += 25;
    if (/[0-9]/.test(newPassword)) score += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();

  const handleUpdatePassword = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordFeedback(null);

    if (!currentPassword) {
      setPasswordError("Informe sua senha atual.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("A confirmação de senha não confere.");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordFeedback("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordFeedback(null), 4000);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Key className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Alterar Senha</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Atualize sua senha de acesso para manter sua conta protegida
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPasswords(!showPasswords)}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {showPasswords ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          <span className="hidden sm:inline">
            {showPasswords ? "Ocultar" : "Mostrar"}
          </span>
        </button>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
        {passwordFeedback && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{passwordFeedback}</span>
          </div>
        )}

        {passwordError && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-foreground">Senha Atual</label>
          <input
            type={showPasswords ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">Nova Senha</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo de 8 caracteres"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">Confirmar Nova Senha</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {newPassword.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Força da nova senha:</span>
              <span
                className={`font-bold ${
                  strength <= 25
                    ? "text-destructive"
                    : strength <= 50
                    ? "text-amber-500"
                    : "text-emerald-600"
                }`}
              >
                {strength <= 25
                  ? "Fraca"
                  : strength <= 50
                  ? "Média"
                  : strength <= 75
                  ? "Boa"
                  : "Excelente"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  strength <= 25
                    ? "bg-destructive"
                    : strength <= 50
                    ? "bg-amber-500"
                    : "bg-emerald-600"
                }`}
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isUpdatingPassword}
            className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
          >
            {isUpdatingPassword ? "Atualizando..." : "Salvar nova senha"}
          </Button>
        </div>
      </form>
    </div>
  );
}
