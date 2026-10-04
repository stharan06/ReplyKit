import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Lock, MessageCircle, Shield, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Plain language privacy policy explaining how ReplyKit protects your business and customer review data.",
};

export default function PrivacyPage() {
  return (
    <main className="pricing-page">
      <nav className="landing-nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          <span className="brand-mark"><MessageCircle size={17} strokeWidth={2.4} /></span>
          <span>replykit</span>
        </Link>
        <div className="landing-links">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link className="quiet-button" href="/login">Sign in</Link>
        </div>
      </nav>

      <header className="pricing-hero">
        <Link className="pricing-back" href="/"><ArrowLeft size={13} /> Back to ReplyKit</Link>
        <div className="hero-kicker"><Shield size={12} style={{ color: "var(--green)" }} /> Privacy by default</div>
        <h1 className="pricing-title">Private by default.<br /><em>Plain language.</em></h1>
        <p className="pricing-lede">
          Your customer reviews and brand voice are your business. Here is exactly what we collect, why we need it, and how your data is handled.
        </p>
      </header>

      <section className="pricing-faq" style={{ maxWidth: 860, margin: "20px auto 70px" }}>
        <div>
          <div className="eyebrow">Our commitments</div>
          <h2>No surprises. No data selling.</h2>
        </div>
        <div className="pricing-faq-list">
          <article>
            <h3>What data does ReplyKit collect?</h3>
            <p>
              We collect your <strong>account email address</strong> to authenticate you, your <strong>brand voice configuration</strong> (business name, category, sign-off signature, preferred phrases, and sample replies), and the <strong>customer review text and ratings</strong> that you paste into the generator.
            </p>
          </article>
          <article>
            <h3>Why is this data collected?</h3>
            <p>
              To authenticate your workspace, generate three custom reply drafts in your specific brand voice, and save your private history so you can review and copy past replies whenever needed.
            </p>
          </article>
          <article>
            <h3>Which services process your data?</h3>
            <p>
              We partner with trusted infrastructure providers:
            </p>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#7b867f", fontSize: 13, lineHeight: 1.6 }}>
              <li><strong>Supabase</strong> — Encrypted PostgreSQL database and authentication with Row Level Security (RLS) ensuring nobody else can read your data.</li>
              <li><strong>LLM Provider</strong> — Receives review text and voice settings only to draft replies. Data sent is not used to train public foundation models.</li>
              <li><strong>Vercel</strong> — Encrypted hosting and serverless functions executing API requests.</li>
            </ul>
          </article>
          <article>
            <h3>How long is your data kept?</h3>
            <p>
              Your data is stored for as long as your account remains open. You can delete individual review history records from your dashboard at any time.
            </p>
          </article>
          <article>
            <h3>How do I delete all my data?</h3>
            <p>
              You have the right to complete erasure. To request a full deletion of your account, business profile, brand voice, and all reply history, email us at <a className="text-link" href="mailto:hello@replykit.com">hello@replykit.com</a> with the subject line <em>&ldquo;Delete My Data&rdquo;</em> from your registered account email. All associated records will be permanently purged within 48 hours.
            </p>
          </article>
        </div>
      </section>

      <footer className="landing-footer">
        <Link className="brand" href="/">
          <span className="brand-mark"><MessageCircle size={17} /></span>
          <span>replykit</span>
        </Link>
        <span>ReplyKit - Thoughtful replies, less busywork.</span>
        <div style={{ display: "flex", gap: 14 }}>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
