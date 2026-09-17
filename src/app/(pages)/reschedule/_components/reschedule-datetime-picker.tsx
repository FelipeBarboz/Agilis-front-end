import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export const AVAILABLE_TIMES = [
  "08:00",
  "09:30",
  "11:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
];

interface RescheduleDateTimePickerProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  minDate?: Date;
  times?: string[];
}

export function RescheduleDateTimePicker({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  minDate,
  times = AVAILABLE_TIMES,
}: RescheduleDateTimePickerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Selecione uma nova data e horário
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Escolha o melhor dia para a realização do seu serviço
        </p>
      </div>

      {/* Date and Time Pickers in a responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
        {/* Date Selector with Shadcn Calendar */}
        <div className="space-y-2 flex flex-col items-center sm:items-start">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider self-start">
            Nova Data
          </label>
          <Calendar
            selected={selectedDate}
            onSelect={onSelectDate}
            minDate={minDate}
            className="w-full max-w-sm"
          />
        </div>

        {/* Time Selector */}
        <div className="space-y-2 flex-1">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Horários Disponíveis
          </label>
          <div className="grid grid-cols-2 gap-2">
            {times.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => onSelectTime(time)}
                  className={`rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border bg-muted/40 text-foreground hover:bg-muted"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
