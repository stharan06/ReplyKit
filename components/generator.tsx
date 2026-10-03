"use client";

import { useState } from "react";
import { AlertCircle, Check, Clipboard, Copy, LoaderCircle, LockKeyhole, Sparkles, Star } from "lucide-react";

type Draft = { id: string; text: string };
const tones = [
  { id: "warm", title: "Warm", description: "Friendly and personal" },
  { id: "formal", title: "Formal", description: "Polite and polished" },
  { id: "short", title: "Short", description: "Brief and direct" },
] as const;

export default function Generator({ businessId, businessName }: { businessId: string; businessName: string }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [tone, setTone] = useState<(typeof tones)[number]["id"]>("warm");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [replyId, setReplyId] = useState("");
  const [chosen, setChosen] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function generate() {
    setError("");
    setBusy(true);
    setDrafts([]);
    setChosen("");
    setCopied("");
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ business_id: businessId, review_text: review, rating, tone }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't write those replies. Please try again.");
      setReplyId(result.reply_id);
      setDrafts(result.drafts.map((text: string, index: number) => ({ id: String(index + 1), text })));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't write those replies. Please try again.");
    } finally { setBusy(false); }
  }

  async function copyDraft(draft: Draft) {
    try {
      await navigator.clipboard.writeText(draft.text);
    } catch {
      setError("Copy was blocked by your browser. Select the reply text and copy it instead.");
      return;
    }
    setCopied(draft.id);
    window.setTimeout(() => setCopied(""), 1800);
    const response = await fetch(`/api/replies/${replyId}/choose`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chosen_draft: draft.text }) });
    if (response.ok) setChosen(draft.id);
    else setError("Your reply was copied, but we couldn't save your choice to history.");
  }

  return <div className="generator-grid">
    <section className="panel generator-form">
      <div><h2 className="section-title">The review</h2><p className="section-desc">A specific detail helps us write a more genuine reply.</p></div>
      <div className="field-block"><label className="field-label" htmlFor="review-text">What did your customer say? <span className="field-hint">{review.length}/1,500</span></label><textarea className="textarea review-area" id="review-text" value={review} maxLength={1500} onChange={(event) => setReview(event.target.value)} placeholder="Paste the full review here…" /></div>
      <div className="field-block"><div className="field-label"><span>Star rating</span>{rating <= 2 && <span className="field-hint" style={{ color: "#ad755f" }}>We’ll use extra-careful language</span>}</div><div className="rating-picker" role="radiogroup" aria-label="Star rating">{[1, 2, 3, 4, 5].map((value) => <button type="button" role="radio" aria-checked={rating === value} aria-label={`${value} star${value === 1 ? "" : "s"}`} className={`star-button ${value <= rating ? "active" : ""}`} onClick={() => setRating(value)} key={value}><Star size={15} fill={value <= rating ? "currentColor" : "none"} /></button>)}</div></div>
      <div className="field-block"><div className="field-label">Reply style</div><div className="tone-options" role="radiogroup" aria-label="Reply style">{tones.map((item) => <button type="button" role="radio" aria-checked={tone === item.id} className={`tone-option ${tone === item.id ? "selected" : ""}`} onClick={() => setTone(item.id)} key={item.id}><strong>{item.title}</strong><span>{item.description}</span></button>)}</div></div>
      {error && <div className="notice error-notice" style={{ marginTop: 16 }}><AlertCircle size={14} /><span>{error}</span></div>}
      <div className="generate-footer"><span className="privacy-note"><LockKeyhole size={11} /> Only you can see this review</span><button className="primary-button" onClick={generate} disabled={busy || !review.trim()}>{busy ? <><LoaderCircle size={14} className="spin" /> Writing drafts…</> : <><Sparkles size={14} /> Write my replies</>}</button></div>
      {busy && <div className="privacy-note" style={{ justifyContent: "flex-end", marginTop: 11 }}>Usually ready in a few seconds</div>}
    </section>
    <section aria-live="polite" aria-busy={busy}>
      {drafts.length === 0 ? <div className="draft-empty"><div className="draft-empty-inner"><span className="empty-orbit"><Clipboard size={21} /></span><h3>{busy ? "Finding the right words" : "Your drafts will appear here"}</h3><p>{busy ? `Looking for a thoughtful way to reply to your ${businessName} review.` : "Add a review and pick your preferred tone to get three distinct, ready-to-edit replies."}</p></div></div> : <div className="drafts-column">{drafts.map((draft) => <article className={`draft-card ${chosen === draft.id ? "draft-selected" : ""}`} key={draft.id}><div className="draft-topline"><div className="draft-label"><span className="draft-index">{draft.id}</span> OPTION {draft.id}</div><button className="draft-copy" onClick={() => copyDraft(draft)}>{copied === draft.id ? <Check size={13} /> : <Copy size={13} />}{copied === draft.id ? "Copied" : "Copy reply"}</button></div><p className="draft-text">{draft.text}</p><div className="draft-actions">{chosen === draft.id && <span className="field-hint" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#4e8261" }}><Check size={11} /> Saved as your chosen reply</span>}</div></article>)}</div>}
    </section>
  </div>;
}
