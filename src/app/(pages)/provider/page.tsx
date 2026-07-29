"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, Camera, Copy, MapPin, Star, MessageSquare, CalendarDays, Plus } from "lucide-react";

export default function ProviderDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState({
    basicInfos: false,
    enterpriseInfos: false,
    attendanceArea: false,
    storeDescription: false,
    enterprisePhotos: false,
  });

  useEffect(() => {
    setMounted(true);
    setStatus({
      basicInfos: localStorage.getItem("form_basicInfos") === "true",
      enterpriseInfos: localStorage.getItem("form_enterpriseInfos") === "true",
      attendanceArea: localStorage.getItem("form_attendanceArea") === "true",
      storeDescription: localStorage.getItem("form_storeDescription") === "true",
      enterprisePhotos: localStorage.getItem("form_enterprisePhotos") === "true",
    });
  }, []);

  const StatusButton = ({ isCompleted, href }: { isCompleted: boolean; href: string }) => {
    // Antes de montar: exibe "Pendente" como padrão seguro (evita flash de "Alterar")
    if (!mounted || !isCompleted) {
      return (
        <Link href={href} className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
          Pendente
        </Link>
      );
    }

    return (
      <Link href={href} className="rounded-lg bg-[#d9d9d9] px-4 py-1.5 text-xs font-bold text-black hover:bg-[#c0c0c0] transition-colors">
        Alterar
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-[#00d68f] shadow-sm">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <button className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
            <Menu className="size-6" />
          </button>
          <div className="flex items-center justify-center flex-1">
            <Image
              src="/img/logo-opened.png"
              alt="Agilis"
              width={90}
              height={36}
              className="object-contain -ml-10"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col px-4 py-8 sm:px-6 lg:px-8 mx-auto w-full max-w-3xl space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold md:text-3xl text-foreground">Minha loja</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Gerencie e personalize sua loja
          </p>
        </div>

        {/* Card 1: Profile */}
        <div className="rounded-3xl border bg-white p-5 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-[#006b49] text-white text-4xl sm:text-5xl font-light">
                C
              </div>
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-muted-foreground shadow-sm hover:text-foreground transition-colors">
                <Camera className="size-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex flex-col items-center sm:items-start gap-2 pt-2">
              <h2 className="text-2xl font-bold text-foreground">Carlão Piscinas</h2>
              
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <span>agilis.com/carlao-piscinas</span>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="size-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="size-4" />
                <span>Guarulhos • Até 10 km</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="size-4" />
                <span>0,0 (0 avaliações)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2">
            <Link href="/provider/chat-corporative" className="flex items-center justify-center gap-3 rounded-xl border p-3 hover:bg-muted/50 transition-colors">
              <MessageSquare className="size-5 sm:size-6 text-foreground" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Chat</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Fale com seus clientes</span>
              </div>
            </Link>
            
            <button className="flex items-center justify-center gap-3 rounded-xl border p-3 hover:bg-muted/50 transition-colors text-left">
              <CalendarDays className="size-5 sm:size-6 text-foreground" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Agenda</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Gerencie seus horários</span>
              </div>
            </button>
          </div>
        </div>

        {/* Card 2: Seus dados */}
        <div className="rounded-3xl border bg-white p-5 sm:p-8 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground mb-2">Seus dados</h2>
          
          <div className="flex flex-col divide-y">
            
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Informações básicas</span>
                <span className="text-xs text-muted-foreground">Nome da loja e URL</span>
              </div>
              <StatusButton isCompleted={status.basicInfos} href="/provider/basic-informations" />
            </div>

            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Informações da empresa</span>
                <span className="text-xs text-muted-foreground">Nome de exibição e CNPJ</span>
              </div>
              <StatusButton isCompleted={status.enterpriseInfos} href="/provider/enterprise-infos" />
            </div>

            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Área de atendimento</span>
                <span className="text-xs text-muted-foreground">Defina onde você atende seus clientes</span>
              </div>
              <StatusButton isCompleted={status.attendanceArea} href="/provider/attendance-area" />
            </div>

            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Descrição da loja</span>
                <span className="text-xs text-muted-foreground">Conte mais sobre sua empresa</span>
              </div>
              <StatusButton isCompleted={status.storeDescription} href="/provider/store-description" />
            </div>

            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Fotos da loja</span>
                <span className="text-xs text-muted-foreground">Adicione sua logo e mostre seus serviços</span>
              </div>
              <StatusButton isCompleted={status.enterprisePhotos} href="/provider/enterprise-photos" />
            </div>

          </div>
        </div>

        {/* Card 3: Seus serviços */}
        <div className="rounded-3xl border bg-white p-5 sm:p-8 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground mb-1">Seus serviços</h2>
          <p className="text-sm text-muted-foreground mb-2">Cadastre seus serviços e comece a agilizar</p>
          
          <Link href="/provider/add-service" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00d68f] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#00c080] focus:ring-4 focus:ring-[#00d68f]/30">
            <Plus className="size-5" />
            Novo serviço
          </Link>
        </div>

      </main>
    </div>
  );
}
