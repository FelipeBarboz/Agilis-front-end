export const DELAY_REASONS = [
  "Trânsito intenso / Deslocamento atrasado",
  "Atendimento anterior estendeu além do previsto",
  "Problema mecânico / Transporte",
  "Imprevisto com materiais / ferramentas",
  "Condições climáticas adversas",
  "Emergência operacional",
  "Outro motivo",
];

export const DELAY_PRESETS = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "1 hora", minutes: 60 },
  { label: "1h 30min", minutes: 90 },
  { label: "2 horas", minutes: 120 },
  { label: "2h 30min", minutes: 150 },
  { label: "3 horas", minutes: 180 },
  { label: "4 horas", minutes: 240 },
  { label: "Próx. Dia (+24h)", minutes: 1440 },
];

export const QUICK_TIMES = ["08:30", "10:00", "11:00", "13:30", "14:30", "16:00", "17:30", "18:30"];

export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  if (!timeStr) return "11:00";
  const [h = 9, m = 0] = timeStr.split(":").map(Number);
  const totalMinutes = h * 60 + m + minutesToAdd;
  const newH = Math.floor((totalMinutes % (24 * 60)) / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}
