"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FadeInSection } from "@/components/ui/motion";

export function CorporateBannerMobile() {
  return (
    <FadeInSection>
      <div className="relative flex min-h-32.5 items-center overflow-hidden rounded-2xl bg-primary px-10">

        <motion.p
          className="z-10 max-w-70 text-xl leading-snug font-bold text-foreground"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="text-primary-foreground">Cadastre-se </span>
          para criar
          <br />
          <span className="text-primary-foreground">sua conta </span>
          corporativa
        </motion.p>

        <motion.div
          className="z-10 ml-auto mr-60"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          <Button asChild variant="primary" size="lg">
            <Link href="/register/user">Cadastre-se</Link>
          </Button>
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