"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supportSchema, type SupportFormData } from "@/lib/validations/support";

const subjects = [
  "Problema com agendamento",
  "Problema com pagamento",
  "Reclamação sobre profissional",
  "Dúvida sobre serviço",
  "Sugestão",
  "Outro",
];

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SupportFormData>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    resolver: zodResolver(supportSchema) as Resolver<SupportFormData>,
  });

  async function onSubmit(data: SupportFormData) {
    // TODO: integrar com backend
    console.log(data);
    reset();
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Fale Conosco
      </h2>

      <div className="rounded-xl border border-border bg-card p-6">

        {isSubmitSuccessful && (
          <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            Mensagem enviada! Retornaremos em até 24 horas.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Nome e E-mail lado a lado */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground">Nome</label>
              <Input
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground">E-mail</label>
              <Input
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

          </div>

          {/* Assunto */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Assunto</label>
            <select
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
              <p className="text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>

          {/* Mensagem */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Mensagem</label>
            <textarea
              rows={5}
              maxLength={500}
              placeholder="Descreva seu problema ou dúvida..."
              className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto sm:self-end"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Enviando..."
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