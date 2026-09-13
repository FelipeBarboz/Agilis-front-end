import { useState, useRef, useEffect } from "react";
import { MapPin, Plus, Search, X } from "lucide-react";
import { BRAZILIAN_CITIES } from "@/lib/constants/brazilian-cities";

interface AttendanceCitiesFieldProps {
  cities: string[];
  onAddCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
}

export function AttendanceCitiesField({
  cities,
  onAddCity,
  onRemoveCity,
}: AttendanceCitiesFieldProps) {
  const [cityQuery, setCityQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown quando clica fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCities = BRAZILIAN_CITIES.filter((cityName) => {
    const matchesQuery = cityName
      .toLowerCase()
      .includes(cityQuery.toLowerCase().trim());
    const notAlreadySelected = !cities.includes(cityName);
    return matchesQuery && notAlreadySelected;
  }).slice(0, 7);

  const handleSelect = (cityName: string) => {
    onAddCity(cityName);
    setCityQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="city-input" className="text-xs font-bold text-foreground">
        Cidades atendidas
      </label>

      {/* Badges de cidades adicionadas */}
      {cities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {cities.map((city) => (
            <div
              key={city}
              className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
            >
              <span>{city}</span>
              <button
                type="button"
                onClick={() => onRemoveCity(city)}
                className="text-primary/60 transition-colors hover:text-destructive cursor-pointer"
                aria-label={`Remover ${city}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input com Autocomplete */}
      <div ref={autocompleteRef} className="relative">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
          <input
            id="city-input"
            type="text"
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => {
              if (filteredCities.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder="Digite o nome da cidade (ex: Guarulhos, São Paulo...)"
            className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {cityQuery && (
            <button
              type="button"
              onClick={() => {
                setCityQuery("");
                setIsDropdownOpen(false);
              }}
              className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Menu Dropdown de sugestões */}
        {isDropdownOpen && filteredCities.length > 0 && (
          <div className="absolute left-0 top-full z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Cidades sugeridas
            </div>
            {filteredCities.map((cityName) => (
              <button
                key={cityName}
                type="button"
                onClick={() => handleSelect(cityName)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary" />
                  <span>{cityName}</span>
                </div>
                <span className="text-xs font-semibold text-primary">
                  + Adicionar
                </span>
              </button>
            ))}
          </div>
        )}

        {isDropdownOpen &&
          cityQuery.trim().length > 0 &&
          filteredCities.length === 0 && (
            <div className="absolute left-0 top-full z-30 mt-1 w-full rounded-xl border border-border bg-card p-3 shadow-lg text-center">
              <p className="text-xs text-muted-foreground">
                Nenhuma cidade encontrada para &ldquo;{cityQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => handleSelect(cityQuery.trim())}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <Plus className="size-3.5" />
                Adicionar &ldquo;{cityQuery.trim()}&rdquo; mesmo assim
              </button>
            </div>
          )}
      </div>
      <p className="text-xs text-muted-foreground">
        Adicione todas as cidades em que sua equipe realiza atendimentos
      </p>
    </div>
  );
}
