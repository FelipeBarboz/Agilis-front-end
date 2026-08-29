"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Key, 
  Moon, 
  Sun, 
  Laptop, 
  Bell, 
  Trash2, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  AlertTriangle,
  MessageSquare,
  Smartphone,
  Mail,
  CheckCircle2,
  Save,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileSettingsView() {
  const router = useRouter();

  // ==================== TEMA ====================
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  useEffect(() => {
    // Ler tema salvo ou do sistema ao carregar
    const savedTheme = localStorage.getItem("agilis-theme") as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("agilis-theme", newTheme);

    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  // ==================== SENHA ====================
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

  const handleUpdatePassword = (e: React.FormEvent) => {
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

  // ==================== NOTIFICAÇÕES ====================
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [serviceStatus, setServiceStatus] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  const handleSaveNotifications = () => {
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 3000);
  };

  // ==================== EXCLUIR CONTA ====================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleConfirmDelete = () => {
    if (deleteConfirmation === "EXCLUIR") {
      setIsDeleteModalOpen(false);
      router.push("/login");
    }
  };

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      {/* Botão de voltar flutuante */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white dark:hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Configurações</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Gerencie tema, senha de acesso, preferências de notificações e sua conta
          </p>
        </div>

        {/* Card 1: Tema da Aplicação */}
        <div className="flex flex-col gap-5 rounded-3xl border border-border bg-white dark:bg-card p-5 shadow-sm sm:p-8">
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
              onClick={() => applyTheme("light")}
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
              onClick={() => applyTheme("dark")}
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
              onClick={() => applyTheme("system")}
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

        {/* Card 2: Alterar Senha */}
        <div className="flex flex-col gap-5 rounded-3xl border border-border bg-white dark:bg-card p-5 shadow-sm sm:p-8">
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
              <span className="hidden sm:inline">{showPasswords ? "Ocultar" : "Mostrar"}</span>
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
                  <span className={`font-bold ${
                    strength <= 25 ? "text-destructive" : strength <= 50 ? "text-amber-500" : "text-emerald-600"
                  }`}>
                    {strength <= 25 ? "Fraca" : strength <= 50 ? "Média" : strength <= 75 ? "Boa" : "Excelente"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength <= 25 ? "bg-destructive" : strength <= 50 ? "bg-amber-500" : "bg-emerald-600"
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

        {/* Card 3: Configurar Notificações */}
        <div className="flex flex-col gap-5 rounded-3xl border border-border bg-white dark:bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Configurar Notificações</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Escolha os canais e tipos de avisos que você deseja receber
                </p>
              </div>
            </div>

            {notificationsSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                <Check className="size-3.5" /> Salvo
              </span>
            )}
          </div>

          {/* Canais */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Canais de Envio</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => {
                  setNotifyWhatsapp(!notifyWhatsapp);
                  handleSaveNotifications();
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  notifyWhatsapp ? "border-primary bg-primary/5 shadow-xs" : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="size-4 text-emerald-600" />
                  <span className="text-xs font-bold text-foreground">WhatsApp</span>
                </div>
                <div className={`size-4 rounded-full border flex items-center justify-center ${
                  notifyWhatsapp ? "bg-primary border-primary text-white" : "border-input"
                }`}>
                  {notifyWhatsapp && <Check className="size-2.5" strokeWidth={3} />}
                </div>
              </div>

              <div
                onClick={() => {
                  setNotifyPush(!notifyPush);
                  handleSaveNotifications();
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  notifyPush ? "border-primary bg-primary/5 shadow-xs" : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="size-4 text-blue-600" />
                  <span className="text-xs font-bold text-foreground">Na sua conta</span>
                </div>
                <div className={`size-4 rounded-full border flex items-center justify-center ${
                  notifyPush ? "bg-primary border-primary text-white" : "border-input"
                }`}>
                  {notifyPush && <Check className="size-2.5" strokeWidth={3} />}
                </div>
              </div>

              <div
                onClick={() => {
                  setNotifyEmail(!notifyEmail);
                  handleSaveNotifications();
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  notifyEmail ? "border-primary bg-primary/5 shadow-xs" : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="size-4 text-indigo-600" />
                  <span className="text-xs font-bold text-foreground">E-mail</span>
                </div>
                <div className={`size-4 rounded-full border flex items-center justify-center ${
                  notifyEmail ? "bg-primary border-primary text-white" : "border-input"
                }`}>
                  {notifyEmail && <Check className="size-2.5" strokeWidth={3} />}
                </div>
              </div>
            </div>
          </div>

          {/* Tipos de Alerta */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tipos de Alerta</span>

            <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
              <div 
                onClick={() => {
                  setReminders(!reminders);
                  handleSaveNotifications();
                }}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-bold text-foreground">Lembretes de Agendamento (24h e 2h antes)</span>
                  <span className="text-[11px] text-muted-foreground">
                    Avisos prévios sobre o horário marcado e profissional designado.
                  </span>
                </div>
                <div className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                  reminders ? "bg-primary" : "bg-muted"
                }`}>
                  <div className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                    reminders ? "translate-x-5" : "translate-x-0"
                  }`} />
                </div>
              </div>

              <div 
                onClick={() => {
                  setServiceStatus(!serviceStatus);
                  handleSaveNotifications();
                }}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-bold text-foreground">Status do Serviço em Tempo Real</span>
                  <span className="text-[11px] text-muted-foreground">
                    Alertas de deslocamento: &ldquo;Prestador a caminho&rdquo; e &ldquo;Chegou ao local&rdquo;.
                  </span>
                </div>
                <div className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                  serviceStatus ? "bg-primary" : "bg-muted"
                }`}>
                  <div className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                    serviceStatus ? "translate-x-5" : "translate-x-0"
                  }`} />
                </div>
              </div>

              <div 
                onClick={() => {
                  setPromotions(!promotions);
                  handleSaveNotifications();
                }}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-bold text-foreground">Cupons de Desconto e Promoções</span>
                  <span className="text-[11px] text-muted-foreground">
                    Ofertas sazonais e cupons exclusivos para novos serviços.
                  </span>
                </div>
                <div className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                  promotions ? "bg-primary" : "bg-muted"
                }`}>
                  <div className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                    promotions ? "translate-x-5" : "translate-x-0"
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Excluir Conta */}
        <div className="flex flex-col gap-4 rounded-3xl border border-destructive/30 bg-destructive/5 p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 text-destructive">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <Trash2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Excluir Conta</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Encerramento permanente do seu cadastro no Agilis
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Ao excluir sua conta, todos os seus dados pessoais, histórico de agendamentos, avaliações e cupons serão apagados permanentemente. Esta ação não poderá ser desfeita.
          </p>

          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              className="rounded-xl text-xs font-bold px-4 py-2 cursor-pointer shadow-xs"
            >
              Excluir minha conta
            </Button>
          </div>
        </div>

      </main>

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-white dark:bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h4 className="text-base font-bold">Tem certeza que deseja excluir?</h4>
                <p className="text-xs text-muted-foreground">Esta ação é irreversível.</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Para confirmar a exclusão da sua conta, digite <strong className="text-foreground">EXCLUIR</strong> no campo abaixo:
            </p>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Digite EXCLUIR"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-destructive/20 font-bold"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmation("");
                }}
                className="rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deleteConfirmation !== "EXCLUIR"}
                onClick={handleConfirmDelete}
                className="rounded-xl text-xs font-bold cursor-pointer disabled:opacity-40"
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
