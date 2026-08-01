"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiChat02Icon, Cancel01Icon, SentIcon, StethoscopeIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PawIcon } from "@/components/layout/icons";
import type { Animal } from "@/app/(dashboard)/animaux/_components/data";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AiChat({ animal }: { animal?: Animal | null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    setMessages((m) => [...m, { id: `u${Date.now()}`, role: "user", content: question }]);
    setInput("");
    setIsTyping(true);

    setTimeout(
      () => {
        setMessages((m) => [
          ...m,
          {
            id: `a${Date.now()}`,
            role: "assistant",
            content: animal
              ? `Démo — aucune IA n'est encore connectée. Une fois branché à une vraie API, cet assistant pourra répondre à propos de ${animal.name} et de questions vétérinaires générales.`
              : "Démo — aucune IA n'est encore connectée. Sélectionnez un animal pour poser des questions à son sujet, ou posez une question vétérinaire générale une fois l'API branchée.",
          },
        ]);
        setIsTyping(false);
      },
      800 + Math.random() * 500
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant IA" : "Ouvrir l'assistant IA"}
        className="ai-shine-btn fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
      >
        {open ? (
          <HugeiconsIcon icon={Cancel01Icon} className="h-6 w-6" strokeWidth={2.2} />
        ) : (
          <PawIcon className="h-6 w-6" />
        )}
      </button>

      {open && (
        <div className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 fixed bottom-24 left-6 z-40 flex h-[480px] w-[360px] max-w-[calc(100vw-3rem)] origin-bottom-left flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl duration-200">
          <div className="flex shrink-0 items-center gap-2.5 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
              <HugeiconsIcon icon={AiChat02Icon} className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-sm font-bold">Assistant IA</span>
              <span className="truncate text-xs text-primary-foreground/75">
                {animal ? `À propos de ${animal.name}` : "Questions vétérinaires"}
              </span>
            </div>
          </div>

          <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <HugeiconsIcon icon={StethoscopeIcon} className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <p className="px-4 text-sm text-muted-foreground">
                  Posez une question sur {animal ? animal.name : "un animal"} ou sur un sujet vétérinaire.
                </p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex shrink-0 items-center gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Poser une question..."
              className="h-10 flex-1 bg-muted"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90"
            >
              <HugeiconsIcon icon={SentIcon} className="h-4 w-4" strokeWidth={2.2} />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
