"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, Store, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateStorePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState({
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

  const totalSteps = 5;
  const completedSteps = Object.values(status).filter(Boolean).length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  const handleFinishStoreCreation = () => {
    localStorage.setItem("has_active_store", "true");
    router.push("/store/store-profile");
  };

  const StatusButton = ({ isCompleted, href }: { isCompleted: boolean; href: string }) => {
    if (!mounted || !isCompleted) {
      return (
        <Link
          href={href}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
        >
          Pendente
        </Link>
      );
    }

    return (
      <Link
        href={href}
        className="rounded-lg bg-[#d9d9d9] px-4 py-1.5 text-xs font-bold text-black transition-colors hover:bg-[#c0c0c0]"
      >
        Alterar
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-primary text-primary-foreground shadow-sm">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/provider"
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              Criar Loja
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/img/logo-opened.png"
              alt="Agilis"
              width={80}
              height={32}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Banner / Introduction */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Store className="size-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Configure os dados da sua Loja
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Preencha as informações da sua empresa para ter um perfil público completo no Agilis.
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-muted/50 p-4">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">Etapas concluídas</span>
              <span className="text-primary">{completedSteps} de {totalSteps} ({progressPercentage}%)</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="flex flex-col gap-4 rounded-3xl border bg-white p-5 shadow-sm sm:p-8">
          <h3 className="mb-2 text-lg font-bold text-foreground">Etapas de cadastro</h3>

          <div className="flex flex-col divide-y">
            
            {/* 1. Informações básicas */}
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Informações básicas</span>
                <span className="text-xs text-muted-foreground">Nome da loja e URL personalizada</span>
              </div>
              <StatusButton isCompleted={status.basicInfos} href="/provider/basic-informations" />
            </div>

            {/* 2. Informações da empresa */}
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Informações da empresa</span>
                <span className="text-xs text-muted-foreground">Nome de exibição e CNPJ</span>
              </div>
              <StatusButton isCompleted={status.enterpriseInfos} href="/provider/enterprise-infos" />
            </div>

            {/* 3. Área de atendimento */}
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Área de atendimento</span>
                <span className="text-xs text-muted-foreground">Defina onde você atende seus clientes</span>
              </div>
              <StatusButton isCompleted={status.attendanceArea} href="/provider/attendance-area" />
            </div>

            {/* 4. Descrição da loja */}
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Descrição da loja</span>
                <span className="text-xs text-muted-foreground">Conte mais sobre os serviços da sua empresa</span>
              </div>
              <StatusButton isCompleted={status.storeDescription} href="/provider/store-description" />
            </div>

            {/* 5. Fotos da loja */}
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Fotos da loja</span>
                <span className="text-xs text-muted-foreground">Adicione sua logo e mostre seus trabalhos</span>
              </div>
              <StatusButton isCompleted={status.enterprisePhotos} href="/provider/enterprise-photos" />
            </div>

          </div>
        </div>

        {/* Action card to finalize store */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border bg-gradient-to-r from-brand-dark/10 to-primary/10 p-6 sm:flex-row sm:p-8">
          <div>
            <h4 className="flex items-center gap-2 text-base font-bold text-foreground">
              <Sparkles className="size-4 text-primary" />
              Tudo pronto para começar?
            </h4>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Ao concluir, sua loja estará configurada e pronta para receber agendamentos.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleFinishStoreCreation}
            className="w-full shrink-0 gap-2 rounded-xl bg-primary py-6 text-sm font-bold text-white shadow-md transition-all hover:bg-primary/90 sm:w-auto"
          >
            Finalizar e Abrir Loja
            <ArrowRight className="size-4" />
          </Button>
        </div>

      </main>
    </div>
  );
}
