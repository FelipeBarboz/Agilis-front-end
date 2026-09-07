import { Suspense } from "react";
import { LoggedAppSidebar } from "@/components/logged-app-sidebar";

export default function TestPage() {
  return (
    <Suspense fallback={null}>
      <LoggedAppSidebar />
    </Suspense>
  );
}