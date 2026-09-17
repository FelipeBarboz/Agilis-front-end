import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock } from "lucide-react";

export const STORE_CREATION_STEPS = [
  {
    key: "basicInfos" as const,
    label: "Informações básicas",
    description: "Nome da loja e URL personalizada",
    href: "/provider/basic-informations",
    step: 1,
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

export type StoreStepKey = (typeof STORE_CREATION_STEPS)[number]["key"];

interface CreateStoreStepsListProps {
  mounted: boolean;
  status: Record<StoreStepKey, boolean>;
}

export function CreateStoreStepsList({
  mounted,
  status,
}: CreateStoreStepsListProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4 md:px-8">
        <h2 className="text-base font-bold text-foreground">
          Etapas de cadastro
        </h2>
      </div>

      <div className="divide-y px-2 md:px-4">
        {STORE_CREATION_STEPS.map((step) => {
          const isCompleted = mounted && status[step.key];
          return (
            <Link
              key={step.key}
              href={step.href}
              className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/40 rounded-2xl"
            >
              {/* Ícone de status da etapa */}
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

              {/* Informações da etapa */}
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-semibold text-foreground leading-tight">
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </span>
              </div>

              {/* Badge de status + chevron */}
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
  );
}
