"use client";

import { useState } from "react";
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
  AlertTriangle,
  MessageSquare,
  Smartphone,
  Mail,
  CheckCircle2,
  Briefcase,
  CalendarCheck,
  DollarSign,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";

export function ProviderSettingsView() {
  const router = useRouter();

  // ==================== TEMA ====================
  const { theme, setTheme } = useTheme();

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

  // ==================== NOTIFICAÇÕES DE PRESTADOR ====================
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [newRequests, setNewRequests] = useState(true);
  const [scheduleAlerts, setScheduleAlerts] = useState(true);
  const [chatMessages, setChatMessages] = useState(true);
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
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      {/* Botão de voltar flutuante */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Configurações do Prestador</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Gerencie tema da interface, segurança da conta e preferências de atendimento
          </p>
        </div>

        {/* Card 1: Tema da Aplicação */}
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

        {/* Card 2: Alterar Senha */}
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
              <span className="hidden sm:inline">{showPasswords ? "Ocultar" : "Mostrar"}</span>
            </button>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
            {passwordFeedback && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
                    strength <= 25 ? "text-destructive" : strength <= 50 ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {strength <= 25 ? "Fraca" : strength <= 50 ? "Média" : strength <= 75 ? "Boa" : "Excelente"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength <= 25 ? "bg-destructive" : strength <= 50 ? "bg-amber-500" : "bg-emerald-600 dark:bg-emerald-500"
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
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUpdatingPassword ? "Atualizando..." : "Salvar nova senha"}
              </Button>
            </div>
          </form>
        </div>

        {/* Card 3: Notificações de Serviços e Clientes */}
        <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Alertas de Atendimento</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Escolha como deseja receber solicitações de novos clientes e mensagens
                </p>
              </div>
            </div>

            {notificationsSaved && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                <Check className="size-3.5" />
                <span>Salvo!</span>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Canais de envio</div>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
                notifyWhatsapp ? "border-primary/40 bg-primary/5" : "border-border bg-background opacity-70"
              }`}>
                <input
                  type="checkbox"
                  checked={notifyWhatsapp}
                  onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                  className="size-4 rounded-md accent-primary"
                />
                <div className="flex items-center gap-2">
                  <Smartphone className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-foreground">WhatsApp</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
                notifyPush ? "border-primary/40 bg-primary/5" : "border-border bg-background opacity-70"
              }`}>
                <input
                  type="checkbox"
                  checked={notifyPush}
                  onChange={(e) => setNotifyPush(e.target.checked)}
                  className="size-4 rounded-md accent-primary"
                />
                <div className="flex items-center gap-2">
                  <Bell className="size-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">Push App</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
                notifyEmail ? "border-primary/40 bg-primary/5" : "border-border bg-background opacity-70"
              }`}>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="size-4 rounded-md accent-primary"
                />
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">E-mail</span>
                </div>
              </label>
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-2">Tipos de alerta</div>

            <div className="flex flex-col gap-2.5">
              <label className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Briefcase className="size-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Novos pedidos de serviço</span>
                    <span className="text-[11px] text-muted-foreground">Receba alertas quando um cliente solicitar um serviço</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newRequests}
                  onChange={(e) => setNewRequests(e.target.checked)}
                  className="size-4 rounded-md accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="size-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Lembretes de agendamentos</span>
                    <span className="text-[11px] text-muted-foreground">Avisos antes do horário do atendimento</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={scheduleAlerts}
                  onChange={(e) => setScheduleAlerts(e.target.checked)}
                  className="size-4 rounded-md accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <MessageSquare className="size-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Mensagens no chat corporativo</span>
                    <span className="text-[11px] text-muted-foreground">Notificações de novas mensagens diretas de clientes</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={chatMessages}
                  onChange={(e) => setChatMessages(e.target.checked)}
                  className="size-4 rounded-md accent-primary cursor-pointer"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleSaveNotifications}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                Salvar preferências
              </Button>
            </div>
          </div>
        </div>

        {/* Card 4: Área da Loja & Perfil da Empresa */}
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Loja & Empresa</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Acesse o gerenciamento avançado da sua loja, equipe e horários
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto rounded-xl border-border hover:bg-muted text-foreground"
            >
              <a href="/store/store-profile">
                Ir para Perfil da Loja
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto rounded-xl border-border hover:bg-muted text-foreground"
            >
              <a href="/store/store-settings">
                Configurações da Empresa
              </a>
            </Button>
          </div>
        </div>

        {/* Card 5: Zona de Perigo */}
        <div className="flex flex-col gap-5 rounded-3xl border border-destructive/20 bg-destructive/5 p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-destructive">Zona de Perigo</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Ações irreversíveis relacionadas à sua conta de prestador
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-destructive/20 bg-card p-4">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Encerrar conta de prestador</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                Seus serviços cadastrados e dados de prestador serão permanentemente excluídos
              </span>
            </div>
            <Button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="shrink-0 rounded-xl bg-destructive px-4 py-2 text-xs font-bold text-white hover:bg-destructive/90 transition-all cursor-pointer"
            >
              Excluir conta
            </Button>
          </div>
        </div>

      </main>

      {/* Modal de Exclusão de Conta */}
      {isDeleteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div 
            className="w-full max-w-md rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-border flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-destructive">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Excluir Conta</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Esta ação é irreversível.</p>
              </div>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              Para confirmar a exclusão da sua conta e de todos os serviços cadastrados, digite <strong className="text-destructive">EXCLUIR</strong> no campo abaixo:
            </p>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Digite EXCLUIR"
              className="w-full rounded-xl border border-destructive/30 bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-destructive focus:outline-none focus:ring-2 focus:ring-destructive/20 uppercase"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold border-border hover:bg-muted"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={deleteConfirmation !== "EXCLUIR"}
                onClick={handleConfirmDelete}
                className="rounded-xl px-5 py-2 text-xs font-semibold bg-destructive text-white hover:bg-destructive/90 transition-colors disabled:opacity-40"
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
