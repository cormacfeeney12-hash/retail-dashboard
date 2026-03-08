"use client";

import { useState, useRef, useEffect } from "react";
import { C } from "@/lib/utils";
import type { ReportData } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How are sales trending vs last year?",
  "What departments need attention?",
  "Summarise the F&H coffee performance",
  "What were the best trading hours this week?",
];

interface Props {
  data: ReportData;
}

export function AiChat({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), reportData: data }),
      });
      const json = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.content ?? json.error ?? "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="AI Analyst"
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: C.accent,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            boxShadow: `0 4px 20px ${C.accent}66`,
            zIndex: 1000,
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
        >
          ✦
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            width: "380px",
            height: "520px",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            boxShadow: "0 8px 40px #00000088",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: C.bg,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.green,
                  display: "inline-block",
                  boxShadow: `0 0 6px ${C.green}`,
                }}
              />
              <span style={{ fontWeight: 600, fontSize: "14px", color: C.text }}>AI Analyst</span>
              <span style={{ fontSize: "11px", color: C.textDim }}>claude-sonnet-4</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: "18px", lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
            {messages.length === 0 && (
              <div>
                <p style={{ fontSize: "13px", color: C.textDim, marginBottom: "12px", textAlign: "center" }}>
                  Ask me anything about your store data
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: "8px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: C.textDim,
                        textAlign: "left",
                        transition: "border-color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.borderColor = C.accent)
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.borderColor = C.border)
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 13px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    background: m.role === "user" ? C.accent : C.bg,
                    color: m.role === "user" ? "#fff" : C.text,
                    border: m.role === "assistant" ? `1px solid ${C.border}` : undefined,
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    color: C.textDim,
                    fontSize: "13px",
                  }}
                >
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about your data…"
              style={{
                flex: 1,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "13px",
                color: C.text,
                outline: "none",
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                background: C.accent,
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                color: "#fff",
                fontWeight: 600,
                fontSize: "13px",
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
