import Image from "next/image";
import { SearchBar } from "./search-bar";

export function HeroSection() {
  return (
    <div className="relative flex min-h-65 items-center justify-between overflow-hidden rounded-2xl bg-[#EBEBEB] px-12 py-10">
      
      {/* LEFT */}
      <div className="z-10 max-w-130">
        <h1 className="text-4xl font-bold leading-tight text-[#1A1A1A]">
          Agilize sua vida com
          <br />
          <span className="text-[#00A86B]">os serviços Agilis</span>
        </h1>   

        {/* 🔥 Aqui entra seu componente */}
        <SearchBar />
      </div>

      {/* RIGHT */}
      <div className="pointer-events-none absolute right-0 bottom-0 flex items-end justify-end">
        
        {/* círculo grande */}
        <div className="absolute -right-10 -bottom-10 h-75 w-75 rounded-full bg-[#008F5A]" />

        {/* círculo menor */}
        <div className="absolute right-15 -bottom-15 h-45 w-45 rounded-full bg-[#00A86B]" />

        {/* imagem */}
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