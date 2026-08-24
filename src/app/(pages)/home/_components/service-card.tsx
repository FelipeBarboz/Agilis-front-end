"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "motion/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function ServiceCard({ href, icon, title, description }: ServiceCardProps) {
  return (
    <Link href={href} className="group flex h-full flex-col focus-visible:outline-none">
      <motion.div className="flex h-full flex-col" whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }}>
        <Card className="flex h-full flex-col cursor-pointer transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-primary">
          <CardHeader className="flex flex-col items-center pb-2 pt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
              {icon}
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-start pb-6 text-center">
            <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}