"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, LoaderCircle, Sparkles, Star } from "lucide-react";

export default function TryItBox() {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [tone, setTone] = useState<"warm" | "formal" | "short">("warm");
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch("/api/try", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_text: reviewText, rating, tone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not generate reply. Please try again.");
      } else {
        setDraft(data.draft);
        if (typeof data.remaining === "number") {
          setRemaining(data.remaining);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!draft) return;
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <section className="landing-section" id="try-it-now" style={{ padding: "40px 0 60px" }}>
      <div className="panel" style={{ maxWidth: 780, margin: "0 auto", padding: "32px 28px", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div>
            <div className="eyebrow">Try it without an account</div>
            <h2 style={{ fontSize: 24, margin: "6px 0 0", letterSpacing: "-0.8px" }}>
              See how ReplyKit writes for your reviews
            </h2>
          </div>
          <span className="pill">
            <Sparkles size={11} style={{ color: "var(--green)" }} /> 3 free tries today
          </span>
        </div>

        <p style={{ color: "#77817a", fontSize: 13, margin: "0 0 22px", lineHeight: 1.6 }}>
          Paste any review from your business below. We won&apos;t store your text or ask for an email.
        </p>

        <form onSubmit={handleGenerate}>
          <div style={{ marginBottom: 16 }}>
            <label className="field-label" htmlFor="try-review-text">
              <span>Customer review</span>
              <span className="field-hint">{reviewText.length}/600 characters</span>
            </label>
            <textarea
              id="try-review-text"
              className="textarea"
              maxLength={600}
              rows={4}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste a real customer review here (e.g. 'Loved the coffee, but wait time was a bit long...')"
              style={{ fontSize: 13 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 20 }}>
            <div>
              <label className="field-label">Review rating</label>
              <div className="rating-picker" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-button ${rating >= star ? "active" : ""}`}
                    onClick={() => setRating(star)}
                    aria-label={`${star} star`}
                  >
                    <Star size={15} fill={rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Tone style</label>
              <div className="tone-options">
                {(["warm", "formal", "short"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tone-option ${tone === t ? "selected" : ""}`}
                    onClick={() => setTone(t)}
                    style={{ minHeight: "auto", padding: "8px 10px" }}
                  >
                    <strong style={{ textTransform: "capitalize" }}>{t}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="notice error-notice" style={{ marginBottom: 16 }}>{error}</div>}

          <button
            type="submit"
            className="primary-button"
            disabled={loading || !reviewText.trim()}
            style={{ width: "100%", height: 44, fontSize: 13 }}
          >
            {loading ? (
              <>
                <LoaderCircle size={15} className="spin" /> Drafting your reply...
              </>
            ) : (
              <>
                Generate draft reply <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {draft && (
          <div style={{ marginTop: 26, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="eyebrow" style={{ color: "var(--green)" }}>Your generated draft</span>
              <button
                type="button"
                onClick={handleCopy}
                className="secondary-button"
                style={{ height: 32, fontSize: 11, padding: "0 10px" }}
              >
                {copied ? <Check size={12} style={{ color: "var(--green)" }} /> : <Copy size={12} />}
                {copied ? "Copied to clipboard!" : "Copy reply"}
              </button>
            </div>

            <div
              style={{
                border: "1px solid #e4ede6",
                background: "#f9fcf9",
                borderRadius: 12,
                padding: "16px 18px",
                color: "#37433b",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              {draft}
            </div>

            <div
              className="notice"
              style={{
                marginTop: 16,
                background: "#f0f6f2",
                borderColor: "#d9e8dc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 12, color: "#375040" }}>
                Want three options and your own voice? Sign in with your email.
              </span>
              <Link href="/login" className="primary-button" style={{ height: 32, padding: "0 12px", fontSize: 11 }}>
                Sign in free <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
