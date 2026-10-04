import Link from "next/link";
import { ArrowRight, Check, HeartHandshake, MessageCircle, ShieldCheck, Star, WandSparkles } from "lucide-react";
import HomeDemo from "@/components/home-demo";
import TryItBox from "@/components/try-it-box";

function Brand() {
  return (
    <Link className="brand" href="/">
      <span className="brand-mark"><MessageCircle size={17} strokeWidth={2.4} /></span>
      <span>replykit</span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="landing">
      <nav className="landing-nav" aria-label="Main navigation">
        <Brand />
        <div className="landing-links">
          <a href="#how-it-works">How it works</a>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy</Link>
          <Link className="quiet-button" href="/login">Sign in</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span /> Made for the people behind the counter</div>
          <h1 className="hero-title">Your next reply,<br />already in <em>your voice.</em></h1>
          <p className="hero-text">Thoughtful review replies, ready in seconds. Tell ReplyKit how you sound once, then get back to the work you love.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#try-it-now">Try it on a real review <ArrowRight size={14} /></a>
            <a className="text-link" href="#how-it-works">See how it works <ArrowRight size={13} /></a>
          </div>
          <div className="hero-trust">
            <ShieldCheck size={13} /> Your reviews stay private. You always choose what to post.
          </div>
        </div>

        <div className="hero-art" aria-label="Example of a review reply generated with ReplyKit">
          <HomeDemo />
          <div className="floating-note"><Check size={12} /> Specific, personal, ready to post</div>
        </div>
      </section>

      <TryItBox />

      <div className="landing-proof">
        <div className="proof-inner">
          <span>Simple by design</span>
          <span className="proof-item"><Star size={13} /> Three reply options</span>
          <span className="proof-item"><HeartHandshake size={14} /> Your voice, every time</span>
          <Link className="proof-item" href="/privacy" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
            <ShieldCheck size={13} /> Private by default
          </Link>
        </div>
      </div>

      <section className="landing-section" id="how-it-works">
        <div className="eyebrow">Less time writing. More time with your customers.</div>
        <h2>Good service deserves a reply that feels just as thoughtful.</h2>
        <div className="feature-row">
          <article className="feature-card">
            <span className="feature-icon"><MessageCircle size={16} /></span>
            <h3>Paste the review</h3>
            <p>Drop in the review and choose its star rating. Nothing connects to your Google account.</p>
          </article>
          <article className="feature-card">
            <span className="feature-icon"><WandSparkles size={16} /></span>
            <h3>Make it sound like you</h3>
            <p>Set your business voice once. Choose a warm, formal, or short reply style whenever you need one.</p>
          </article>
          <article className="feature-card">
            <span className="feature-icon"><Check size={16} /></span>
            <h3>Pick, copy, and post</h3>
            <p>Compare three drafts, choose your favorite, and copy it wherever you reply to customers.</p>
          </article>
        </div>
      </section>

      <section className="pricing-teaser">
        <div>
          <div className="eyebrow">Straightforward by design</div>
          <h2>Good replies shouldn’t need an enterprise budget.</h2>
          <p>ReplyKit is free while we’re in beta. Proposed launch plans start at ₹199 a month, with simple limits and no sales call.</p>
        </div>
        <Link className="secondary-button" href="/pricing">See the plan <ArrowRight size={14} /></Link>
      </section>

      <footer className="landing-footer">
        <Brand />
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
