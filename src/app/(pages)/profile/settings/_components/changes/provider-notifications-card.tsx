"use client";

import { useState } from "react";
import { Briefcase, CalendarCheck, Check, MessageSquare } from "lucide-react";

export function ProviderNotificationsCard() {
  const [newRequests, setNewRequests] = useState(true);
  const [scheduleAlerts, setScheduleAlerts] = useState(true);
  const [chatMessages, setChatMessages] = useState(true);
  const [providerNotificationsSaved, setProviderNotificationsSaved] =
    useState(false);

  const handleSaveProviderNotifications = () => {
    setProviderNotificationsSaved(true);
    setTimeout(() => setProviderNotificationsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-primary/20 bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Briefcase className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                Alertas de Atendimento (Prestador)
              </h2>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Prestador Ativo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Receba novos pedidos de clientes, alertas de horários e mensagens de trabalho
            </p>
          </div>
        </div>

        {providerNotificationsSaved && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
            <Check className="size-3.5" />
            <span>Salvo!</span>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-1">
        <div className="divide-y divide-border rounded-2xl border border-border bg-background overflow-hidden">
          <div
            onClick={() => {
              setNewRequests(!newRequests);
              handleSaveProviderNotifications();
            }}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3 pr-4">
              <Briefcase className="size-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">
                  Novos pedidos de serviço
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Alertas quando um cliente solicitar um serviço seu
                </span>
              </div>
            </div>
            <div
              className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                newRequests ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                  newRequests ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div
            onClick={() => {
              setScheduleAlerts(!scheduleAlerts);
              handleSaveProviderNotifications();
            }}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3 pr-4">
              <CalendarCheck className="size-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">
                  Lembretes de agendamentos
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Avisos prévios de horários marcados com clientes
                </span>
              </div>
            </div>
            <div
              className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                scheduleAlerts ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                  scheduleAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          <div
            onClick={() => {
              setChatMessages(!chatMessages);
              handleSaveProviderNotifications();
            }}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3 pr-4">
              <MessageSquare className="size-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">
                  Mensagens no chat corporativo
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Novas mensagens diretas de clientes no chat corporativo
                </span>
              </div>
            </div>
            <div
              className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                chatMessages ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                  chatMessages ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
