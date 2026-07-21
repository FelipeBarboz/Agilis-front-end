import { PreferredNameForm } from "./_components/preferred-name-form";
import { PageTransition } from "@/components/ui/motion";

export default function PreferredNamePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto bg-muted px-6 py-16">
        <PageTransition className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Como você quer que te chamemos
          </h1>

          <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            <p>
              O nome que você escolher será exibido para todas as pessoas que
              interagirem com você no Agilis.
            </p>
            <p>
              O nome que consta no seu documento de identidade será usado
              apenas por questões legais, caso necessário.
            </p>
          </div>

          <PreferredNameForm />
        </PageTransition>
      </main>
    </div>
  );
}