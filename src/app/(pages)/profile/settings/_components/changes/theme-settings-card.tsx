"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export function ThemeSettingsCard() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sun className="size-5 dark:hidden" />
          <Moon className="size-5 hidden dark:block" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Tema e Aparência</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Escolha como deseja visualizar a interface do Agilis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-1">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all cursor-pointer ${
            theme === "light"
              ? "border-primary bg-primary/5 text-primary shadow-xs ring-2 ring-primary/20"
              : "border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Sun className="size-5" />
          <span className="text-xs font-bold">Claro</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all cursor-pointer ${
            theme === "dark"
              ? "border-primary bg-primary/5 text-primary shadow-xs ring-2 ring-primary/20"
              : "border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Moon className="size-5" />
          <span className="text-xs font-bold">Escuro</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all cursor-pointer ${
            theme === "system"
              ? "border-primary bg-primary/5 text-primary shadow-xs ring-2 ring-primary/20"
              : "border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Laptop className="size-5" />
          <span className="text-xs font-bold">Sistema</span>
        </button>
      </div>
    </div>
  );
}
