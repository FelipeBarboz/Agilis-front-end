import { SupportHeaderDesktop } from "./support-header-desktop";
import { SupportHeaderMobile } from "./support-header-mobile";

export function SupportHeader() {
  return (
    <>
      <div className="hidden lg:block">
        <SupportHeaderDesktop />
      </div>
      <div className="lg:hidden">
        <SupportHeaderMobile />
      </div>
    </>
  );
}
