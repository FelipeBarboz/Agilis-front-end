"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Briefcase,
  Settings,
  Clock,
  User,
  ArrowRight,
  LogOut,
  ChevronRight,
  AlertTriangle,
  ShieldAlert,
  Lock,
  CalendarDays,
  Pencil,
  Store as StoreIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockProfileAppointments } from "@/lib/mocks/profile-appointments";
import { ServicesList } from "./_components/services-list";
import { EditStoreProfileModal } from "./_components/edit-store-profile-modal";
import { getEmployeeStoresFromStorage } from "@/lib/mocks/invites";
import type { PermissionId } from "@/lib/mocks/positions";
import {
  getStoreTeamFromStorage,
  type StoreTeamMember,
} from "@/lib/mocks/store-roster";
import {
  getStoreById,
  getMyStores,
  getStoreUnits,
  formatCnpj,
  type StoreProfileDTO,
} from "@/lib/services/stores-service";
import { fetchReviewsByReviewedId } from "@/lib/services/reviews-service";

function StoreProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isEmployeeParam = searchParams.get("asEmployee") === "true";
  const storeIdParam = searchParams.get("storeId");
  const positionTitleParam = searchParams.get("positionTitle");

  const [isEmployee, setIsEmployee] = useState(isEmployeeParam);
  const [positionTitle, setPositionTitle] = useState(positionTitleParam || "Funcionário");
  const [permissions, setPermissions] = useState<PermissionId[]>(["manage_appointments"]);
  const [storeTeam, setStoreTeam] = useState<StoreTeamMember[]>([]);
  const todayDow = new Date().getDay();

  // Estados da loja vindos do backend (GET /api/v1/stores/{storeId})
  const [store, setStore] = useState<StoreProfileDTO | null>(null);
  const [activeStoreId, setActiveStoreId] = useState<string>(storeIdParam || "");
  const [storeLocation, setStoreLocation] = useState<string>("");
  const [storeRating, setStoreRating] = useState<number>(0);
  const [storeReviewCount, setStoreReviewCount] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  // Carrega e sincroniza o perfil da loja ativo
  useEffect(() => {
    let isMounted = true;

    async function loadStoreData() {
      try {
        setIsLoadingStore(true);
        let idToLoad = storeIdParam;

        if (!idToLoad && typeof window !== "undefined") {
          idToLoad =
            localStorage.getItem("current_store_id") ||
            sessionStorage.getItem("form_storeId") ||
            "";
        }

        if (!idToLoad) {
          const myStores = await getMyStores();
          if (myStores.length > 0 && myStores[0]) {
            idToLoad = myStores[0].storeId;
          }
        }

        if (!idToLoad) {
          if (isMounted) setIsLoadingStore(false);
          return;
        }

        if (isMounted) {
          setActiveStoreId(idToLoad);
          localStorage.setItem("current_store_id", idToLoad);
          localStorage.setItem("has_active_store", "true");
        }

        // 1. GET /api/v1/stores/{storeId}
        const storeData = await getStoreById(idToLoad);
        if (!isMounted) return;
        setStore(storeData);

        // 2. Unidades para obter cidade e estado
        try {
          const units = await getStoreUnits(idToLoad);
          if (units.length > 0 && units[0]) {
            const u = units[0];
            const city = u.city?.trim();
            const state = u.state?.trim();
            if (city && state) {
              setStoreLocation(`${city} - ${state}`);
            } else if (city) {
              setStoreLocation(city);
            }
          }
        } catch {}

        // 3. Avaliações reais da loja
        try {
          const reviews = await fetchReviewsByReviewedId(idToLoad);
          if (Array.isArray(reviews)) {
            setStoreReviewCount(reviews.length);
            if (reviews.length > 0) {
              const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
              setStoreRating(avg);
            } else {
              setStoreRating(0);
            }
          }
        } catch {}
      } catch (err) {
        console.warn("[StoreProfile] Erro ao carregar dados da loja:", err);
      } finally {
        if (isMounted) setIsLoadingStore(false);
      }
    }

    void loadStoreData();

    return () => {
      isMounted = false;
    };
  }, [storeIdParam]);

  useEffect(() => {
    setStoreTeam(getStoreTeamFromStorage(storeIdParam || "store-super-pinturas"));

    const handleSync = () => {
      setStoreTeam(getStoreTeamFromStorage(storeIdParam || "store-super-pinturas"));
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("roster-update", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("roster-update", handleSync);
    };
  }, [storeIdParam]);

  useEffect(() => {
    if (isEmployeeParam) {
      setIsEmployee(true);
      if (positionTitleParam) setPositionTitle(positionTitleParam);

      // Busca permissões no storage se disponível
      const list = getEmployeeStoresFromStorage();
      const assoc = list.find((a) => a.storeId === storeIdParam);
      if (assoc) {
        setPermissions(assoc.permissions);
        setPositionTitle(assoc.positionTitle);
      }
    }
  }, [isEmployeeParam, storeIdParam, positionTitleParam]);

  const canManageSettings = !isEmployee || permissions.includes("store_settings");
  const canManageAppointments = !isEmployee || permissions.includes("manage_appointments");

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      
      {/* Seta de voltar flutuante */}
      <button
        type="button"
        onClick={() => router.push("/stores")}
        aria-label="Voltar para Minhas Lojas"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        
        {/* Banner de Restrição do Modo Funcionário */}
        {isEmployee && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
                <ShieldAlert className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    Modo Funcionário ({positionTitle})
                  </span>
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                    Acesso Restrito
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Você está visualizando o perfil da loja com permissões limitadas ao cargo de {positionTitle}.
                </p>
              </div>
            </div>

            {storeIdParam && (
              <Link href={`/employee-store/${storeIdParam}`} className="shrink-0 self-end sm:self-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-amber-500/40 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 text-xs font-semibold cursor-pointer"
                >
                  Voltar ao Painel
                </Button>
              </Link>
            )}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Perfil da Loja</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {isEmployee
              ? "Informações e serviços da loja em que você atua"
              : "Gerencie sua loja, agendamentos, serviços e equipe"}
          </p>
        </div>

        {/* Card 1: Perfil da Loja */}
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            
            {/* Avatar */}
            {store?.profileImgUrl ? (
              <img
                src={store.profileImgUrl}
                alt={store.storeName || "Loja"}
                className="h-24 w-24 shrink-0 rounded-full object-cover border-2 border-border sm:h-28 sm:w-28 shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#006b49] text-4xl font-light text-white sm:h-28 sm:w-28 sm:text-5xl shadow-sm">
                {(store?.storeName || "Loja")
                  .split(" ")
                  .map((w) => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "LJ"}
              </div>
            )}

            {/* Info */}
            <div className="flex flex-col items-center gap-2 pt-2 sm:items-start flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {store?.storeName || (isLoadingStore ? "Carregando loja..." : "Minha Loja")}
                </h2>
                <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Loja Ativa
                </span>
                {canManageSettings && store && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-8 gap-1.5 rounded-xl border-border px-3 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    <Pencil className="size-3.5 text-primary" />
                    <span>Editar Perfil</span>
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <MapPin className="size-4 text-primary shrink-0" />
                <span>
                  {storeLocation ? `${storeLocation} • ` : ""}CNPJ {store?.cnpj ? formatCnpj(store.cnpj) : "Não informado"}
                </span>
              </div>

              {store?.slug && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <StoreIcon className="size-3 text-muted-foreground" />
                  <span>agilis.com.br/loja/{store.slug}</span>
                </p>
              )}

              {store?.description && (
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 max-w-xl">
                  {store.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <Star
                  className={`size-4 ${
                    storeReviewCount > 0
                      ? "text-amber-500 fill-amber-500"
                      : "text-muted-foreground/30 fill-muted"
                  }`}
                />
                {storeReviewCount > 0 ? (
                  <>
                    <span className="font-medium text-foreground">{storeRating.toFixed(1)}</span>
                    <span>({storeReviewCount} {storeReviewCount === 1 ? "avaliação" : "avaliações"})</span>
                  </>
                ) : (
                  <span>Sem avaliações ainda</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Funcionários, Cargos, Escala da Loja */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 mt-2">
            {canManageSettings ? (
              <Link
                href={`/store/employees${activeStoreId ? `?storeId=${encodeURIComponent(activeStoreId)}` : ""}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4 transition-all hover:bg-muted hover:border-primary/40 group"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Users className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Funcionários</span>
                  <span className="text-xs text-muted-foreground">Gerencie sua equipe</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 p-4 opacity-75 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Users className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">Funcionários</span>
                    <span className="text-[11px] text-muted-foreground">Restrito ao proprietário</span>
                  </div>
                </div>
                <Lock className="size-4 text-muted-foreground" />
              </div>
            )}
            
            {canManageSettings ? (
              <Link
                href={`/store/store-positions${activeStoreId ? `?storeId=${encodeURIComponent(activeStoreId)}` : ""}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4 transition-all hover:bg-muted hover:border-primary/40 group"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Briefcase className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Cargos</span>
                  <span className="text-xs text-muted-foreground">Funções e permissões</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 p-4 opacity-75 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Briefcase className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">Cargos</span>
                    <span className="text-[11px] text-muted-foreground">Restrito ao proprietário</span>
                  </div>
                </div>
                <Lock className="size-4 text-muted-foreground" />
              </div>
            )}

            {/* Escala da Loja */}
            <Link
              href={
                isEmployee && activeStoreId
                  ? `/employee-store/${encodeURIComponent(activeStoreId)}/store-schedule`
                  : `/store/store-schedule${activeStoreId ? `?storeId=${encodeURIComponent(activeStoreId)}` : ""}`
              }
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4 transition-all hover:bg-muted hover:border-primary/40 group"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <CalendarDays className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Escala da Loja</span>
                <span className="text-xs text-muted-foreground">Criar e editar turnos</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Card: Escala da Equipe da Loja */}
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Escala da Loja</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Veja a escala completa de todos os funcionários, crie e edite turnos
              </p>
            </div>

            <div className="flex items-center gap-2">
              {canManageSettings && (
                <Link
                  href={isEmployee && storeIdParam ? `/employee-store/${storeIdParam}/store-schedule` : "/store/store-schedule"}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20 cursor-pointer shadow-2xs"
                >
                  <Pencil className="size-3.5" />
                  <span>Criar / Editar Escala</span>
                </Link>
              )}

              <Link
                href={isEmployee && storeIdParam ? `/employee-store/${storeIdParam}/store-schedule` : "/store/store-schedule"}
                className="flex items-center gap-1.5 rounded-xl bg-muted px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80 cursor-pointer"
              >
                <span>Ver escala</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Mini resumo da escala de hoje */}
          <div className="mt-2 divide-y divide-border border-t border-border">
            {storeTeam.slice(0, 4).map((member) => {
              const todayShift = member.shifts[todayDow];
              const isWorking = todayShift !== null;

              return (
                <div key={member.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#006b49] text-[11px] font-semibold text-white">
                      {member.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        {member.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {todayShift && isWorking ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2.5 py-0.5">
                        {todayShift[0].toString().padStart(2, "0")}h às {todayShift[1].toString().padStart(2, "0")}h
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground border border-dashed border-border rounded-md px-2.5 py-0.5">
                        Folga
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Serviços da Loja (Restrito a somente leitura se for funcionário sem store_settings) */}
        <ServicesList
          isRestricted={!canManageSettings}
          storeId={activeStoreId || undefined}
        />

        {/* Card 3: Agendamentos */}
        {canManageAppointments ? (
          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Agendamentos</h2>
                <p className="text-sm text-muted-foreground">Atendimentos marcados para sua loja</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/store/store-scheduling?delay=true"
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors hover:bg-amber-500/20"
                >
                  <AlertTriangle className="size-3.5" />
                  Avisar Atraso
                </Link>
                <Link
                  href="/store/store-scheduling"
                  className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
                >
                  Ver agenda
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            <div className="mt-2 divide-y divide-border border-t border-border">
              {mockProfileAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-foreground flex items-center gap-2">
                      <User className="size-3.5 text-primary" />
                      {appt.client}
                    </span>
                    <span className="text-xs text-muted-foreground">{appt.service}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-0.5">
                      {appt.date}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      {appt.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-muted-foreground" />
              <div>
                <h2 className="text-base font-bold text-foreground">Agendamentos Gerais</h2>
                <p className="text-xs text-muted-foreground">Seu cargo não possui permissão para gerenciar a agenda geral da loja.</p>
              </div>
            </div>
          </div>
        )}

        {/* Card 4: Gestão e Sair */}
        <div className="flex flex-col gap-3">
          {canManageSettings ? (
            <Link
              href={`/store/store-settings${activeStoreId ? `?storeId=${encodeURIComponent(activeStoreId)}` : ""}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted hover:border-primary/40 group sm:p-5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <Settings className="size-5" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-bold text-foreground">Configurações da Loja</span>
                <span className="text-xs text-muted-foreground">CNPJ, horário de funcionamento e dados da empresa</span>
              </div>
              <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 p-4 opacity-75 cursor-not-allowed sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Settings className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-muted-foreground">Configurações da Loja</span>
                  <span className="text-xs text-muted-foreground">Requer permissão de administrador</span>
                </div>
              </div>
              <Lock className="size-5 text-muted-foreground" />
            </div>
          )}

          <Link
            href="/stores"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <ArrowLeft className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-foreground">Trocar de Loja</span>
              <span className="text-xs text-muted-foreground">Voltar para a lista de todas as lojas</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted hover:border-destructive/40 group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive group-hover:scale-105 transition-transform">
              <LogOut className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-destructive">Sair</span>
              <span className="text-xs text-muted-foreground">Encerrar sessão</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Modal de Edição de Perfil da Loja (PUT /api/v1/stores/{storeId}) */}
        <EditStoreProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          store={store}
          onStoreUpdated={(updated) => setStore(updated)}
        />
      </main>
    </div>
  );
}

export default function StoreProfilePage() {
  return (
    <Suspense fallback={null}>
      <StoreProfileContent />
    </Suspense>
  );
}
