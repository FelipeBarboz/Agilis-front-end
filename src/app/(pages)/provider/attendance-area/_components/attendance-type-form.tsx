"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AttendanceTypeSelector,
  type AttendanceType,
} from "./attendance-type-selector";
import { AttendanceRadiusField } from "./attendance-radius-field";
import { AttendanceCitiesField } from "./attendance-cities-field";
import { AttendanceFormActions } from "./attendance-form-actions";

export function AttendanceTypeForm() {
  const router = useRouter();
  const [selectedType, setSelectedType] =
    useState<AttendanceType>("CLIENT_LOCATION");
  const [cities, setCities] = useState<string[]>(["Guarulhos - SP"]);

  const handleAddCity = (cityToAdd: string) => {
    if (!cities.includes(cityToAdd)) {
      setCities((prev) => [...prev, cityToAdd]);
    }
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setCities((prev) => prev.filter((city) => city !== cityToRemove));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_attendanceArea", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <AttendanceTypeSelector
        selectedType={selectedType}
        onChange={setSelectedType}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <AttendanceRadiusField selectedType={selectedType} />

      {/* Separador */}
      <div className="h-px bg-border" />

      <AttendanceCitiesField
        cities={cities}
        onAddCity={handleAddCity}
        onRemoveCity={handleRemoveCity}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <AttendanceFormActions />
    </form>
  );
}
