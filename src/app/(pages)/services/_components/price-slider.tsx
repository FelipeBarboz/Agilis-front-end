"use client";

interface PriceSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceSlider({ min, max, value, onChange }: PriceSliderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>R$ {value[0]}</span>
        <span>R$ {value[1]}</span>
      </div>

      <div className="relative flex items-center">
        {/* Track */}
        <div className="relative h-1.5 w-full rounded-full bg-muted">
          <div
            className="absolute h-full rounded-full bg-primary"
            style={{
              left: `${((value[0] - min) / (max - min)) * 100}%`,
              right: `${100 - ((value[1] - min) / (max - min)) * 100}%`,
            }}
          />
        </div>

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={value[0]}
          onChange={(e) => {
            const newMin = Math.min(Number(e.target.value), value[1] - 10);
            onChange([newMin, value[1]]);
          }}
          className="absolute w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={value[1]}
          onChange={(e) => {
            const newMax = Math.max(Number(e.target.value), value[0] + 10);
            onChange([value[0], newMax]);
          }}
          className="absolute w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
    </div>
  );
}