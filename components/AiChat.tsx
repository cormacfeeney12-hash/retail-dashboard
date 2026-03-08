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

// Renders assistant markdown: headings, tables, bullets, bold, code
function AssistantMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // Blank line
    if (trimmed === "") {
      elements.push(<div key={i} style={{ height: "6px" }} />);
      i++;
      continue;
    }

    // H1: # heading
    if (trimmed.startsWith("# ")) {
      elements.push(
        <div key={i} style={{ fontWeight: 800, fontSize: "15px", color: C.text, marginTop: i > 0 ? "12px" : 0, marginBottom: "6px" }}>
          {renderInline(trimmed.slice(2))}
        </div>
      );
      i++;
      continue;
    }

    // H2: ## heading
    if (trimmed.startsWith("## ")) {
      elements.push(
        <div key={i} style={{ fontWeight: 700, fontSize: "13px", color: C.accent, marginTop: "12px", marginBottom: "5px", letterSpacing: "0.03em" }}>
          {renderInline(trimmed.slice(3))}
        </div>
      );
      i++;
      continue;
    }

    // H3: ### heading
    if (trimmed.startsWith("### ")) {
      elements.push(
        <div key={i} style={{ fontWeight: 700, fontSize: "12px", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "10px", marginBottom: "4px" }}>
          {trimmed.slice(4)}
        </div>
      );
      i++;
      continue;
    }

    // Markdown table: line contains |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      // Filter out separator rows (---|---)
      const dataRows = tableLines.filter((l) => !/^\|[\s|:-]+\|$/.test(l));
      if (dataRows.length > 0) {
        const parseRow = (l: string) =>
          l.slice(1, -1).split("|").map((c) => c.trim());
        const [headerRow, ...bodyRows] = dataRows;
        const headers = parseRow(headerRow);
        elements.push(
          <div key={`table-${i}`} style={{ overflowX: "auto", margin: "8px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr>
                  {headers.map((h, hi) => (
                    <th
                      key={hi}
                      style={{
                        padding: "6px 10px",
                        background: `${C.accent}18`,
                        borderBottom: `1px solid ${C.border}`,
                        color: C.textDim,
                        fontWeight: 700,
                        textAlign: hi === 0 ? "left" : "right",
                        whiteSpace: "nowrap",
                        fontSize: "11px",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, ri) => {
                  const cells = parseRow(row);
                  return (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : `${C.bg}88` }}>
                      {cells.map((cell, ci) => (
                        <td
                          key={ci}
                          style={{
                            padding: "6px 10px",
                            borderBottom: `1px solid ${C.border}44`,
                            color: C.text,
                            textAlign: ci === 0 ? "left" : "right",
                            fontFamily: ci > 0 ? "'JetBrains Mono', monospace" : undefined,
                          }}
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Bullet line: - or •
    const bulletMatch = trimmed.match(/^[-•]\s+(.+)/);
    if (bulletMatch) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "3px" }}>
          <span style={{ color: C.accent, flexShrink: 0, marginTop: "2px" }}>▸</span>
          <span>{renderInline(bulletMatch[1])}</span>
        </div>
      );
      i++;
      continue;
    }

    // Numbered line
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "3px" }}>
          <span style={{ color: C.accent, flexShrink: 0, fontWeight: 700, minWidth: "16px" }}>
            {numMatch[1]}.
          </span>
          <span>{renderInline(numMatch[2])}</span>
        </div>
      );
      i++;
      continue;
    }

    // Section label: ends with : and short
    if (trimmed.endsWith(":") && trimmed.length < 60 && !trimmed.includes(" ") === false) {
      elements.push(
        <div key={i} style={{ fontWeight: 700, fontSize: "11px", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "10px", marginBottom: "4px" }}>
          {renderInline(trimmed.slice(0, -1))}
        </div>
      );
      i++;
      continue;
    }

    // Normal line
    elements.push(
      <div key={i} style={{ marginBottom: "3px", fontSize: "13px", lineHeight: 1.65 }}>
        {renderInline(trimmed)}
      </div>
    );
    i++;
  }

  return <div>{elements}</div>;
}

// Renders **bold** and `code` inline
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: C.text, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: "4px",
            padding: "1px 5px",
            color: C.accent,
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
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
            width: "480px",
            height: "640px",
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
              <span style={{ fontSize: "11px", color: C.textDim }}>claude haiku</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  style={{
                    background: "none",
                    border: `1px solid ${C.border}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    color: C.textDim,
                    fontSize: "11px",
                    padding: "3px 8px",
                  }}
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: "20px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 6px" }}>
            {messages.length === 0 && (
              <div>
                <p style={{ fontSize: "13px", color: C.textDim, marginBottom: "14px", textAlign: "center" }}>
                  Ask me anything about your store data
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: "8px",
                        padding: "10px 14px",
                        cursor: "pointer",
                        fontSize: "13px",
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
                  marginBottom: "12px",
                }}
              >
                {m.role === "assistant" && (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: `${C.accent}22`,
                      border: `1px solid ${C.accent}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      flexShrink: 0,
                      marginRight: "8px",
                      marginTop: "2px",
                    }}
                  >
                    ✦
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: m.role === "user" ? C.accent : C.bg,
                    color: m.role === "user" ? "#fff" : C.text,
                    border: m.role === "assistant" ? `1px solid ${C.border}` : undefined,
                  }}
                >
                  {m.role === "assistant" ? (
                    <AssistantMessage content={m.content} />
                  ) : (
                    <span style={{ fontSize: "13px", lineHeight: 1.5 }}>{m.content}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: `${C.accent}22`,
                    border: `1px solid ${C.accent}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    flexShrink: 0,
                  }}
                >
                  ✦
                </div>
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
              padding: "12px",
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
                padding: "10px 14px",
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
                padding: "10px 16px",
                cursor: "pointer",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                opacity: loading || !input.trim() ? 0.4 : 1,
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
