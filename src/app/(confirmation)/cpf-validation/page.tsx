import { DocumentForm } from "./_components/document-form";
import { PageTransition } from "@/components/ui/motion";

export default function DocumentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto bg-muted px-6 py-16">
        <PageTransition className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Qual é o documento do titular da conta?
          </h1>

          <DocumentForm />
        </PageTransition>
      </main>
    </div>
  );
}