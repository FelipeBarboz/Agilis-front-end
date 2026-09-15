"use client";

import { useState, useRef, useMemo } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockProfileServices } from "@/lib/mocks/profile-services";
import { EditServiceHeader } from "../_components/edit-service-header";
import { ServiceMainPhoto } from "../../add-service/_components/service-main-photo";
import { ServiceInfoCard } from "../../add-service/_components/service-info-card";
import {
  ServicePricingCard,
  type PriceType,
} from "../../add-service/_components/service-pricing-card";
import { ServiceAdditionalPhotos } from "../../add-service/_components/service-additional-photos";
import { ServiceFormActions } from "../../add-service/_components/service-form-actions";

function parseDurationToMinutes(durationStr: string): string {
  if (!durationStr) return "60";
  if (durationStr.includes("dia")) {
    const days = parseInt(durationStr, 10) || 1;
    return String(days * 24 * 60);
  }
  if (durationStr.includes("h") && durationStr.includes("min")) {
    const parts = durationStr.split("h");
    const hours = parseInt(parts[0] || "0", 10) || 0;
    const mins = parseInt(parts[1]?.replace("min", "") || "0", 10) || 0;
    return String(hours * 60 + mins);
  }
  if (durationStr.includes("h")) {
    const parts = durationStr.split("h");
    const hours = parseInt(parts[0] || "0", 10) || 0;
    return String(hours * 60);
  }
  if (durationStr.includes("min")) {
    return String(parseInt(durationStr, 10) || 60);
  }
  const digits = durationStr.replace(/\D/g, "");
  return digits || "60";
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.serviceId as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesRef = useRef<HTMLInputElement>(null);

  // Busca o serviço correspondente nos mocks
  const service = useMemo(() => {
    const found = mockProfileServices.find(
      (s) => String(s.id) === String(rawId)
    );
    return (
      found ??
      mockProfileServices[0] ?? {
        id: 1,
        name: "Serviço",
        price: "R$ 150,00",
        duration: "1h",
      }
    );
  }, [rawId]);

  // Estados do formulário inicializados com os dados do serviço
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(
    "Serviço especializado com garantia de satisfação e atendimento de qualidade."
  );
  const [priceType, setPriceType] = useState<PriceType>("FIXED");
  const [price, setPrice] = useState(service.price);
  const [duration, setDuration] = useState(
    parseDurationToMinutes(service.duration)
  );

  // Fotos
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);

  // Estados de feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMainPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleAdditionalPhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Por favor, preencha o nome do serviço.");
      return;
    }

    if (!price.trim()) {
      setErrorMessage("Por favor, informe o valor do serviço.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/store/store-profile");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <EditServiceHeader
          serviceName={service.name}
          onBack={() => router.back()}
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <ServiceMainPhoto
            inputRef={fileInputRef}
            preview={mainPhotoPreview}
            onChange={handleMainPhotoChange}
            onRemove={handleRemoveMainPhoto}
          />

          <ServiceInfoCard
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
          />

          <ServicePricingCard
            priceType={priceType}
            price={price}
            duration={duration}
            onPriceTypeChange={setPriceType}
            onPriceChange={setPrice}
            onDurationChange={setDuration}
          />

          <ServiceAdditionalPhotos
            photos={additionalPhotos}
            maxPhotos={5}
            inputRef={additionalFilesRef}
            onAddPhotos={handleAdditionalPhotosChange}
            onRemovePhoto={handleRemoveAdditionalPhoto}
          />

          <ServiceFormActions
            isSubmitting={isSubmitting}
            success={success}
            errorMessage={errorMessage}
            submitLabel="Salvar Alterações"
            submittingLabel="Salvando..."
            onCancel={() => router.back()}
          />
        </form>
      </main>
    </div>
  );
}
