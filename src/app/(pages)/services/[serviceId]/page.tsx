"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { mockServices } from "@/lib/mocks/services";
import { ServiceImages } from "./_components/service-images";
import { ServiceInfo } from "./_components/service-info";
import { ServicePackages } from "./_components/service-packages";
import { ScheduleButton } from "./_components/schedule-button";

export default function ServiceDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceId = params.serviceId as string;
  const storeId = searchParams.get("storeId") ?? "";

  const service = mockServices.find((s) => s.id === serviceId);

  const [selectedPrice, setSelectedPrice] = useState(
    service?.price.inicial ?? 0,
  );
  const [selectedPackage, setSelectedPackage] = useState(
    service?.packages[0]?.label ?? "",
  );

  if (!service) {
    return (
      <main className="flex flex-1 items-center justify-center bg-muted p-6">
        <div className="text-center">
          <p className="text-base font-medium text-foreground">
            Serviço não encontrado
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Voltar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-muted">

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background px-6 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-semibold text-foreground line-clamp-1">
          {service.title}
        </h2>
      </div>

      {/* Conteúdo */}
      <div className="mx-auto w-full max-w-4xl p-6">
        <motion.div
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Coluna esquerda — imagens + pacotes */}
          <div className="flex flex-col gap-6">
            <ServiceImages images={service.images} title={service.title} />
            <ServicePackages
              service={service}
              onSelect={(price, label) => {
                setSelectedPrice(price);
                setSelectedPackage(label);
              }}
            />
          </div>

          {/* Coluna direita — info + botão */}
          <div className="flex flex-col gap-6">
            <ServiceInfo service={service} />
            <div className="lg:mt-auto">
              <ScheduleButton
                serviceId={serviceId}
                storeId={storeId}
                selectedPrice={selectedPrice}
                selectedPackage={selectedPackage}
              />
            </div>
          </div>

        </motion.div>
      </div>

    </main>
  );
}