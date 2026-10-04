"use client";

import { useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";

export default function HomeDemo() {
  const [tab, setTab] = useState<"happy" | "tough">("happy");
  const [copied, setCopied] = useState(false);

  const happyReview = "“Such a lovely little cafe. The cardamom latte was perfect and Arjun remembered my order from last week!”";
  const happyReply = "Thank you for coming back! We’re so glad the cardamom latte was perfect, and we’ll tell Arjun you noticed he remembered your order. See you next week!";
  
  const toughReview = "“Waited 40 minutes for a cold sandwich. Nobody apologised. Won't be back.”";
  const toughReply = "We're sorry your visit went this way, especially the long wait and the cold sandwich. That is not the experience we want anyone to have. We'd like to hear more and put things right - please email us at the address on our page so we can follow up directly.";

  function handleCopy() {
    const text = tab === "happy" ? happyReply : toughReply;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="demo-window">
      <div className="demo-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="demo-dots"><i /><i /><i /></span>
          <span className="demo-mode"><Sparkles size={11} /> ReplyKit demo</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => setTab("happy")}
            style={{
              border: "1px solid",
              borderColor: tab === "happy" ? "var(--green)" : "#e7e7df",
              background: tab === "happy" ? "var(--green-soft)" : "transparent",
              color: tab === "happy" ? "var(--green-deep)" : "#77817a",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 10,
              fontWeight: 650,
            }}
          >
            Happy review
          </button>
          <button
            type="button"
            onClick={() => setTab("tough")}
            style={{
              border: "1px solid",
              borderColor: tab === "tough" ? "var(--green)" : "#e7e7df",
              background: tab === "tough" ? "var(--green-soft)" : "transparent",
              color: tab === "tough" ? "var(--green-deep)" : "#77817a",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 10,
              fontWeight: 650,
            }}
          >
            Tough review
          </button>
        </div>
      </div>

      <div className="demo-body">
        <div className="demo-label">
          {tab === "happy" ? "Customer review (5 stars)" : "Customer review (1 star)"}
        </div>
        <div className="demo-review">
          {tab === "happy" ? happyReview : toughReview}
        </div>
        <div className="demo-stars">
          {tab === "happy" ? "★★★★★" : "★☆☆☆☆"}
        </div>

        <div className="demo-reply">
          <div className="demo-reply-top">
            <span>{tab === "happy" ? "WARM · OPTION 1" : "CALM & CAREFUL · OPTION 1"}</span>
            <span>{tab === "happy" ? "27 words" : "48 words"}</span>
          </div>
          <p>{tab === "happy" ? happyReply : toughReply}</p>
          <div className="demo-action">
            <button
              type="button"
              onClick={handleCopy}
              style={{
                border: "none",
                borderRadius: 6,
                background: "var(--green)",
                padding: "6px 10px",
                color: "white",
                fontSize: 9,
                fontWeight: 650,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              {copied ? "Copied" : "Copy reply"}
            </button>
          </div>
        </div>

        {tab === "tough" && (
          <div style={{ marginTop: 12, borderTop: "1px solid #edf0ec", paddingTop: 10 }}>
            <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "var(--green-deep)" }}>
              Tough reviews get calm, careful replies.
            </p>
            <p style={{ margin: 0, fontSize: 9.5, color: "#77817a", lineHeight: 1.5 }}>
              <strong>Why this reply works:</strong> it names the specific problems, apologises for the experience without arguing or admitting fault, makes no promise of compensation, and moves the conversation offline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
