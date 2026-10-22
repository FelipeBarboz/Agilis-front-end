"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { FaqItemData } from "./faq-data";

interface FaqSectionMobileProps {
  faqs: FaqItemData[];
  isLoading?: boolean;
}

export function FaqSectionMobile({ faqs, isLoading }: FaqSectionMobileProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section>
      {/* Section Header */}
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HelpCircle size={16} />
        </div>
        <h2 className="text-base font-bold text-foreground">
          Perguntas Frequentes
        </h2>
      </div>

      {/* FAQ List */}
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2 py-2">
                <div className="h-4 w-3/4 rounded-md bg-muted" />
                <div className="h-3 w-1/2 rounded-md bg-muted/60" />
              </div>
            ))}
          </div>
        ) : (
          faqs.map((faq, index) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors active:bg-muted/50"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium leading-snug text-foreground">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 pt-0 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
