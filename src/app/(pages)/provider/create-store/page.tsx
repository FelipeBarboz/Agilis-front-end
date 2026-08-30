"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Store,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    key: "basicInfos" as const,
    label: "Informações básicas",
    description: "Nome da loja e URL personalizada",
    href: "/provider/basic-informations",
    step: 1,
  },
  {
    key: "enterpriseInfos" as const,
    label: "Informações da empresa",
    description: "Nome de exibição e CNPJ",
    href: "/provider/enterprise-infos",
    step: 2,
  },
  {
    key: "attendanceArea" as const,
    label: "Área de atendimento",
    description: "Defina onde você atende seus clientes",
    href: "/provider/attendance-area",
    step: 3,
  },
  {
    key: "storeDescription" as const,
    label: "Descrição da loja",
    description: "Conte mais sobre os serviços da sua empresa",
    href: "/provider/store-description",
    step: 4,
  },
  {
    key: "enterprisePhotos" as const,
    label: "Fotos da loja",
    description: "Adicione sua logo e mostre seus trabalhos",
    href: "/provider/enterprise-photos",
    step: 5,
  },
];

type StatusKey = (typeof STEPS)[number]["key"];

export default function CreateStorePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Record<StatusKey, boolean>>({
    basicInfos: false,
    enterpriseInfos: false,
    attendanceArea: false,
    storeDescription: false,
    enterprisePhotos: false,
  });

  useEffect(() => {
    // Limpa registros antigos do localStorage de protótipos anteriores
    localStorage.removeItem("form_basicInfos");
    localStorage.removeItem("form_enterpriseInfos");
    localStorage.removeItem("form_attendanceArea");
    localStorage.removeItem("form_storeDescription");
    localStorage.removeItem("form_enterprisePhotos");

    setMounted(true);
    setStatus({
      basicInfos: sessionStorage.getItem("form_basicInfos") === "true",
      enterpriseInfos: sessionStorage.getItem("form_enterpriseInfos") === "true",
      attendanceArea: sessionStorage.getItem("form_attendanceArea") === "true",
      storeDescription: sessionStorage.getItem("form_storeDescription") === "true",
      enterprisePhotos: sessionStorage.getItem("form_enterprisePhotos") === "true",
    });
  }, []);

  const totalSteps = STEPS.length;
  const completedSteps = Object.values(status).filter(Boolean).length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  const handleFinishStoreCreation = () => {
    localStorage.setItem("has_active_store", "true");
    router.push("/store/store-profile");
  };

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      {/* Seta de voltar flutuante — padrão Agilis */}
      <Link
        href="/provider"
        aria-label="Voltar para tela de prestador"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Criar Loja</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Preencha as etapas abaixo para configurar seu perfil público no Agilis
          </p>
        </div>

        {/* Progress Card */}
        <div className="overflow-hidden rounded-3xl bg-primary shadow-xl">
          <div className="flex flex-col gap-5 p-6 md:p-8">

            {/* Icon + Text */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Store className="size-7 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-tight">
                  Configure os dados da sua loja
                </p>
                <p className="mt-0.5 text-sm text-white/70">
                  Complete as 5 etapas para publicar seu perfil
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white/70">Progresso</span>
                <span className="text-white">
                  {completedSteps}/{totalSteps} etapas ({progressPercentage}%)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Steps List Card */}
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4 md:px-8">
            <h2 className="text-base font-bold text-foreground">Etapas de cadastro</h2>
          </div>

          <div className="divide-y px-2 md:px-4">
            {STEPS.map((step) => {
              const isCompleted = mounted && status[step.key];
              return (
                <Link
                  key={step.key}
                  href={step.href}
                  className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/40 rounded-2xl"
                >
                  {/* Step status icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <Clock className="size-4" />
                    )}
                  </div>

                  {/* Step info */}
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold text-foreground leading-tight">
                      {step.label}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </span>
                  </div>

                  {/* Action badge + chevron */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                        isCompleted
                          ? "bg-muted text-foreground"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {isCompleted ? "Alterar" : "Pendente"}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Finalize Card */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border bg-white p-6 shadow-sm sm:flex-row sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Tudo pronto para começar?</h3>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                Ao concluir, sua loja estará configurada e pronta para receber agendamentos.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleFinishStoreCreation}
            className="w-full shrink-0 gap-2 rounded-xl bg-primary py-5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary/90 sm:w-auto cursor-pointer"
          >
            Finalizar e Abrir Loja
            <ArrowRight className="size-4" />
          </Button>
        </div>

      </main>
    </div>
  );
}
