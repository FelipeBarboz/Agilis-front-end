import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative flex min-h-[240px] items-center justify-between overflow-hidden rounded-2xl bg-[#EBEBEB] px-10 py-8">
      {/* Text content */}
      <div className="z-10 max-w-[420px]">
        <h1 className="text-4xl leading-tight font-bold text-[#1A1A1A]">
          Agilize sua vida com
          <br />
          <span className="text-[#00A86B]">os serviços Agilis</span>
        </h1>
      </div>

      {/* Worker illustration — decorative, no alt text needed */}
      <div className="absolute right-8 bottom-0 flex h-[260px] w-[260px] items-end justify-center">
        {/* Green circle background */}
        <div className="absolute right-4 bottom-0 h-[220px] w-[220px] rounded-full bg-[#00A86B]" />
        {/* Worker image — replace src with your actual asset */}
        <div className="relative z-10 h-[250px] w-[220px]">
          <Image
            src="/images/worker-hero.png"
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
