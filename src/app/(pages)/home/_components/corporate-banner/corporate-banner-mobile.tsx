"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useCorporateBanner } from "./use-corporate-banner";

export function CorporateBannerMobile() {
  const { title, buttonText, href } = useCorporateBanner();

  return (
    <section className="relative w-full overflow-hidden bg-primary pt-5 text-primary-foreground">
      {/* Top pill com estilo oficial Agilis */}
      <motion.div
        className="flex justify-center px-4"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="inline-flex items-center justify-center rounded-full bg-brand-dark px-7 py-2 text-center text-xs sm:text-sm font-bold text-white shadow-xs tracking-wide">
          Seja um prestador Agilis
        </div>
      </motion.div>

      {/* Corpo do banner: Imagem do profissional à esquerda e Chamada + Botão à direita */}
      <div className="relative mx-auto flex max-w-sm sm:max-w-md items-end justify-between px-3 sm:px-6 pt-3">
        {/* Foto do prestador com capacete laranja e espátula */}
        <motion.div
          className="relative -mb-0.5 h-54 w-38 shrink-0 sm:h-64 sm:w-46"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        >
          <Image
            src="/img/img-agilizador.png"
            alt="Prestador Agilis"
            fill
            className="object-contain object-bottom drop-shadow-sm"
            priority
          />
        </motion.div>

        {/* Textos dinâmicos e Botão oficial Agilis */}
        <motion.div
          className="flex flex-1 flex-col justify-center pb-8 sm:pb-10 pl-2 pr-1"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        >
          <div className="text-lg sm:text-2xl font-extrabold leading-tight text-white tracking-tight">
            {title}
          </div>

          <div className="mt-4">
            <Button
              asChild
              variant="primary"
              className="rounded-xl px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Link href={href}>{buttonText}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}