import { SupportHeader } from "./_components/support-header/support-header";
import { FaqSection } from "./_components/faq-section/faq-section";
import { ContactForm } from "./_components/contact-form/contact-form";

export default function SupportPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted p-4 lg:gap-8 lg:p-6">
      <SupportHeader />
      <FaqSection />
      <ContactForm />
    </main>
  );
}