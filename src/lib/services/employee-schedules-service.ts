import { api } from "@/lib/api";

// ==========================================
// 1. HORÁRIO DA LOJA (/business-hours)
// ==========================================

export interface StoreBusinessHour {
  id?: string;
  storeId?: string;
  dayOfWeek: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
  opensAt: string;   // "09:00:00"
  closesAt: string;  // "18:00:00"
}

export interface UpdateStoreBusinessHourPayload {
  dayOfWeek: number; // 0..6
  opensAt: string;   // "09:00:00"
  closesAt: string;  // "18:00:00"
}

/**
 * GET: /api/v1/stores/{storeId}/business-hours
 * Lista os horários de funcionamento da loja para cada dia da semana configurado
 */
export async function getStoreBusinessHours(
  storeId: string
): Promise<StoreBusinessHour[]> {
  const data = await api<StoreBusinessHour[]>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/business-hours`
  );
  return Array.isArray(data) ? data : [];
}

/**
 * PUT: /api/v1/stores/{storeId}/business-hours
 * Cria ou atualiza o horário de um dia específico (upsert)
 */
export async function updateStoreBusinessHour(
  storeId: string,
  payload: UpdateStoreBusinessHourPayload
): Promise<StoreBusinessHour> {
  return await api<StoreBusinessHour>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/business-hours`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

// ==========================================
// 2. ESCALA DO FUNCIONÁRIO (/schedules)
// ==========================================

export type ScheduleType = "FIXED" | "STORE_HOURS" | "FLEXIBLE";

export interface CreateSchedulePayload {
  employeeId: string;
  scheduleType: ScheduleType;
  monthlyHoursQuota?: number | null;
  monthlyDaysQuota?: number | null;
}

export interface CreateScheduleResponse {
  id: string; // scheduleId
  employeeId: string;
  storeId: string;
  scheduleType: ScheduleType;
  monthlyHoursQuota: number | null;
  monthlyDaysQuota: number | null;
}

export interface WeeklyScheduleDaySlotPayload {
  dayOfWeek: number;        // 0=Domingo, 1=Segunda, ..., 6=Sábado
  isDayOff: boolean;
  startTime: string | null; // "09:00:00" quando !isDayOff, null quando isDayOff
  endTime: string | null;   // "18:00:00" quando !isDayOff, null quando isDayOff
}

export interface ActiveSlotResponse {
  slotId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  hours: number;
}

export interface SaveWeeklyScheduleResponse {
  scheduleId: string;
  employeeId: string;
  storeId: string;
  weeklyTotalHours: number;
  daysOffCount: number;
  activeSlots: ActiveSlotResponse[];
}

export interface AddScheduleSlotPayload {
  dayOfWeek?: number | null;
  specificDate?: string | null;
  startTime: string;
  endTime: string;
}

export interface ScheduleSlotItemDTO {
  id: string;
  employeeScheduleId: string;
  dayOfWeek: number | null;
  specificDate: string | null;
  startTime: string;
  endTime: string;
}

/**
 * PUT: /api/v1/stores/{storeId}/schedules/employees/{employeeId}/weekly
 * Configura/substitui todos os turnos da semana de um funcionário.
 * Cria a escala automaticamente se não existir.
 */
export async function saveEmployeeWeeklySchedule(
  storeId: string,
  employeeId: string,
  slots: WeeklyScheduleDaySlotPayload[]
): Promise<SaveWeeklyScheduleResponse> {
  return await api<SaveWeeklyScheduleResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules/employees/${encodeURIComponent(employeeId)}/weekly`,
    {
      method: "PUT",
      body: JSON.stringify(slots),
    }
  );
}

/**
 * POST: /api/v1/stores/{storeId}/schedules
 * Cria a escala de um funcionário na loja
 */
export async function createEmployeeSchedule(
  storeId: string,
  payload: CreateSchedulePayload
): Promise<CreateScheduleResponse> {
  return await api<CreateScheduleResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/**
 * GET: /api/v1/stores/{storeId}/schedules/{scheduleId}/slots
 * Lista todos os slots de horário de uma escala
 */
export async function getScheduleSlots(
  storeId: string,
  scheduleId: string
): Promise<ScheduleSlotItemDTO[]> {
  const data = await api<ScheduleSlotItemDTO[]>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules/${encodeURIComponent(scheduleId)}/slots`
  );
  return Array.isArray(data) ? data : [];
}

/**
 * POST: /api/v1/stores/{storeId}/schedules/{scheduleId}/slots
 * Adiciona um único turno à escala
 */
export async function addScheduleSlot(
  storeId: string,
  scheduleId: string,
  payload: AddScheduleSlotPayload
): Promise<ScheduleSlotItemDTO> {
  return await api<ScheduleSlotItemDTO>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules/${encodeURIComponent(scheduleId)}/slots`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/**
 * DELETE: /api/v1/stores/{storeId}/schedules/slots/{slotId}
 * Remove um turno específico da escala
 */
export async function deleteScheduleSlot(
  storeId: string,
  slotId: string
): Promise<void> {
  await api(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules/slots/${encodeURIComponent(slotId)}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * DELETE: /api/v1/stores/{storeId}/schedules/employees/{employeeId}
 * Remove toda a escala de um funcionário da loja
 */
export async function removeEmployeeFromSchedule(
  storeId: string,
  employeeId: string
): Promise<void> {
  await api(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules/employees/${encodeURIComponent(employeeId)}`,
    {
      method: "DELETE",
    }
  );
}

