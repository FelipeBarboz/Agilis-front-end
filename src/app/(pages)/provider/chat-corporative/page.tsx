import { ChatCorporativeHeader } from "./_components/chat-corporative-header";
import { ChatCorporativeCard } from "./_components/chat-corporative-card";

export default function ChatCorporativePage() {
  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <ChatCorporativeHeader />
        <ChatCorporativeCard />
      </main>
    </div>
  );
}

