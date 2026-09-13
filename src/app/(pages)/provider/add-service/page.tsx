"use client";

import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AddServiceHeader } from "./_components/add-service-header";
import { ServiceMainPhoto } from "./_components/service-main-photo";
import { ServiceInfoCard } from "./_components/service-info-card";
import {
  ServicePricingCard,
  type PriceType,
} from "./_components/service-pricing-card";
import { ServiceAdditionalPhotos } from "./_components/service-additional-photos";
import { ServiceFormActions } from "./_components/service-form-actions";

export default function AddServicePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState<PriceType>("FIXED");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  // Fotos
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);

  // Estados de feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handler da foto principal
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

  // Handler das fotos adicionais (até 5)
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

  // Submissão do formulário
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
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <AddServiceHeader onBack={() => router.back()} />

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
            onCancel={() => router.back()}
          />
        </form>
      </main>
    </div>
  );
}
