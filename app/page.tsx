import Link from "next/link";
import { ArrowRight, Check, Copy, HeartHandshake, MessageCircle, ShieldCheck, Sparkles, Star, WandSparkles } from "lucide-react";

function Brand() {
  return <Link className="brand" href="/"><span className="brand-mark"><MessageCircle size={17} strokeWidth={2.4} /></span><span>replykit</span></Link>;
}

export default function HomePage() {
  return (
    <main className="landing">
      <nav className="landing-nav" aria-label="Main navigation">
        <Brand />
        <div className="landing-links"><a href="#how-it-works">How it works</a><Link className="quiet-button" href="/login">Sign in</Link></div>
      </nav>
      <section className="landing-hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span /> Made for the people behind the counter</div>
          <h1 className="hero-title">Your next reply,<br />already in <em>your voice.</em></h1>
          <p className="hero-text">Thoughtful review replies, ready in seconds. Tell ReplyKit how you sound once, then get back to the work you love.</p>
          <div className="hero-actions"><Link className="primary-button" href="/login">Write a better reply <ArrowRight size={14} /></Link><a className="text-link" href="#how-it-works">See how it works <ArrowRight size={13} /></a></div>
          <div className="hero-trust"><ShieldCheck size={13} /> Your reviews stay private. You always choose what to post.</div>
        </div>
        <div className="hero-art" aria-label="Example of a review reply generated with ReplyKit">
          <div className="demo-window">
            <div className="demo-top"><span className="demo-dots"><i /><i /><i /></span><span className="demo-mode"><Sparkles size={11} /> ReplyKit draft</span></div>
            <div className="demo-body">
              <div className="demo-label">Customer review</div>
              <div className="demo-review">“Such a lovely little cafe. The cardamom latte was perfect and Arjun remembered my order from last week!”</div>
              <div className="demo-stars">★★★★★</div>
              <div className="demo-reply">
                <div className="demo-reply-top"><span>WARM · OPTION 1</span><span>31 words</span></div>
                <p>Thank you for stopping by again! We’re so glad the cardamom latte hit the spot — Arjun will be happy to know he remembered your order. See you next week!</p>
                <div className="demo-action"><span><Copy size={9} style={{ verticalAlign: "-2px", marginRight: 4 }} /> Copy reply</span></div>
              </div>
            </div>
          </div>
          <div className="floating-note"><Check size={12} /> Specific, personal, ready to post</div>
        </div>
      </section>
      <div className="landing-proof">
        <div className="proof-inner"><span>Simple by design</span><span className="proof-item"><Star size={13} /> Three reply options</span><span className="proof-item"><HeartHandshake size={14} /> Your voice, every time</span><span className="proof-item"><ShieldCheck size={13} /> Private by default</span></div>
      </div>
      <section className="landing-section" id="how-it-works">
        <div className="eyebrow">Less time writing. More time with your customers.</div>
        <h2>Good service deserves a reply that feels just as thoughtful.</h2>
        <div className="feature-row">
          <article className="feature-card"><span className="feature-icon"><MessageCircle size={16} /></span><h3>Paste the review</h3><p>Drop in the review and choose its star rating. Nothing connects to your Google account.</p></article>
          <article className="feature-card"><span className="feature-icon"><WandSparkles size={16} /></span><h3>Make it sound like you</h3><p>Set your business voice once. Choose a warm, formal, or short reply style whenever you need one.</p></article>
          <article className="feature-card"><span className="feature-icon"><Copy size={16} /></span><h3>Pick, copy, and post</h3><p>Compare three drafts, choose your favorite, and copy it wherever you reply to customers.</p></article>
        </div>
      </section>
      <footer className="landing-footer"><Brand /><span>Thoughtful replies, less busywork.</span></footer>
    </main>
  );
}
