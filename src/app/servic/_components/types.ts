export type AppointmentStatus = "in-progress" | "scheduled" | "completed" | "canceled";

export interface Appointment {
  id: string;
  serviceName: string;
  scheduledFor: string;
  providerName: string;
  providerAvatarUrl: string;
  price: number;
  imageUrl: string;
  status: AppointmentStatus;
}