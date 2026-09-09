"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RegisterButtonProps {
  href?: string;
  label?: string;
}

export function RegisterButton({
  href = "/register/user",
  label = "Cadastre-se",
}: RegisterButtonProps) {
  return (
    <Button asChild variant="primary" size="lg">
      <Link href={href}>{label}</Link>
    </Button>
  );
}
