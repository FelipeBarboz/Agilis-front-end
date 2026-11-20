import { api } from "@/lib/api";

export interface CreateBookingDTO {
  serviceId: string;
  storeId?: string;
  unitId?: string;
  date: string;
  time: string;
  address?: string;
  notes?: string;
  price?: number;
  package?: string;
}

export interface BookingResponseDTO {
  id?: string;
  bookingId?: string;
  status?: string;
  serviceId?: string;
  storeId?: string;
  amount?: number;
  createdAt?: string;
}

/**
 * Cria um agendamento com status inicial PENDING:
 * POST /api/v1/bookings
 */
export async function createBooking(
  payload: CreateBookingDTO
): Promise<BookingResponseDTO> {
  return await api<BookingResponseDTO>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify({
      serviceId: payload.serviceId,
      storeId: payload.storeId,
      unitId: payload.unitId,
      date: payload.date,
      time: payload.time,
      address: payload.address,
      notes: payload.notes,
      price: payload.price,
      package: payload.package,
    }),
  });
}
