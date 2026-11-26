"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Webhook,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import {
  WEBHOOK_EVENT_TYPES,
  getStoreWebhooks,
  createStoreWebhook,
  deleteStoreWebhook,
  type StoreWebhookDTO,
} from "@/lib/services/webhooks-service";
import { getMyStores } from "@/lib/services/stores-service";

const EVENT_LABEL_MAP: Record<string, string> = Object.fromEntries(
  WEBHOOK_EVENT_TYPES.map((e) => [e.value, e.label])
);

export function WebhooksSettingsCard() {
  const searchParams = useSearchParams();
  const storeIdParam = searchParams.get("storeId");

  const [storeId, setStoreId] = useState<string>("");
  const [webhooks, setWebhooks] = useState<StoreWebhookDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Formulário de criação
  const [showForm, setShowForm] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "BOOKING_CREATED",
    "BOOKING_CONFIRMED",
    "BOOKING_CANCELLED",
  ]);
  const [isCreating, setIsCreating] = useState(false);

  // Secret exibido uma única vez após criação
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Exclusão com confirmação inline
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadWebhooks = useCallback(async (sid: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const list = await getStoreWebhooks(sid);
      setWebhooks(list);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os webhooks da loja.";
      setErrorMessage(msg);
      setWebhooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      let resolvedId = storeIdParam ?? "";
      if (!resolvedId && typeof window !== "undefined") {
        const stored = localStorage.getItem("current_store_id");
        if (stored && !stored.startsWith("store-super")) {
          resolvedId = stored;
        }
      }
      if (!resolvedId) {
        try {
          const stores = await getMyStores();
          if (stores[0]?.storeId) {
            resolvedId = stores[0].storeId;
          }
        } catch {
          // Tratado abaixo se continuar vazio
        }
      }

      if (!isMounted) return;
      if (!resolvedId) {
        setIsLoading(false);
        return;
      }

      setStoreId(resolvedId);
      await loadWebhooks(resolvedId);
    }

    void init();
    return () => {
      isMounted = false;
    };
  }, [storeIdParam, loadWebhooks]);

  function toggleEvent(value: string) {
    setSelectedEvents((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }

  async function handleCreateWebhook(e: React.FormEvent) {
    e.preventDefault();
    if (!storeId || isCreating) return;

    const trimmedUrl = urlInput.trim();
    if (!/^https?:\/\/.+/i.test(trimmedUrl)) {
      setErrorMessage("Informe uma URL válida começando com http:// ou https://.");
      return;
    }
    if (selectedEvents.length === 0) {
      setErrorMessage("Selecione pelo menos um evento para o webhook.");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);
    try {
      const created = await createStoreWebhook(storeId, {
        url: trimmedUrl,
        events: selectedEvents,
      });

      setWebhooks((prev) => [
        ...prev,
        {
          webhookId: created.webhookId,
          storeId: created.storeId,
          url: created.url,
          events: created.events,
          active: created.active,
        },
      ]);

      if (created.secret) {
        setCreatedSecret(created.secret);
      }

      setUrlInput("");
      setShowForm(false);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao criar o webhook."
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteWebhook(webhookId: string) {
    if (!storeId || deletingId) return;
    setDeletingId(webhookId);
    setErrorMessage(null);
    try {
      await deleteStoreWebhook(storeId, webhookId);
      setWebhooks((prev) => prev.filter((w) => w.webhookId !== webhookId));
      setConfirmDeleteId(null);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao remover o webhook."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCopySecret() {
    if (!createdSecret) return;
    try {
      await navigator.clipboard.writeText(createdSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2500);
    } catch {
      // Clipboard indisponível
    }
  }

  if (!storeId && !isLoading) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Webhook className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground sm:text-lg">
              Webhooks e Integrações
            </h2>
            <p className="text-xs text-muted-foreground">
              Receba notificações HTTP em tempo real sobre eventos da sua loja
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setErrorMessage(null);
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>{showForm ? "Fechar" : "Novo Webhook"}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Secret exibido uma única vez */}
      {createdSecret && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <ShieldAlert className="size-4 shrink-0" />
              <span>Chave secreta do webhook (exibida apenas agora)</span>
            </div>
            <button
              type="button"
              onClick={() => setCreatedSecret(null)}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Fechar
            </button>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground">
              {createdSecret}
            </code>
            <button
              type="button"
              onClick={() => void handleCopySecret()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer shrink-0"
            >
              {copiedSecret ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Formulário de criação */}
      {showForm && (
        <form
          onSubmit={(e) => void handleCreateWebhook(e)}
          className="rounded-2xl border border-border bg-muted/30 p-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              URL de destino (Endpoint)
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://seu-sistema.com/webhooks/agilis"
              required
              disabled={isCreating}
              className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">
              Eventos assinados ({selectedEvents.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {WEBHOOK_EVENT_TYPES.map((evt) => {
                const checked = selectedEvents.includes(evt.value);
                return (
                  <label
                    key={evt.value}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs cursor-pointer transition-colors ${
                      checked
                        ? "border-primary/40 bg-primary/5 text-foreground font-medium"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEvent(evt.value)}
                      className="accent-primary cursor-pointer"
                    />
                    <span className="truncate">{evt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={isCreating}
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar Webhook</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Lista de webhooks */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Carregando webhooks...</span>
        </div>
      ) : webhooks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center text-xs text-muted-foreground">
          Nenhum webhook configurado para esta loja.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {webhooks.map((wh) => (
            <div
              key={wh.webhookId}
              className="rounded-2xl border border-border bg-muted/20 p-4 flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block size-2 rounded-full shrink-0 ${
                        wh.active ? "bg-emerald-500" : "bg-muted-foreground"
                      }`}
                    />
                    <p className="truncate text-xs font-bold text-foreground">
                      {wh.url}
                    </p>
                  </div>
                </div>

                {confirmDeleteId === wh.webhookId ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={deletingId === wh.webhookId}
                      onClick={() => void handleDeleteWebhook(wh.webhookId)}
                      className="rounded-lg bg-destructive px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-destructive/90 disabled:opacity-50 cursor-pointer"
                    >
                      {deletingId === wh.webhookId ? "Excluindo..." : "Confirmar"}
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === wh.webhookId}
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(wh.webhookId)}
                    aria-label="Excluir webhook"
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {wh.events.map((evt) => (
                  <span
                    key={evt}
                    className="rounded-lg border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {EVENT_LABEL_MAP[evt] ?? evt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