// ==========================================
// 3. VISUALIZAÇÃO DE ESCALA (/weekly & /daily)
// ==========================================

export interface WeeklyScheduleMetrics {
  totalMembersInSchedule: number;
  activePercentage: number;
  weeklyTotalHours: number;
  dailyAverageCoverage: number;
  todayInStoreCount: number;
  todayTotalCount: number;
  todayOffCount: number;
}

export interface WeeklyScheduleDayHeader {
  dayOfWeek: number;
  date: string;
  dayOfMonth: number;
  dayLabel: string;
  activeCount: number;
  totalCount: number;
}

export interface WeeklyScheduleEmployeeDay {
  dayOfWeek: number;
  date: string;
  dayOfMonth: number;
  dayLabel: string;
  isDayOff: boolean;
  formattedHours: string;
  startTime: string | null;
  endTime: string | null;
  hours: number;
}

export interface WeeklyScheduleEmployee {
  employeeId: string;
  name: string;
  positionTitle: string;
  isCurrentUser?: boolean;
  weeklyHours: number;
  daysOffCount: number;
  days: WeeklyScheduleEmployeeDay[];
}

export interface StoreWeeklyScheduleResponse {
  weekStartDate: string;
  weekEndDate: string;
  metrics: WeeklyScheduleMetrics;
  dayHeaders: WeeklyScheduleDayHeader[];
  employees: WeeklyScheduleEmployee[];
  availablePositions: string[];
}

export interface DailyScheduleWeekStripItem {
  date: string;
  dayOfMonth: number;
  dayLabel: string;
  scheduledCount: number;
  isSelected?: boolean;
}

export interface DailyScheduleHourlyCoverage {
  hour: number;
  hourLabel: string;
  workingCount: number;
}

export interface DailyScheduleEmployee {
  employeeId: string;
  name: string;
  positionTitle: string;
  isCurrentUser?: boolean;
  isDayOff: boolean;
  formattedHours: string;
  startTime: string | null;
  endTime: string | null;
}

export interface StoreDailyScheduleResponse {
  date: string;
  scheduledCount: number;
  daysOffCount: number;
  coverageInterval: string;
  weekStrip: DailyScheduleWeekStripItem[];
  hourlyCoverage: DailyScheduleHourlyCoverage[];
  employees: DailyScheduleEmployee[];
}

/**
 * GET: /api/v1/stores/{storeId}/schedules/weekly?startDate=YYYY-MM-DD
 * Retorna a escala completa de todos os funcionários para a semana inteira.
 * A semana começa na segunda-feira da data informada.
 */
export async function getStoreWeeklySchedule(
  storeId: string,
  startDate?: string
): Promise<StoreWeeklyScheduleResponse> {
  const query = startDate ? `?startDate=${encodeURIComponent(startDate)}` : "";
  return await api<StoreWeeklyScheduleResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules/weekly${query}`
  );
}

/**
 * GET: /api/v1/stores/{storeId}/schedules/daily?date=YYYY-MM-DD
 * Retorna a visão de um único dia com todos os funcionários, timeline horária e strip da semana.
 */
export async function getStoreDailySchedule(
  storeId: string,
  date?: string
): Promise<StoreDailyScheduleResponse> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return await api<StoreDailyScheduleResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules/daily${query}`
  );
}

// ==========================================
// 4. DISPONIBILIDADE DE HORÁRIOS (/availability)
// ==========================================

export interface ServiceAvailabilityResponse {
  availableSlots: string[];
  canChooseEmployee: boolean;
}

/**
 * GET: /api/v1/services/{serviceId}/availability?date=YYYY-MM-DD&employeeId=uuid
 * Retorna os horários livres para um serviço em uma data.
 */
export async function getServiceAvailability(
  serviceId: string,
  date: string,
  employeeId?: string
): Promise<ServiceAvailabilityResponse> {
  const params = new URLSearchParams({ date });
  if (employeeId) params.set("employeeId", employeeId);
  return await api<ServiceAvailabilityResponse>(
    `/api/v1/services/${encodeURIComponent(serviceId)}/availability?${params.toString()}`
  );
}

// ==========================================
// 5. CONFIGURAÇÃO: SELEÇÃO DE FUNCIONÁRIO
// ==========================================

/**
 * PATCH: /api/v1/stores/{storeId}/settings/employee-selection?allow=true
 * Liga ou desliga a possibilidade do cliente escolher o funcionário no agendamento.
 */
export async function updateStoreEmployeeSelection(
  storeId: string,
  allow: boolean
): Promise<void> {
  await api(
    `/api/v1/stores/${encodeURIComponent(storeId)}/settings/employee-selection?allow=${allow}`,
    {
      method: "PATCH",
    }
  );
}
