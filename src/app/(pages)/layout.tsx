import { type ReactNode } from "react";
import { DynamicSidebar } from "@/components/dynamic-sidebar";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DynamicSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
