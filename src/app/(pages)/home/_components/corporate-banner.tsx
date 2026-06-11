import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CorporateBanner() {
  return (
    <div className="relative flex min-h-[130px] items-center justify-between overflow-hidden rounded-2xl bg-[#00A86B] px-10">
      {/* Text */}
      <p className="z-10 max-w-[280px] text-xl leading-snug font-light text-white">
        <span className="font-bold">Cadastre-se </span>
        para criar
        <br />
        <span className="font-bold">sua conta </span>
        corporativa
      </p>

      {/* CTA button — asChild passa as props do Button para o Link */}
      <Button asChild variant="primary" size="lg" className="z-10 font-bold">
        <Link href="/register/corporate">Cadastre-se</Link>
      </Button>

      {/* Building illustration */}
      <div className="absolute right-0 bottom-0 h-full w-[220px] opacity-90">
        <Image
          src="/images/building-banner.png"
          alt=""
          fill
          className="object-contain object-right-bottom"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
