import { type ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
