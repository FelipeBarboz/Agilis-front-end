"use client";

import { Send, CheckCircle, MessageSquare, User, Mail, BookOpen, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SUPPORT_SUBJECT_OPTIONS } from "./contact-form-data";
import { useContactForm } from "./use-contact-form";

export function ContactFormMobile() {
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
      {/* Section Header */}
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageSquare size={16} />
        </div>
        <h2 className="text-base font-bold text-foreground">
          Fale Conosco
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        {/* Success Banner */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex items-start gap-3 border-b border-primary/20 bg-primary/10 px-4 py-3"
            >
              <CheckCircle size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-primary">
                  Mensagem enviada com sucesso!
                </p>
                <p className="text-xs text-muted-foreground">
                  Retornaremos em até 24 horas.
                  {successMessageId && (
                    <span className="block mt-0.5 font-mono text-[10px] text-foreground">
                      Protocolo: {successMessageId}
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex items-start gap-3 border-b border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-destructive" />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold">Erro ao enviar</p>
                <p className="text-xs">{serverError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} className="flex flex-col gap-0" noValidate>
          {/* Nome */}
          <div className="border-b border-border px-4 py-3.5">
            <label
              htmlFor="mobile-name"
              className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              <User size={11} />
              Nome completo <span className="text-destructive">*</span>
            </label>
            <Input
              id="mobile-name"
              type="text"
              autoComplete="name"
              placeholder="Seu nome completo"
              aria-invalid={!!errors.name}
              className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* E-mail */}
          <div className="border-b border-border px-4 py-3.5">
            <label
              htmlFor="mobile-email"
              className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              <Mail size={11} />
              E-mail para contato <span className="text-destructive">*</span>
            </label>
            <Input
              id="mobile-email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              aria-invalid={!!errors.email}
              className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Assunto */}
          <div className="border-b border-border px-4 py-3.5">
            <label
              htmlFor="mobile-subject"
              className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              <BookOpen size={11} />
              Assunto <span className="text-destructive">*</span>
            </label>
            <select
              id="mobile-subject"
              aria-invalid={!!errors.subject}
              className="w-full bg-transparent py-0.5 text-sm text-foreground focus:outline-none"
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
              <p className="mt-1.5 text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>

          {/* Mensagem */}
          <div className="px-4 py-3.5">
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="mobile-message"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                <MessageSquare size={11} />
                Mensagem <span className="text-destructive">*</span>
              </label>
              <span className="text-[10px] text-muted-foreground">
                {messageLength}/500
              </span>
            </div>
            <textarea
              id="mobile-message"
              rows={4}
              maxLength={500}
              placeholder="Descreva seu problema, dúvida ou sugestão..."
              aria-invalid={!!errors.message}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-1.5 text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="border-t border-border px-4 py-3">
            <Button
              type="submit"
              className="w-full gap-2 rounded-xl py-3 text-sm font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                  />
                  Enviando mensagem...
                </span>
              ) : (
                <>
                  <Send size={15} />
                  Enviar mensagem
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
