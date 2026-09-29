import { WhyAgilisDesktop } from "./why-agilis-desktop";
import { WhyAgilisMobile } from "./why-agilis-mobile";

export function WhyAgilis() {
  return (
    <>
      <div className="hidden lg:block">
        <WhyAgilisDesktop />
      </div>

      <div className="lg:hidden">
        <WhyAgilisMobile />
      </div>
    </>
  );
}
