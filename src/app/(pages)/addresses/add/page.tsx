import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageTransition } from "@/components/ui/motion";
import { AddressForm } from "../_components/address-form/address-form";

export default function AddAddressPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6">
      <PageTransition className="flex w-full max-w-xl flex-col gap-8">
        <div className="flex items-center gap-3">
          <Link
            href="/addresses"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-foreground/5"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Adicione um endereço</h1>
        </div>

        <AddressForm />
      </PageTransition>
    </div>
  );
}