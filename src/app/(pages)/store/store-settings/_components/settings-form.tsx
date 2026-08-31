"use client";

import { useState } from "react";
import { UploadCloud, Check, Sparkles, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function SettingsForm() {
  const [storeName, setStoreName] = useState("Carlão Piscinas");
  const [storeSlug, setStoreSlug] = useState("carlao-piscinas");
  const [reportsChecked, setReportsChecked] = useState(true);
  const [emailsChecked, setEmailsChecked] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
    }, 3000);
  };

  return (
    <form className="flex flex-col divide-y divide-border w-full" onSubmit={handleSave}>
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          {savedFeedback && (
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 text-xs font-medium animate-fade-in">
              <Check className="size-3.5 text-emerald-600" />
              <span>Alterações salvas com sucesso!</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="outline" 
            className="rounded-xl px-4 py-2 h-auto text-sm font-medium border-border hover:bg-muted text-foreground transition-colors"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="rounded-xl px-5 py-2 h-auto text-sm font-medium bg-brand-dark text-white hover:bg-brand-dark-2 transition-colors shadow-xs"
          >
            Salvar alterações
          </Button>
        </div>
      </div>

      {/* Identificação Geral */}
      <div className="flex flex-col sm:flex-row gap-6 py-6">
        <div className="sm:w-1/3">
          <h3 className="text-sm font-bold text-foreground">Identificação da loja</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Nome fantasia e razão social da sua empresa para exibição aos clientes.
          </p>
        </div>
        <div className="sm:w-2/3 flex flex-col gap-4 max-w-2xl">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Nome fantasia</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Nome de usuário / URL</label>
            <div className="flex rounded-xl border border-input overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="inline-flex items-center bg-muted/80 px-4 text-sm font-medium text-muted-foreground border-r border-input select-none">
                agilis.com.br/loja/
              </span>
              <input
                type="text"
                value={storeSlug}
                onChange={(e) => setStoreSlug(e.target.value)}
                className="w-full bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logotipo */}
      <div className="flex flex-col sm:flex-row gap-6 py-6">
        <div className="sm:w-1/3">
          <h3 className="text-sm font-bold text-foreground">Logotipo da loja</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Envie a imagem da sua marca. Ela será usada no cabeçalho do perfil, nas buscas e nos orçamentos.
          </p>
        </div>
        <div className="sm:w-2/3 flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-2xl">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-dark text-white shadow-xs border border-border">
            <span className="text-2xl font-bold tracking-tight">CP</span>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary text-white shadow-xs" title="Verificado Agilis">
              <Check className="size-3.5" strokeWidth={3} />
            </div>
          </div>
          
          <div className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/60 py-6 px-4 transition-all cursor-pointer">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-xs border border-border text-primary group-hover:scale-105 transition-transform">
              <UploadCloud className="size-5" />
            </div>
            <p className="text-sm font-medium text-foreground">
              <span className="font-semibold text-primary group-hover:underline">Clique para enviar</span> ou arraste o arquivo aqui
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              SVG, PNG, JPG ou WebP (máx. 800x400px - até 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Identidade Visual & Aplicação */}
      <div className="flex flex-col sm:flex-row gap-6 py-6">
        <div className="sm:w-1/3">
          <h3 className="text-sm font-bold text-foreground">Personalização de marca</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Defina onde seu logotipo e dados da loja serão aplicados automaticamente nos documentos.
          </p>
          <a href="#" className="mt-2 text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
            <Sparkles className="size-3.5" />
            Ver exemplos práticos
          </a>
        </div>
        <div className="sm:w-2/3 flex flex-col gap-4 max-w-2xl">
          <div 
            onClick={() => setReportsChecked(!reportsChecked)}
            className="flex items-start gap-3.5 p-3.5 rounded-xl border border-border bg-background hover:bg-muted/30 cursor-pointer transition-colors"
          >
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
              reportsChecked 
                ? "bg-primary border-primary text-white shadow-xs" 
                : "border-input bg-background"
            }`}>
              {reportsChecked && <Check className="size-3.5" strokeWidth={3} />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Relatórios e Comprovantes</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                Exibir o logotipo da sua loja nos comprovantes em PDF e relatórios de execução de serviço.
              </span>
            </div>
          </div>

          <div 
            onClick={() => setEmailsChecked(!emailsChecked)}
            className="flex items-start gap-3.5 p-3.5 rounded-xl border border-border bg-background hover:bg-muted/30 cursor-pointer transition-colors"
          >
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
              emailsChecked 
                ? "bg-primary border-primary text-white shadow-xs" 
                : "border-input bg-background"
            }`}>
              {emailsChecked && <Check className="size-3.5" strokeWidth={3} />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">E-mails e Notificações</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                Incluir sua marca nos e-mails de confirmação e lembretes de agendamento enviados aos clientes.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Redes Sociais & Contatos */}
      <div className="flex flex-col sm:flex-row gap-6 py-6">
        <div className="sm:w-1/3">
          <h3 className="text-sm font-bold text-foreground">Canais e redes sociais</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Conecte suas redes para aumentar o engajamento e a credibilidade com seus clientes.
          </p>
        </div>
        <div className="sm:w-2/3 flex flex-col gap-3.5 max-w-2xl">
          {/* Instagram */}
          <div className="flex rounded-xl shadow-xs overflow-hidden border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="inline-flex items-center gap-1.5 bg-muted/80 px-3.5 text-sm font-medium text-muted-foreground border-r border-input select-none min-w-[150px]">
              <InstagramIcon className="size-4 text-pink-600" />
              instagram.com/
            </span>
            <input
              type="text"
              defaultValue="carlaopiscinas"
              placeholder="seu_usuario"
              className="w-full bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none"
            />
          </div>

          {/* WhatsApp */}
          <div className="flex rounded-xl shadow-xs overflow-hidden border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="inline-flex items-center gap-1.5 bg-muted/80 px-3.5 text-sm font-medium text-muted-foreground border-r border-input select-none min-w-[150px]">
              <Phone className="size-4 text-emerald-600" />
              wa.me/55
            </span>
            <input
              type="text"
              defaultValue="11999998888"
              placeholder="11999998888"
              className="w-full bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none"
            />
          </div>

          {/* Facebook */}
          <div className="flex rounded-xl shadow-xs overflow-hidden border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="inline-flex items-center gap-1.5 bg-muted/80 px-3.5 text-sm font-medium text-muted-foreground border-r border-input select-none min-w-[150px]">
              <FacebookIcon className="size-4 text-blue-600" />
              facebook.com/
            </span>
            <input
              type="text"
              defaultValue="carlaopiscinasoficial"
              placeholder="sua_pagina"
              className="w-full bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none"
            />
          </div>

          {/* LinkedIn / Site */}
          <div className="flex rounded-xl shadow-xs overflow-hidden border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="inline-flex items-center gap-1.5 bg-muted/80 px-3.5 text-sm font-medium text-muted-foreground border-r border-input select-none min-w-[150px]">
              <LinkedinIcon className="size-4 text-sky-700" />
              linkedin.com/in/
            </span>
            <input
              type="text"
              defaultValue="carlaopiscinas"
              placeholder="perfil"
              className="w-full bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none"
            />
          </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 last:pb-0">
        <div>
          {savedFeedback && (
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-medium animate-fade-in">
              <Check className="size-3.5 text-emerald-600" />
              <span>Alterações salvas com sucesso!</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button 
            type="button" 
            variant="outline" 
            className="rounded-xl px-4 py-2 h-auto text-sm font-medium border-border hover:bg-muted text-foreground transition-colors"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="rounded-xl px-6 py-2.5 h-auto text-sm font-semibold bg-brand-dark text-white hover:bg-brand-dark-2 transition-colors shadow-xs"
          >
            Salvar alterações
          </Button>
        </div>
      </div>

    </form>
  );
}

