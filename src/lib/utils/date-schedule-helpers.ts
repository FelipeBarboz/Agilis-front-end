const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

const MESES_CAP = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DIAS_SEMANA = [
  "domingo", "segunda-feira", "terça-feira", "quarta-feira",
  "quinta-feira", "sexta-feira", "sábado"
];

export const DOW_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const DOW_UPPER = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function capitalize(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatMonthYear(d: Date): string {
  const monthName = MESES_CAP[d.getMonth()] ?? "";
  return `${monthName} ${d.getFullYear()}`;
}

export function formatLongDate(d: Date, includeYear = false): string {
  const weekday = capitalize(DIAS_SEMANA[d.getDay()] ?? "");
  const day = d.getDate();
  const month = MESES[d.getMonth()] ?? "";
  if (includeYear) {
    return `${weekday}, ${day} de ${month} de ${d.getFullYear()}`;
  }
  return `${weekday}, ${day} de ${month}`;
}

export function formatWeekRangeTitle(start: Date, end: Date): string {
  const startMonth = MESES[start.getMonth()] ?? "";
  const endMonth = MESES[end.getMonth()] ?? "";

  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.getDate()} de ${endMonth} de ${end.getFullYear()}`;
  }
  const startMonthShort = startMonth.slice(0, 3);
  const endMonthShort = endMonth.slice(0, 3);
  return `${start.getDate()} ${startMonthShort} – ${end.getDate()} ${endMonthShort} de ${end.getFullYear()}`;
}

/** Início da semana no Domingo (para o Calendário) */
export function getSundayWeekStart(d: Date): Date {
  return addDays(d, -d.getDay());
}

/** Início da semana na Segunda-feira (para a Escala da Loja) */
export function getMondayWeekStart(d: Date): Date {
  return addDays(d, -((d.getDay() + 6) % 7));
}
