import { faqs } from "./faq-data";
import { FaqItem } from "./faq-item";

export function FaqSectionDesktop() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Perguntas Frequentes
      </h2>
      <div className="rounded-xl border border-border bg-card">
        <div className="px-4">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
