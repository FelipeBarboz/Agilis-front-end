import { FaqSectionDesktop } from "./faq-section-desktop";
import { FaqSectionMobile } from "./faq-section-mobile";

export function FaqSection() {
  return (
    <>
      <div className="hidden lg:block">
        <FaqSectionDesktop />
      </div>
      <div className="lg:hidden">
        <FaqSectionMobile />
      </div>
    </>
  );
}
