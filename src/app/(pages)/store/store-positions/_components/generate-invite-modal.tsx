"use client";

import { useState } from "react";
import { Link2, Copy, Check, Shield, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Position } from "@/lib/mocks/positions";
import { mockInviteLinks } from "@/lib/mocks/invites";

interface GenerateInviteModalProps {
  position: Position | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GenerateInviteModal({ position, isOpen, onClose }: GenerateInviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !position) return null;

  // Encontra ou gera um token para esta posição
  const existingInvite = mockInviteLinks.find((i) => i.positionId === position.id);
  const token = existingInvite ? existingInvite.token : `inv-${position.id}-${Date.now().toString(36)}`;
  
  // Link completo ou token
  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/invite/${token}`
    : `https://agilis.com.br/invite/${token}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback manual
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Link2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Gerar Link de Convite</h2>
              <p className="text-xs text-muted-foreground">Cargo: {position.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="my-5 flex flex-col gap-4">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-foreground leading-relaxed space-y-1">
                <p className="font-semibold text-primary">Como funciona este convite?</p>
                <p className="text-muted-foreground">
                  1. O candidato cola este link na tela de <strong>Lojas</strong> da conta dele.
                </p>
                <p className="text-muted-foreground">
                  2. Um e-mail de confirmação é enviado para você (provedor) autorizar o acesso.
                </p>
                <p className="text-muted-foreground">
                  3. Após a confirmação, a tela da loja aparecerá para ele com as permissões de <strong>{position.title}</strong>.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Link de Convite do Cargo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-xs font-mono text-foreground focus:outline-none select-all"
              />
              <Button
                type="button"
                onClick={handleCopy}
                className="gap-2 rounded-xl shrink-0 cursor-pointer text-xs font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="size-4 text-emerald-300" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    <span>Copiar</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Permissões concedidas pelo cargo */}
          <div className="rounded-2xl border border-border bg-muted/30 p-3.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Permissões que o convidado terá:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {position.permissions.map((permId) => (
                <span
                  key={permId}
                  className="inline-flex items-center gap-1 rounded-md bg-card border border-border px-2 py-1 text-xs text-foreground"
                >
                  <Shield className="size-3 text-primary" />
                  {permId === "manage_appointments" && "Gerenciar atendimentos"}
                  {permId === "access_chats" && "Acessar chats"}
                  {permId === "access_reports" && "Relatórios e métricas"}
                  {permId === "store_settings" && "Configurações da loja"}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-border hover:bg-muted text-xs cursor-pointer"
          >
            Fechar
          </Button>
        </div>

      </div>
    </div>
  );
}
