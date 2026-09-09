"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FadeInSection } from "@/components/ui/motion";
import { RegisterButton } from "./register-button";
import { useCorporateBanner } from "./use-corporate-banner";

export function CorporateBannerDesktop() {
  const { title, buttonText, href } = useCorporateBanner();

  return (
    <FadeInSection>
      <div className="relative flex min-h-32.5 items-center overflow-hidden rounded-2xl bg-primary px-10">

        <motion.p
          className="z-10 max-w-85 text-xl leading-snug font-bold text-foreground"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {title}
        </motion.p>

        <motion.div
          className="z-10 ml-auto mr-60"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          <RegisterButton href={href} label={buttonText} />
        </motion.div>

        <div className="absolute right-0 bottom-0 h-full w-55 opacity-90">
          <Image
            src="/img/img-predio.png"
            alt=""
            fill
            className="object-contain object-bottom-right"
            aria-hidden="true"
          />
        </div>

      </div>
    </FadeInSection>
  );
}