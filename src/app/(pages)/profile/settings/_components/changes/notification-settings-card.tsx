"use client";

import { useState } from "react";
import { Bell, Check, Mail, MessageSquare } from "lucide-react";

export function NotificationSettingsCard() {
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

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Configurar Notificações
            </h2>
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
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Canais de Envio
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => {
              setNotifyWhatsapp(!notifyWhatsapp);
              handleSaveNotifications();
            }}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
              notifyWhatsapp
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-border bg-background"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="size-4 text-emerald-600" />
              <span className="text-xs font-bold text-foreground">WhatsApp</span>
            </div>
            <div
              className={`size-4 rounded-full border flex items-center justify-center ${
                notifyWhatsapp
                  ? "bg-primary border-primary text-white"
                  : "border-input"
              }`}
            >
              {notifyWhatsapp && <Check className="size-2.5" strokeWidth={3} />}
            </div>
          </div>

          <div
            onClick={() => {
              setNotifyPush(!notifyPush);
              handleSaveNotifications();
            }}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
              notifyPush
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-border bg-background"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="size-4 text-blue-600" />
              <span className="text-xs font-bold text-foreground">Na sua conta</span>
            </div>
            <div
              className={`size-4 rounded-full border flex items-center justify-center ${
                notifyPush
                  ? "bg-primary border-primary text-white"
                  : "border-input"
              }`}
            >
              {notifyPush && <Check className="size-2.5" strokeWidth={3} />}
            </div>
          </div>

          <div
            onClick={() => {
              setNotifyEmail(!notifyEmail);
              handleSaveNotifications();
            }}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
              notifyEmail
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-border bg-background"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 text-indigo-600" />
              <span className="text-xs font-bold text-foreground">E-mail</span>
            </div>
            <div
              className={`size-4 rounded-full border flex items-center justify-center ${
                notifyEmail
                  ? "bg-primary border-primary text-white"
                  : "border-input"
              }`}
            >
              {notifyEmail && <Check className="size-2.5" strokeWidth={3} />}
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Alerta */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Tipos de Alerta
        </span>

        <div className="divide-y divide-border rounded-2xl border border-border bg-background overflow-hidden">
          <div
            onClick={() => {
              setReminders(!reminders);
              handleSaveNotifications();
            }}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <div className="flex flex-col pr-4">
              <span className="text-xs font-bold text-foreground">
                Lembretes de Agendamento (24h e 2h antes)
              </span>
              <span className="text-[11px] text-muted-foreground">
                Avisos prévios sobre o horário marcado e profissional designado.
              </span>
            </div>
            <div
              className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                reminders ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                  reminders ? "translate-x-5" : "translate-x-0"
                }`}
              />
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
              <span className="text-xs font-bold text-foreground">
                Status do Serviço em Tempo Real
              </span>
              <span className="text-[11px] text-muted-foreground">
                Alertas de deslocamento: &ldquo;Prestador a caminho&rdquo; e &ldquo;Chegou ao local&rdquo;.
              </span>
            </div>
            <div
              className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                serviceStatus ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                  serviceStatus ? "translate-x-5" : "translate-x-0"
                }`}
              />
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
              <span className="text-xs font-bold text-foreground">
                Cupons de Desconto e Promoções
              </span>
              <span className="text-[11px] text-muted-foreground">
                Ofertas sazonais e cupons exclusivos para novos serviços.
              </span>
            </div>
            <div
              className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                promotions ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                  promotions ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
