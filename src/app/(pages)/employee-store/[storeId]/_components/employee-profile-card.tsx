"use client";

interface EmployeeProfileCardProps {
  employeeName: string;
  positionTitle: string;
  isOnShift?: boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getPtBRDate(date: Date) {
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleDateString("pt-BR", { month: "long" });
  const year = date.getFullYear();
  const weekdayCap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return { weekday: weekdayCap, full: `${day} de ${month} de ${year}` };
}

export function EmployeeProfileCard({
  employeeName,
  positionTitle,
  isOnShift = true,
}: EmployeeProfileCardProps) {
  const now = new Date();
  const { weekday, full } = getPtBRDate(now);
  const initials = getInitials(employeeName);

  return (
    <div className="flex flex-col gap-5 rounded-[22px] border border-border bg-card p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Avatar + info */}
        <div className="flex items-start gap-5">
          {/* Avatar circular */}
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#006b49] text-[44px] font-light text-white shadow-sm select-none">
            {initials}
          </div>

          {/* Nome, cargo, jornada */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {employeeName}
              </h1>

              {/* Selo de status */}
              {isOnShift ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-[14px] py-[5px] text-[13px] font-semibold text-primary-foreground shadow-[0_2px_8px_hsl(var(--primary)/0.35)] pl-[11px]">
                  <span
                    className="relative flex h-2 w-2 shrink-0"
                    aria-hidden="true"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  Em Expediente
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-muted border border-border px-[14px] py-[5px] text-[13px] font-semibold text-muted-foreground pl-[11px]">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground shrink-0" aria-hidden="true" />
                  Fora do Expediente
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[15px] text-foreground">
                <span className="text-primary" aria-hidden="true">
                  {/* Briefcase icon inline */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="14" x="2" y="7" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </span>
                <span>{positionTitle}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[15px] text-foreground">
                <span className="text-primary" aria-hidden="true">
                  {/* Clock icon inline */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <span>
                  Jornada:{" "}
                  <span className="font-semibold">08:00 – 18:00</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Data — canto direito */}
        <div className="flex flex-col items-start sm:items-end gap-0.5 shrink-0 mt-1">
          <span className="text-[13px] text-muted-foreground">{weekday}</span>
          <span className="text-[14px] font-semibold text-foreground">{full}</span>
        </div>
      </div>
    </div>
  );
}
