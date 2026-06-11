import Image from "next/image";
import { SearchBar } from "./search-bar";

export function HeroSection() {
  return (
    <div className="relative flex min-h-[260px] items-center justify-between overflow-hidden rounded-2xl bg-[#EBEBEB] px-12 py-10">
      
      {/* LEFT */}
      <div className="z-10 max-w-[520px]">
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
        <div className="absolute right-[-40px] bottom-[-40px] h-[300px] w-[300px] rounded-full bg-[#008F5A]" />

        {/* círculo menor */}
        <div className="absolute right-[60px] bottom-[-60px] h-[180px] w-[180px] rounded-full bg-[#00A86B]" />

        {/* imagem */}
        <div className="relative z-10 h-[300px] w-[260px]">
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