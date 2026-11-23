import { api } from "@/lib/api";

export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface WeeklyScheduleDaySlotPayload {
  dayOfWeek: number; // 1=Segunda...6=Sábado, 7=Domingo (ISO-8601)
  isDayOff: boolean;
  startTime: TimeObject;
  endTime: TimeObject;
}

export interface ActiveSlotResponse {
  slotId: string;
  dayOfWeek: number;
  startTime: TimeObject;
  endTime: TimeObject;
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

export interface CreateSchedulePayload {
  requesterId?: string;
  storeId: string;
  employeeId: string;
  scheduleType?: string;
  monthlyHoursQuota?: number;
  monthlyDaysQuota?: number;
}

export interface CreateScheduleResponse {
  id: string;
  employeeId: string;
  storeId: string;
  scheduleType: string;
  monthlyHoursQuota: number;
  monthlyDaysQuota: number;
}

export interface ScheduleSlotItemDTO {
  id: string;
  employeeScheduleId: string;
  dayOfWeek: number;
  specificDate?: string;
  startTime: TimeObject;
  endTime: TimeObject;
}

export interface AddScheduleSlotPayload {
  requesterId?: string;
  employeeScheduleId: string;
  dayOfWeek: number;
  specificDate?: string;
  startTime: TimeObject;
  endTime: TimeObject;
}

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
  startTime?: TimeObject;
  endTime?: TimeObject;
  hours: number;
}

export interface WeeklyScheduleEmployee {
  employeeId: string;
  name: string;
  positionTitle: string;
  isCurrentUser?: boolean;
  days: WeeklyScheduleEmployeeDay[];
  weeklyHours: number;
  daysOffCount: number;
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
  startTime?: TimeObject;
  endTime?: TimeObject;
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
 * PUT: /api/v1/stores/{storeId}/schedules/employees/{employeeId}/weekly
 * Salva a escala semanal completa de um funcionário
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
 * Cria uma escala de trabalho para um funcionário
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
 * Lista os horários da escala de funcionários
 */
export async function getScheduleSlots(
  storeId: string,
  scheduleId: string
): Promise<ScheduleSlotItemDTO[]> {
  return await api<ScheduleSlotItemDTO[]>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules/${encodeURIComponent(scheduleId)}/slots`
  );
}

/**
 * POST: /api/v1/stores/{storeId}/schedules/{scheduleId}/slots
 * Adiciona um intervalo de horário na escala do funcionário
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
 * GET: /api/v1/stores/{storeId}/schedules/weekly
 * Consulta a escala semanal dos funcionários da loja
 */
export async function getStoreWeeklySchedule(
  storeId: string,
  date?: string
): Promise<StoreWeeklyScheduleResponse> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return await api<StoreWeeklyScheduleResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/schedules/weekly${query}`
  );
}

/**
 * GET: /api/v1/stores/{storeId}/schedules/daily
 * Consulta a escala diária dos funcionários da loja
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

/**
 * DELETE: /api/v1/stores/{storeId}/schedules/slots/{slotId}
 * Remove um intervalo de horário da escala
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
 * Remove um funcionário da escala da loja
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
