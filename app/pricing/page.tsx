import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, proposed launch pricing for ReplyKit's independent-business review reply assistant.",
};

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "during beta",
    description: "Try the complete ReplyKit workflow with your own reviews.",
    features: ["30 review draft sets per month after beta", "One business voice", "Three drafts for every review", "Private reply history"],
    cta: "Start the free beta",
    featured: false,
    available: true,
  },
  {
    name: "Solo",
    price: "₹199",
    period: "/ month · proposed",
    description: "For an owner who wants to stay on top of every review.",
    features: ["300 review draft sets per month", "One business voice", "Three drafts for every review", "Searchable reply history"],
    cta: "Planned for launch",
    featured: true,
    available: false,
  },
  {
    name: "Busy",
    price: "₹499",
    period: "/ month · proposed",
    description: "For businesses that receive reviews throughout the week.",
    features: ["900 review draft sets per month", "One business voice", "Three drafts for every review", "Searchable reply history"],
    cta: "Planned for launch",
    featured: false,
    available: false,
  },
];

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <nav className="landing-nav" aria-label="Main navigation">
        <Link className="brand" href="/"><span className="brand-mark"><MessageCircle size={17} strokeWidth={2.4} /></span><span>replykit</span></Link>
        <div className="landing-links"><Link href="/#how-it-works">How it works</Link><Link className="quiet-button" href="/login">Sign in</Link></div>
      </nav>

      <header className="pricing-hero">
        <Link className="pricing-back" href="/"><ArrowLeft size={13} /> Back to ReplyKit</Link>
        <div className="hero-kicker"><span /> Free while we’re in beta</div>
        <h1 className="pricing-title">Clear prices.<br /><em>No sales call.</em></h1>
        <p className="pricing-lede">ReplyKit keeps review replies simple, so pricing can stay simple too. The plans below are a launch proposal; beta access is free today.</p>
        <div className="pricing-beta-note"><Sparkles size={15} /><span><strong>Beta access is free.</strong> Billing and monthly plan limits are not live yet. Today’s beta limit is 30 generations per day; each generation returns three draft replies.</span></div>
      </header>

      <section className="pricing-grid" aria-label="Proposed ReplyKit plans">
        {plans.map((plan) => (
          <article className={`pricing-card ${plan.featured ? "pricing-card-featured" : ""}`} key={plan.name}>
            {plan.featured && <div className="pricing-popular">Recommended starting point</div>}
            <div className="pricing-card-head"><h2>{plan.name}</h2><p>{plan.description}</p></div>
            <div className="pricing-price"><strong>{plan.price}</strong><span>{plan.period}</span></div>
            <ul>{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
            {plan.available ? <Link className="primary-button pricing-cta" href="/login">{plan.cta}<ArrowRight size={14} /></Link> : <button className="secondary-button pricing-cta" type="button" disabled>{plan.cta}</button>}
          </article>
        ))}
      </section>

      <p className="pricing-footnote">Proposed prices are in INR and may change after beta feedback. Each draft set contains three replies. ReplyKit only drafts replies; you review and post them yourself. No review-platform connection or automatic posting is included.</p>

      <section className="pricing-faq">
        <div><div className="eyebrow">A few useful details</div><h2>Built to be easy to leave, too.</h2></div>
        <div className="pricing-faq-list">
          <article><h3>Can I try ReplyKit without paying?</h3><p>Yes. Sign in with an email link and use the full beta workflow at no charge.</p></article>
          <article><h3>Will it post replies to Google for me?</h3><p>No. ReplyKit gives you drafts to review and copy. You stay in control of what gets published.</p></article>
          <article><h3>Why are the paid plans marked as proposed?</h3><p>Checkout and subscription tracking are not connected yet. The prices are a starting point to validate with small-business owners before billing begins.</p></article>
        </div>
      </section>

      <footer className="landing-footer"><Link className="brand" href="/"><span className="brand-mark"><MessageCircle size={17} /></span><span>replykit</span></Link><span>Thoughtful replies, less busywork.</span><Link href="/login">Try the free beta <ArrowRight size={13} /></Link></footer>
    </main>
  );
}
