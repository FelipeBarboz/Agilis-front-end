import {
  Calendar,
  Wallet,
  Tag,
  MessageSquare,
  Info,
  AlertTriangle,
} from "lucide-react";
import type { NotificationType } from "@/lib/mocks/notifications";

export const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  appointment: Calendar,
  payment: Wallet,
  promotion: Tag,
  message: MessageSquare,
  system: Info,
  delay: AlertTriangle,
};

export const TYPE_COLORS: Record<
  NotificationType,
  { bg: string; text: string }
> = {
  appointment: {
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-600",
  },
  payment: {
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    text: "text-amber-600",
  },
  promotion: {
    bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    text: "text-purple-600",
  },
  message: {
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    text: "text-blue-600",
  },
  system: {
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
  },
  delay: {
    bg: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30",
    text: "text-amber-700 dark:text-amber-400",
  },
};
