// TODO: Integrar com a API de escalas semanais da equipe da loja quando o backend estiver pronto.

export interface TeamMemberShift {
  startHour: number;
  endHour: number;
}

export interface StoreTeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  isCurrentUser?: boolean;
  /**
   * Horários por dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado).
   * [startHour, endHour] ou null se for folga.
   */
  shifts: Record<number, [number, number] | null>;
}

export const MOCK_STORE_TEAM: StoreTeamMember[] = [
  {
    id: "emp-1",
    name: "Jefferson Riper",
    initials: "JR",
    role: "Atendente Operacional",
    isCurrentUser: true,
    shifts: {
      0: [8, 18], // Domingo
      1: [8, 18], // Segunda
      2: [8, 18], // Terça
      3: [8, 18], // Quarta
      4: [8, 18], // Quinta
      5: null,    // Sexta (folga)
      6: [8, 14], // Sábado
    },
  },
  {
    id: "emp-2",
    name: "Rafael Silva",
    initials: "RS",
    role: "Técnico de Piscinas",
    isCurrentUser: false,
    shifts: {
      0: [8, 14],
      1: [7, 16],
      2: null,
      3: [7, 16],
      4: null,
      5: [7, 16],
      6: [7, 13],
    },
  },
  {
    id: "emp-3",
    name: "Ana Beatriz",
    initials: "AB",
    role: "Técnica de Tratamento",
    isCurrentUser: false,
    shifts: {
      0: [13, 18],
      1: [9, 18],
      2: [9, 18],
      3: [9, 18],
      4: [9, 18],
      5: [9, 18],
      6: null,
    },
  },
  {
    id: "emp-4",
    name: "Carlos Souza",
    initials: "CS",
    role: "Encanador",
    isCurrentUser: false,
    shifts: {
      0: [14, 19],
      1: null,
      2: [8, 17],
      3: [8, 17],
      4: [8, 17],
      5: [8, 17],
      6: [8, 14],
    },
  },
];

const STORE_ROSTER_KEY = "agilis_store_roster";

export function getStoreTeamFromStorage(storeId?: string): StoreTeamMember[] {
  if (typeof window === "undefined") return MOCK_STORE_TEAM;
  const key = `${STORE_ROSTER_KEY}_${storeId || "default"}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(MOCK_STORE_TEAM));
      return MOCK_STORE_TEAM;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_STORE_TEAM;
  }
}

export function saveStoreTeamToStorage(
  team: StoreTeamMember[],
  storeId?: string
): void {
  if (typeof window === "undefined") return;
  const key = `${STORE_ROSTER_KEY}_${storeId || "default"}`;
  try {
    localStorage.setItem(key, JSON.stringify(team));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("roster-update", { detail: { storeId, team } })
    );
  } catch {
    // ignore
  }
}

