import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for ReplyKit review reply drafting assistant.",
};

export default function TermsPage() {
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
        <div className="hero-kicker"><span /> Straightforward terms</div>
        <h1 className="pricing-title">Terms of Service.<br /><em>You stay in control.</em></h1>
        <p className="pricing-lede">
          ReplyKit generates drafts for you to review. You are always in control of what you publish.
        </p>
      </header>

      <section className="pricing-faq" style={{ maxWidth: 860, margin: "20px auto 70px" }}>
        <div>
          <div className="eyebrow">Clear boundaries</div>
          <h2>Our agreement with you.</h2>
        </div>
        <div className="pricing-faq-list">
          <article>
            <h3>ReplyKit only drafts text</h3>
            <p>
              ReplyKit is an AI-powered drafting tool designed to assist business owners in crafting thoughtful review replies. ReplyKit does not automatically publish, sync with, or post replies to Google Maps, Google Business Profile, Yelp, TripAdvisor, or any other third-party review platform.
            </p>
          </article>
          <article>
            <h3>You are responsible for what you post</h3>
            <p>
              Every draft provided by ReplyKit is a suggestion. As the business owner or representative, you are solely responsible for reviewing, editing, approving, and publishing any text you copy from ReplyKit. You must ensure your published replies are truthful, accurate, and comply with all applicable laws and platform terms.
            </p>
          </article>
          <article>
            <h3>Service during beta</h3>
            <p>
              ReplyKit is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis during our public beta. We strive for high reliability and thoughtful drafts, but do not guarantee uninterrupted uptime or specific commercial outcomes.
            </p>
          </article>
          <article>
            <h3>Account and acceptable use</h3>
            <p>
              You agree not to use ReplyKit to generate deceptive, unlawful, defamatory, or abusive content, or attempt to bypass rate limits or compromise system integrity.
            </p>
          </article>
          <article>
            <h3>Questions and contact</h3>
            <p>
              For questions regarding these terms, contact us anytime at <a className="text-link" href="mailto:hello@replykit.com">hello@replykit.com</a>.
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
          <a href="mailto:hello@replykit.com">Contact: hello@replykit.com</a>
        </div>
      </footer>
    </main>
  );
}
