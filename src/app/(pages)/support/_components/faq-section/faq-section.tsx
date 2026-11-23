"use client";

import { useFaqs } from "./use-faqs";
import { FaqSectionDesktop } from "./faq-section-desktop";
import { FaqSectionMobile } from "./faq-section-mobile";

export function FaqSection() {
  const { faqs, isLoading } = useFaqs();

  return (
    <>
      <div className="hidden lg:block">
        <FaqSectionDesktop faqs={faqs} isLoading={isLoading} />
      </div>
      <div className="lg:hidden">
        <FaqSectionMobile faqs={faqs} isLoading={isLoading} />
      </div>
    </>
  );
}
