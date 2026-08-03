import { MapPin } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Address } from "@/types/address";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          {address.street}, {address.number}
        </CardTitle>
        {address.complement && (
          <CardDescription>{address.complement}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin size={16} />
        {address.cep}
      </CardContent>
    </Card>
  );
}