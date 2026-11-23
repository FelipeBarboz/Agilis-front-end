import { FaqItem } from "./faq-item";
import type { FaqItemData } from "./faq-data";

interface FaqSectionDesktopProps {
  faqs: FaqItemData[];
  isLoading?: boolean;
}

export function FaqSectionDesktop({ faqs, isLoading }: FaqSectionDesktopProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Perguntas Frequentes
      </h2>
      <div className="rounded-xl border border-border bg-card shadow-xs">
        <div className="px-4">
          {isLoading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse space-y-2 py-3 border-b border-border last:border-0">
                  <div className="h-4 w-2/3 rounded-md bg-muted" />
                  <div className="h-3 w-full rounded-md bg-muted/60" />
                </div>
              ))}
            </div>
          ) : (
            faqs.map((faq) => (
              <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
