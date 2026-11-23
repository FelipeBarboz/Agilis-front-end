"use client";

import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SUPPORT_SUBJECT_OPTIONS } from "./contact-form-data";
import { useContactForm } from "./use-contact-form";

export function ContactFormDesktop() {
  const {
    form,
    onSubmit,
    isSubmitting,
    isSuccess,
    serverError,
    successMessageId,
    messageLength,
  } = useContactForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Fale Conosco
      </h2>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
        {isSuccess && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-foreground">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-primary">
                Mensagem enviada com sucesso!
              </p>
              <p className="text-muted-foreground text-xs">
                Nossa equipe de suporte analisará sua solicitação e retornará em até 24 horas.
                {successMessageId && (
                  <span className="block mt-1 font-mono text-[11px] text-foreground">
                    Protocolo: {successMessageId}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {serverError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold">Erro ao enviar</p>
              <p className="text-xs">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {/* Nome e E-mail lado a lado */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="desktop-name" className="text-xs font-semibold text-foreground">
                Nome completo <span className="text-destructive">*</span>
              </label>
              <Input
                id="desktop-name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome completo"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "desktop-name-error" : undefined}
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register("name")}
              />
              {errors.name && (
                <p id="desktop-name-error" className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="desktop-email" className="text-xs font-semibold text-foreground">
                E-mail para contato <span className="text-destructive">*</span>
              </label>
              <Input
                id="desktop-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "desktop-email-error" : undefined}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register("email")}
              />
              {errors.email && (
                <p id="desktop-email-error" className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Assunto */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="desktop-subject" className="text-xs font-semibold text-foreground">
              Assunto <span className="text-destructive">*</span>
            </label>
            <select
              id="desktop-subject"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "desktop-subject-error" : undefined}
              className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${
                errors.subject
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-input"
              }`}
              {...register("subject")}
            >
              <option value="">Selecione o tipo de assunto</option>
              {SUPPORT_SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p id="desktop-subject-error" className="text-xs text-destructive">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Mensagem */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="desktop-message" className="text-xs font-semibold text-foreground">
                Mensagem <span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                {messageLength}/500 caracteres
              </span>
            </div>
            <textarea
              id="desktop-message"
              rows={5}
              maxLength={500}
              placeholder="Descreva seu problema, dúvida ou sugestão com o máximo de detalhes..."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "desktop-message-error" : undefined}
              className={`w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${
                errors.message
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-input"
              }`}
              {...register("message")}
            />
            {errors.message && (
              <p id="desktop-message-error" className="text-xs text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto sm:self-end gap-2 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando mensagem...
              </>
            ) : (
              <>
                <Send size={16} />
                Enviar mensagem
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
