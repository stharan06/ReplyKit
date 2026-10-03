"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy, Star } from "lucide-react";

type Reply = { id: string; review_text: string; rating: number; tone: string; drafts: string[]; chosen_draft: string | null; created_at: string };

export default function HistoryList({ replies }: { replies: Reply[] }) {
  const [expanded, setExpanded] = useState<string>("");
  const [copied, setCopied] = useState("");
  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1600);
  }
  return <div className="history-list">{replies.map((reply) => {
    const open = expanded === reply.id;
    const date = new Date(reply.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    return <article className="history-item" key={reply.id}>
      <button className="history-summary" aria-expanded={open} onClick={() => setExpanded(open ? "" : reply.id)} style={{ width: "100%", border: 0, background: "transparent", textAlign: "left" }}>
        <span className="history-rating" aria-label={`${reply.rating} stars`}>{[1, 2, 3, 4, 5].map((value) => <Star key={value} size={11} fill={value <= reply.rating ? "currentColor" : "none"} style={{ opacity: value <= reply.rating ? 1 : .25 }} />)}</span>
        <span className="history-review">{reply.review_text}</span><span className="history-meta"><span className="tone-tag">{reply.tone}</span>{date}</span><span className="chevron" style={{ color: "#9aa19b" }}>{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
      </button>
      {open && <div className="history-drafts">{reply.drafts.map((draft, index) => <div className="history-draft" key={`${reply.id}-${index}`}><span>{reply.chosen_draft === draft && <strong style={{ color: "#4e8261", fontSize: 9, marginRight: 5 }}>CHOSEN ·</strong>}{draft}</span><button className="draft-copy" onClick={() => copy(draft, `${reply.id}-${index}`)}>{copied === `${reply.id}-${index}` ? <Check size={12} /> : <Copy size={12} />}{copied === `${reply.id}-${index}` ? "Copied" : "Copy"}</button></div>)}</div>}
    </article>;
  })}</div>;
}
