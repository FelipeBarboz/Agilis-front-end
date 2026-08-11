import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "./status-badge";
import type { Appointment } from "./types";

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <Link
      href={`/history/${appointment.id}`}
      className="flex gap-3 rounded-xl bg-background p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={appointment.imageUrl}
          alt={appointment.serviceName}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold leading-tight text-foreground">
            {appointment.serviceName}
          </h3>
          <p className="text-xs text-muted-foreground">
            {appointment.scheduledFor}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full">
              <Image
                src={appointment.providerAvatarUrl}
                alt={appointment.providerName}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {appointment.providerName}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-bold text-foreground">
            {formatCurrency(appointment.price)}
          </span>
          <StatusBadge status={appointment.status} />
        </div>
      </div>
    </Link>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}