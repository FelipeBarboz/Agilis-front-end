"use client";

import { useState } from "react";
import { Clock, User, Wrench, Calendar as CalendarIcon } from "lucide-react";
import { StoreCalendar } from "./store-calendar";

interface Appointment {
  id: string;
  time: string;
  employee: string;
  service: string;
  client: string;
}

// Map dates to appointments (YYYY-MM-DD)
// Using dynamically generated dates based on today for testing
const today = new Date();
const y = today.getFullYear();
const m = String(today.getMonth() + 1).padStart(2, "0");
const d = String(today.getDate()).padStart(2, "0");
const todayStr = `${y}-${m}-${d}`;

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tm_y = tomorrow.getFullYear();
const tm_m = String(tomorrow.getMonth() + 1).padStart(2, "0");
const tm_d = String(tomorrow.getDate()).padStart(2, "0");
const tomorrowStr = `${tm_y}-${tm_m}-${tm_d}`;

const mockAppointments: Record<string, Appointment[]> = {
  [todayStr]: [
    { id: "1", time: "14:00", employee: "Rafael", service: "Reparação de encanamento", client: "João Carlos" },
    { id: "2", time: "15:30", employee: "Ana", service: "Manutenção de Aquecedor", client: "Maria Silva" },
  ],
  [tomorrowStr]: [
    { id: "3", time: "09:00", employee: "Carlos", service: "Limpeza de filtro", client: "Eduardo" },
    { id: "4", time: "11:00", employee: "Rafael", service: "Instalação de Bomba", client: "Fernanda" },
    { id: "5", time: "14:00", employee: "Ana", service: "Vistoria Técnica", client: "Roberto" },
  ],
};

// Formats YYYY-MM-DD to "DD de Mes"
function formatDateVerbose(dateStr: string) {
  const [year = 0, month = 1, day = 1] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
}

export function SchedulingList() {
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);

  const bookedDates = Object.keys(mockAppointments);
  const appointmentsForSelectedDate = selectedDate ? (mockAppointments[selectedDate] || []) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Esquerda: Calendário */}
      <div className="lg:w-1/2 w-full shrink-0">
        <StoreCalendar 
          bookedDates={bookedDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>
      
      {/* Direita: Lista de agendamentos */}
      <div className="lg:w-1/2 w-full flex flex-col gap-4 lg:border-l lg:border-border lg:pl-8">
        
        {!selectedDate && (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CalendarIcon className="size-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Selecione uma data no calendário para ver os agendamentos.</p>
          </div>
        )}

        {selectedDate && (
          <>
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <h3 className="text-lg font-bold text-foreground">
                {formatDateVerbose(selectedDate)}
              </h3>
              {selectedDate === todayStr && (
                <span className="rounded-full bg-[#00d68f]/10 px-2.5 py-0.5 text-xs font-semibold text-[#00d68f]">
                  Hoje
                </span>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              {appointmentsForSelectedDate.map((appt) => (
                <div 
                  key={appt.id} 
                  className="flex flex-col p-4 rounded-xl border bg-white shadow-sm hover:border-[#00d68f]/30 transition-colors gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-base">{appt.client}</span>
                    <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 shrink-0">
                      <Clock className="size-3.5 text-[#00d68f]" />
                      <span className="text-sm font-bold text-foreground">{appt.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Wrench className="size-4 shrink-0" />
                      {appt.service}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <User className="size-4 shrink-0" />
                      Responsável: <span className="font-semibold text-foreground">{appt.employee}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {appointmentsForSelectedDate.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl gap-2 mt-2">
                  <span className="text-base">Nenhum agendamento para este dia.</span>
                  <span className="text-xs">Clique em outra data com um pontinho para ver os dados.</span>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
