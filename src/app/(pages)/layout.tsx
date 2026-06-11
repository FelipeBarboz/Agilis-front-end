import { type ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
