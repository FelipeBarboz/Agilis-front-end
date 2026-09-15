import { type ReactNode } from "react";
import { DynamicSidebar } from "@/components/dynamic-sidebar";
import { HomeFooter } from "./home/_components/home-footer/home-footer";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DynamicSidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-h-0 min-w-0">
        {children}
        <HomeFooter />
      </div>
    </div>
  );
}
