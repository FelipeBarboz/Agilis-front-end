import { type ReactNode } from "react";
import { DynamicSidebar } from "@/components/dynamic-sidebar";
import { HomeFooter } from "./home/_components/home-footer/home-footer";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DynamicSidebar />
      <div className="flex flex-1 overflow-y-auto overflow-x-hidden min-w-0">
        <div className="flex flex-col flex-1 min-h-full">
          {children}
          <HomeFooter />
        </div>
      </div>
    </div>
  );
}
