"use client";

import { useEffect, useState } from "react";
import { fetchFaqs } from "@/lib/support/support-service";
import { faqs as defaultFaqs, type FaqItemData } from "./faq-data";

export function useFaqs() {
  const [faqs, setFaqs] = useState<FaqItemData[]>(defaultFaqs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchFaqs();
        if (isMounted && data && data.length > 0) {
          setFaqs(data);
        }
      } catch (err) {
        console.warn("[FAQ] Falha ao carregar FAQs da API:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { faqs, isLoading };
}
