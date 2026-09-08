"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Camera,
  ChevronDown,
  DollarSign,
  ImagePlus,
  Trash2,
  UploadCloud,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PriceType = "FIXED" | "HOURLY" | "VARIABLE";

const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  FIXED: "Preço fixo",
  HOURLY: "Por hora",
  VARIABLE: "A combinar",
};

export default function AddServicePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState<PriceType>("FIXED");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  // Photos
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);

  // Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Main photo upload handler
  const handleMainPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMainPhotoPreview(url);
    }
  };

  const handleRemoveMainPhoto = () => {
    setMainPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Additional photos upload handler (up to 5)
  const handleAdditionalPhotosChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - additionalPhotos.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    setAdditionalPhotos((prev) => [...prev, ...newPreviews]);
    if (additionalFilesRef.current) {
      additionalFilesRef.current.value = "";
    }
  };

  const handleRemoveAdditionalPhoto = (index: number) => {
    setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Format currency
  const handlePriceChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) {
      setPrice("");
      return;
    }
    const numberValue = Number(digits) / 100;
    setPrice(
      numberValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Por favor, informe o nome do serviço.");
      return;
    }

    if (priceType !== "VARIABLE" && !price.trim()) {
      setErrorMessage("Por favor, informe o valor do serviço.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    }, 600);
  };

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      {/* Seta de voltar flutuante — padrão Agilis */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        {/* Header da página */}
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Criar novo serviço
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Preencha as informações para disponibilizar um novo serviço
          </p>
        </div>

        {/* Feedback de Sucesso */}
        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-700 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="flex flex-col">
              <span className="font-bold">Serviço criado com sucesso!</span>
              <span className="text-xs text-muted-foreground">
                Redirecionando para a lista de serviços...
              </span>
            </div>
          </div>
        )}

        {/* Feedback de Erro */}
        {errorMessage && (
          <div className="flex items-center gap-3 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive animate-in fade-in duration-200">
            <X className="size-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Card 1: Foto Principal do Serviço */}
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Camera className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Foto principal do serviço
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Adicione uma foto de destaque que represente o trabalho
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/20 p-6 sm:p-8">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleMainPhotoChange}
                className="hidden"
                id="main-photo-input"
              />

              {mainPhotoPreview ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <img
                      src={mainPhotoPreview}
                      alt="Foto principal do serviço"
                      className="h-36 w-36 rounded-2xl object-cover border-2 border-border shadow-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveMainPhoto}
                      className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-transform hover:scale-110 cursor-pointer"
                      title="Remover foto"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border-border text-xs font-semibold hover:bg-card cursor-pointer mt-1"
                  >
                    <Camera className="size-3.5 mr-1.5" />
                    Trocar foto
                  </Button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex h-36 w-36 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary transition-all hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                      <ImagePlus className="size-6" />
                    </div>
                    <span className="text-xs font-semibold">Adicionar foto</span>
                  </button>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Clique para selecionar uma imagem
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PNG, JPG ou WEBP • Máx. 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 2: Informações do Serviço */}
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Briefcase className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Informações do serviço
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Dê um título e uma descrição clara para seus clientes
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Nome do Serviço */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="title"
                  className="text-xs font-bold text-foreground"
                >
                  Nome do serviço <span className="text-primary">*</span>
                </label>
                <Input
                  id="title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Limpeza de piscina, Manutenção preventiva..."
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="text-xs font-bold text-foreground"
                  >
                    Descrição
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    {description.length}/250
                  </span>
                </div>
                <textarea
                  id="description"
                  rows={4}
                  maxLength={250}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que está incluso no serviço, diferenciais, materiais utilizados, etc."
                  className="w-full resize-none rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Precificação e Duração */}
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <DollarSign className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Valores e Tempo Estimado
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Defina o modelo de cobrança e a duração média
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Tipo de Preço */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="priceType"
                  className="text-xs font-bold text-foreground"
                >
                  Tipo de preço <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <select
                    id="priceType"
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as PriceType)}
                    className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 pr-10 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    {(
                      Object.entries(PRICE_TYPE_LABELS) as [PriceType, string][]
                    ).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
              </div>

              {/* Valor do Serviço */}
              {priceType === "VARIABLE" ? (
                <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-border bg-muted/30 px-3.5 py-2.5 sm:mt-6">
                  <Sparkles className="size-4 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Preço combinado diretamente com o cliente.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="price"
                    className="text-xs font-bold text-foreground"
                  >
                    Valor {priceType === "HOURLY" ? "(por hora)" : ""}{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="R$ 0,00"
                    className="h-11 rounded-xl"
                  />
                </div>
              )}

              {/* Duração Estimada */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="duration"
                    className="text-xs font-bold text-foreground flex items-center gap-1.5"
                  >
                    <Clock className="size-3.5 text-primary" />
                    Duração estimada (minutos)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[30, 60, 120].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDuration(String(mins))}
                        className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                      >
                        {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  id="duration"
                  type="number"
                  min={5}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 60 (para 1 hora)"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Imagens Adicionais */}
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UploadCloud className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Imagens adicionais
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Mostre detalhes, antes e depois ou exemplos do serviço
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                {additionalPhotos.length}/5
              </span>
            </div>

            <input
              ref={additionalFilesRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleAdditionalPhotosChange}
              className="hidden"
              id="additional-photos-input"
            />

            {/* Grid de Imagens Adicionais */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {additionalPhotos.map((photoUrl, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-border group shadow-xs"
                >
                  <img
                    src={photoUrl}
                    alt={`Imagem adicional ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalPhoto(idx)}
                    className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm opacity-90 transition-opacity hover:opacity-100 cursor-pointer"
                    title="Remover imagem"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}

              {additionalPhotos.length < 5 && (
                <button
                  type="button"
                  onClick={() => additionalFilesRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer"
                >
                  <ImagePlus className="size-5" />
                  <span className="text-[11px] font-semibold text-center px-2">
                    Adicionar foto
                  </span>
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PNG, JPG ou WEBP. Até 5 imagens complementares.
            </p>
          </div>

          {/* Ações de Rodapé */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto rounded-xl px-6 h-11 text-sm font-medium border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-xl px-8 h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all focus:ring-4 focus:ring-primary/20 cursor-pointer"
            >
              {isSubmitting ? "Criando serviço..." : "Criar serviço"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

