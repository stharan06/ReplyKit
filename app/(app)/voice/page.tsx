import type { Metadata } from "next";
import { Check, Info, MessageCircleHeart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { saveVoice } from "./actions";

export const metadata: Metadata = { title: "Brand voice" };
type PageProps = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function VoicePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: business } = await supabase.from("businesses").select("id,name,category").eq("owner_id", user.id).maybeSingle();
  const { data: voice } = business ? await supabase.from("brand_voices").select("signature,use_phrases,avoid_phrases,sample_reply,contact_method").eq("business_id", business.id).maybeSingle() : { data: null };
  const toList = (items: string[] | null | undefined) => (items ?? []).join(", ");

  return <main className="content-wrap">
    <div className="page-heading"><div><div className="eyebrow">Sound like yourself</div><h1 className="page-title">Your brand voice</h1><p className="page-subtitle">Set the details that make a reply feel like it came from you. ReplyKit remembers them for next time.</p></div><span className="heading-note">Private to your workspace</span></div>
    {params.saved && <div className="notice success-notice" style={{ marginBottom: 16 }}><Check size={14} /> Your voice has been saved.</div>}
    {params.error && <div className="notice error-notice" style={{ marginBottom: 16 }}><Info size={14} /> {params.error === "fields" ? "Check the business name and try saving again." : "We couldn't save those details. Please try again."}</div>}
    <div className="voice-grid">
      <form className="panel voice-form" action={saveVoice}>
        <div><h2 className="section-title">Business basics</h2><p className="section-desc">A little context helps each reply sound grounded and specific.</p></div>
        <div className="two-fields field-block"><div><label className="field-label" htmlFor="business-name">Business name</label><input className="input" id="business-name" name="name" required maxLength={100} defaultValue={business?.name ?? ""} placeholder="e.g. Juniper & Co." /></div><div><label className="field-label" htmlFor="category">Business type</label><select className="select" id="category" name="category" defaultValue={business?.category ?? "restaurant"}><option value="restaurant">Restaurant or café</option><option value="clinic">Clinic</option><option value="salon">Salon</option><option value="gym">Gym or studio</option><option value="other">Other</option></select></div></div>
        <div className="field-block"><label className="field-label" htmlFor="signature">Sign-off <span className="field-hint">Optional</span></label><input className="input" id="signature" name="signature" maxLength={160} defaultValue={voice?.signature ?? ""} placeholder="Warmly, Priya and the team" /></div>
        <div className="field-block"><label className="field-label" htmlFor="use-phrases">Words or phrases to use <span className="field-hint">Separate with commas</span></label><input className="input" id="use-phrases" name="use_phrases" maxLength={500} defaultValue={toList(voice?.use_phrases)} placeholder="made fresh each morning, see you soon" /></div>
        <div className="field-block"><label className="field-label" htmlFor="avoid-phrases">Words or phrases to avoid <span className="field-hint">Separate with commas</span></label><input className="input" id="avoid-phrases" name="avoid_phrases" maxLength={500} defaultValue={toList(voice?.avoid_phrases)} placeholder="valued customer, satisfaction is our priority" /></div>
        <div className="field-block"><label className="field-label" htmlFor="sample-reply">A reply you like <span className="field-hint">Optional style example</span></label><textarea className="textarea" id="sample-reply" name="sample_reply" maxLength={900} defaultValue={voice?.sample_reply ?? ""} placeholder="Paste a reply that feels like the way you speak to customers." style={{ minHeight: 90 }} /></div>
        <div className="field-block"><label className="field-label" htmlFor="contact-method">Invite unhappy customers to reach you <span className="field-hint">For 1- and 2-star reviews</span></label><input className="input" id="contact-method" name="contact_method" maxLength={160} defaultValue={voice?.contact_method ?? "contact us directly"} placeholder="call us at the studio" /></div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}><button className="primary-button" type="submit"><Check size={14} /> Save brand voice</button></div>
      </form>
      <aside className="panel voice-preview"><span className="feature-icon"><MessageCircleHeart size={17} /></span><h2 className="section-title" style={{ marginTop: 15 }}>A reply, in your voice</h2><p className="section-desc">Your saved details guide the drafts we write. You can edit every reply before copying it.</p><div className="preview-paper">Thank you for taking the time to tell us about your visit. We’re glad you enjoyed the freshly made pastries. We hope to see you again soon!{voice?.signature ? `\n\n${voice.signature}` : ""}</div><div className="notice" style={{ marginTop: 14 }}><Info size={14} /><span>Lower ratings get extra care: acknowledge the concern, apologise for the experience, and offer a direct way to continue offline.</span></div></aside>
    </div>
  </main>;
}
