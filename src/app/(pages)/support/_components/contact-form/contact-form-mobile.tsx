"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle, MessageSquare, User, Mail, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supportSchema, type SupportFormData } from "@/lib/validations/support";
import { subjects } from "./contact-form-data";

export function ContactFormMobile() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema) as Resolver<SupportFormData>,
  });

  async function onSubmit(data: SupportFormData) {
    // TODO: integrar com backend
    console.log(data);
    reset();
  }

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
          {isSubmitSuccessful && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-3 border-b border-primary/20 bg-primary/8 px-4 py-3"
            >
              <CheckCircle size={18} className="shrink-0 text-primary" />
              <p className="text-sm font-medium text-primary">
                Mensagem enviada! Retornaremos em até 24 horas.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0">
          {/* Nome */}
          <div className="border-b border-border px-4 py-3.5">
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <User size={11} />
              Nome
            </label>
            <Input
              type="text"
              autoComplete="name"
              placeholder="Seu nome completo"
              className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* E-mail */}
          <div className="border-b border-border px-4 py-3.5">
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Mail size={11} />
              E-mail
            </label>
            <Input
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Assunto */}
          <div className="border-b border-border px-4 py-3.5">
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <BookOpen size={11} />
              Assunto
            </label>
            <select
              className="w-full bg-transparent py-0.5 text-sm text-foreground focus:outline-none"
              {...register("subject")}
            >
              <option value="">Selecione um assunto</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-1.5 text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>

          {/* Mensagem */}
          <div className="px-4 py-3.5">
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <MessageSquare size={11} />
              Mensagem
            </label>
            <textarea
              rows={4}
              maxLength={500}
              placeholder="Descreva seu problema ou dúvida..."
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
                  Enviando...
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
