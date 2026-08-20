export type NotificationType = "appointment" | "payment" | "promotion" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  date: string;
  isRead: boolean;
}