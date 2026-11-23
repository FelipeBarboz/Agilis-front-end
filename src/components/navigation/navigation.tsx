import { Suspense } from "react";
import { NavigationDesktop } from "./navigation-desktop";
import { NavigationMobile } from "./navigation-mobile";

export function Navigation() {
  return (
    <>
      <div className="hidden lg:flex shrink-0">
        <NavigationDesktop />
      </div>

      <div className="lg:hidden shrink-0 w-full">
        <Suspense fallback={null}>
          <NavigationMobile />
        </Suspense>
      </div>
    </>
  );
}
