import Link from "next/link";
import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function ServiceCard({
  href,
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <Link href={href} className="group block focus-visible:outline-none">
      <Card className="h-full cursor-pointer transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-primary">
        <Card.Header className="flex flex-col items-center pb-2 pt-6">

          {/* Ícone com fundo circular */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
            {icon}
          </div>

        </Card.Header>
        <Card.Body className="flex flex-col items-center pb-6 text-center">
          <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        </Card.Body>
      </Card>
    </Link>
  );
}