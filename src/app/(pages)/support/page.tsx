import { ContactForm } from "./_components/contact-form";
import { FaqSection } from "./_components/faq-section";

export default function SupportPage() {
  return (
    <main className="flex flex-1 flex-col gap-8 overflow-y-auto bg-muted p-6">

      {/* Header da página */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Suporte</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tire suas dúvidas ou entre em contato com nossa equipe
        </p>
      </div>

      <FaqSection />
      <ContactForm />

    </main>
  );
}