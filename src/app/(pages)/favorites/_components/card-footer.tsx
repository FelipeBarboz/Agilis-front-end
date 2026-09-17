import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardFooterProps {
  serviceId: string;
  startingPrice: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CardFooter({ serviceId, startingPrice }: CardFooterProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 p-4 pt-3">
      <div>
        <span className="block text-[11px] leading-none text-muted-foreground">
          A partir de
        </span>
        <span className="text-lg font-bold text-foreground">
          {formatCurrency(startingPrice)}
        </span>
      </div>

      <Button asChild size="sm" className="cursor-pointer gap-1.5 rounded-xl text-xs font-medium">
        <Link href={`/services/${serviceId}`}>
          Contratar
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}
