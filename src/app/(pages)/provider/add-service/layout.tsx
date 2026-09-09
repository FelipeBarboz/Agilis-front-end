import { type ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AddServiceLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
