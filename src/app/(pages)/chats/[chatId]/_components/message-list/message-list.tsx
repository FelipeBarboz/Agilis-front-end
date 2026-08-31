"use client";

import { useEffect, useRef } from "react";
import { MessageBubble, type ChatMessage } from "../message-bubble/message-bubble";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MessageGroup {
  dateLabel: string;
  messages: ChatMessage[];
}

interface MessageListProps {
  groups: MessageGroup[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MessageList({ groups }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groups]);

  return (
    <div className="flex flex-1 flex-col gap-1 overflow-y-auto bg-muted/30 py-4">
      {groups.map((group) => (
        <div key={group.dateLabel} className="flex flex-col gap-1">
          {/* Date separator */}
          <div className="flex items-center justify-center py-2">
            <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
              {group.dateLabel}
            </span>
          </div>

          {/* Messages in this date group */}
          {group.messages.map((msg, idx) => {
            const prevMsg = group.messages[idx - 1];
            // Add spacing between messages from different senderscontinue da onde o gemini parou
            const hasBreak = idx > 0 && prevMsg !== undefined && prevMsg.isOwn !== msg.isOwn;

            return (
              <div
                key={msg.id}
                className={hasBreak ? "mt-2" : "mt-0.5"}
              >
                <MessageBubble message={msg} />
              </div>
            );
          })}
        </div>
      ))}

      {/* Anchor for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
}
