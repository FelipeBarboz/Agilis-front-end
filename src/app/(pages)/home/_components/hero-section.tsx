import Image from "next/image";
import { SearchBar } from "./search-bar";

export function HeroSection() {
  return (
    <div className="relative flex min-h-65 items-center justify-between overflow-hidden rounded-2xl bg-secondary px-12 py-10">

      {/* LEFT */}
      <div className="z-10 max-w-130">
        <h1 className="text-4xl font-bold leading-tight text-foreground">
          Agilize sua vida com
          <br />
          <span className="text-primary">os serviços Agilis</span>
        </h1>

        <SearchBar />
      </div>

      {/* RIGHT */}
      <div className="pointer-events-none absolute right-0 bottom-0 flex items-end justify-end">

        {/* Círculo grande — versão escura do verde */}
        <div className="absolute -right-10 -bottom-10 h-75 w-75 rounded-full bg-brand-green-dark" />

        {/* Círculo menor — verde primário */}
        <div className="absolute right-15 -bottom-15 h-45 w-45 rounded-full bg-primary" />

        {/* Imagem do profissional */}
        <div className="relative z-10 h-75 w-65">
          <Image
            src="/img/img-agilizador.png"
            alt="Profissional Agilis"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>

      </div>
    </div>
  );
}