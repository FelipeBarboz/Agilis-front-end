import { ContactFormDesktop } from "./contact-form-desktop";
import { ContactFormMobile } from "./contact-form-mobile";

export function ContactForm() {
  return (
    <>
      <div className="hidden lg:block">
        <ContactFormDesktop />
      </div>
      <div className="lg:hidden">
        <ContactFormMobile />
      </div>
    </>
  );
}
