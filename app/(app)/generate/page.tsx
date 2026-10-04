import type { Metadata } from "next";
import { ArrowRight, Info, Settings2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Generator from "@/components/generator";

export const metadata: Metadata = { title: "Write a reply" };

export default async function GeneratePage() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: business } = await supabase.from("businesses").select("id,name,category").eq("owner_id", user.id).maybeSingle();
  const { data: voice } = business ? await supabase.from("brand_voices").select("business_id").eq("business_id", business.id).maybeSingle() : { data: null };
  const configured = Boolean(business && voice);

  return <main className="content-wrap">
    <div className="page-heading"><div><div className="eyebrow">Made for your next customer</div><h1 className="page-title">Write a reply</h1><p className="page-subtitle">A good response starts with listening. Paste the review and we’ll help with the words.</p></div><span className="pill"><span className="status-dot" style={{ width: 6, height: 6, boxShadow: "none" }} /> Three drafts, yours to choose</span></div>
    {!configured ? (
      <>
        <div className="panel setup-card" style={{ marginBottom: 20 }}>
          <span className="feature-icon"><Settings2 size={16} /></span>
          <h2 className="section-title" style={{ marginTop: 15 }}>Personalise your brand voice</h2>
          <p className="section-desc" style={{ maxWidth: 430 }}>Add your business name and voice notes so replies sound like you. Or start drafting immediately with our natural default voice.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <Link className="primary-button" href="/voice">Set up your voice <ArrowRight size={13} /></Link>
          </div>
        </div>
        <div className="notice" style={{ marginBottom: 15 }}>
          <Info size={14} />
          <span>Review text is sent securely to generate your drafts. Read every reply before posting.</span>
        </div>
        <Generator businessId={business?.id ?? ""} businessName={business?.name ?? "Your business"} />
      </>
    ) : (
      <>
        <div className="notice" style={{ marginBottom: 15 }}>
          <Info size={14} />
          <span>Review text is sent securely to generate your drafts and saved to your private history. Read every reply before posting.</span>
        </div>
        <Generator businessId={business!.id} businessName={business!.name} />
      </>
    )}
  </main>;
}
