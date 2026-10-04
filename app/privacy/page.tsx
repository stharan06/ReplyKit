import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Shield } from "lucide-react";
import Footer from "@/components/footer";

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
        <p style={{ marginTop: 12, fontSize: 12, color: "#8a948c" }}>
          Last updated: October 4, 2026
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
            <p style={{ marginTop: 8 }}>
              Sign-in uses an email link or secure authentication, and technical logs (for example IP address) may be kept for system security and abuse prevention.
            </p>
          </article>

          <article>
            <h3>Are reviews from the free preview try box saved?</h3>
            <p>
              No. Reviews pasted into the try box are not saved to our database or tied to any visitor identity.
            </p>
          </article>

          <article>
            <h3>Why is this data collected?</h3>
            <p>
              To authenticate your workspace, generate three custom reply drafts in your specific brand voice, and provide your private reply history.
            </p>
          </article>

          <article>
            <h3>Which providers process your data?</h3>
            <p>
              We rely on standard cloud providers to operate ReplyKit:
            </p>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#7b867f", fontSize: 13, lineHeight: 1.6 }}>
              <li>
                <strong>Supabase</strong> — Stores user accounts and workspace records. Your data is protected with row-level security so other users cannot access it. ReplyKit&apos;s operator can access data only when needed to run or fix the service.
              </li>
              <li>
                <strong>LLM Provider (OpenAI / Google Gemini / OpenRouter)</strong> — Review text is sent to our LLM provider to generate drafts. We have configured our account so that data is not used for model training, per the provider&apos;s terms.
              </li>
              <li>
                <strong>Vercel</strong> — Hosts our application frontend and API endpoints. Our providers encrypt data in transit and at rest.
              </li>
            </ul>
          </article>

          <article>
            <h3>How long is your data kept?</h3>
            <p>
              Your account data and saved reply history are retained while your account is active.
            </p>
          </article>

          <article>
            <h3>How do I request deletion of my data?</h3>
            <p>
              We will delete your account data within 7 days of a verified request. Copies in backups may remain for up to 30 days. To request deletion of your account and all associated data, email us directly from your registered email address at <a className="text-link" href="mailto:tharannaidus1@gmail.com">tharannaidus1@gmail.com</a> with the subject line <em>&ldquo;Delete My Data&rdquo;</em>.
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
