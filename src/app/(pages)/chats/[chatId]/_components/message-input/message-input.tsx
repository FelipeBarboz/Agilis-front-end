"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  function handleChange(value: string) {
    setText(value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Send on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasText = text.trim().length > 0;

  return (
    <div className="border-t border-border bg-background px-3 py-2.5">
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <button
          type="button"
          aria-label="Anexar arquivo"
          disabled={disabled}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <Paperclip size={19} />
        </button>

        {/* Input area */}
        <div className="relative flex flex-1 items-end rounded-2xl border border-border bg-muted/40 px-3.5 py-2 transition-colors focus-within:border-primary/60 focus-within:bg-background">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled ? "Conversa finalizada" : "Digite uma mensagem..."
            }
            className="flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            style={{ maxHeight: "120px" }}
          />

          {/* Emoji button */}
          <button
            type="button"
            aria-label="Emoji"
            disabled={disabled}
            className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <Smile size={18} />
          </button>
        </div>

        {/* Send button — animated transition from mic to send */}
        <button
          type="button"
          onClick={handleSend}
          aria-label="Enviar mensagem"
          disabled={disabled || !hasText}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            hasText && !disabled
              ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 active:scale-95"
              : "bg-muted text-muted-foreground"
          } disabled:cursor-not-allowed`}
        >
          <Send size={17} className={hasText ? "translate-x-px" : ""} />
        </button>
      </div>
    </div>
  );
}
