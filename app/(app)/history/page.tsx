import type { Metadata } from "next";
import { ArrowUpRight, Copy, Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HistoryList from "@/components/history-list";

export const metadata: Metadata = { title: "Reply history" };
type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function HistoryPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: businesses } = await supabase.from("businesses").select("id").eq("owner_id", user.id);
  const businessIds = (businesses ?? []).map((business) => business.id);
  let replies: Array<{ id: string; review_text: string; rating: number; tone: string; drafts: string[]; chosen_draft: string | null; created_at: string }> = [];
  if (businessIds.length) {
    let query = supabase.from("replies").select("id,review_text,rating,tone,drafts,chosen_draft,created_at").in("business_id", businessIds).order("created_at", { ascending: false }).limit(100);
    if (q.trim()) query = query.ilike("review_text", `%${q.trim().replace(/[%_]/g, "\\$&")}%`);
    const { data } = await query;
    replies = (data ?? []) as typeof replies;
  }
  return <main className="content-wrap">
    <div className="page-heading"><div><div className="eyebrow">A little less to remember</div><h1 className="page-title">Reply history</h1><p className="page-subtitle">Your recent reviews and the replies you chose, all in one quiet corner.</p></div><span className="heading-note">Up to 100 recent replies</span></div>
    <div className="history-toolbar"><form className="search-form" action="/history"><label htmlFor="history-search" className="field-hint" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>Search review text</label><input className="input" id="history-search" name="q" defaultValue={q} placeholder="Search reviews…" /><button className="secondary-button" type="submit"><Search size={13} /> Search</button></form><Link className="text-link" href="/generate">Write another reply <ArrowUpRight size={13} /></Link></div>
    {replies.length ? <HistoryList replies={replies} /> : <div className="empty-state"><span className="empty-orbit"><Copy size={19} /></span><h3>{q ? "No reviews match that search" : "Your next reply will start your history"}</h3><p>{q ? "Try a different word from the review." : "When you generate a reply, the review and three drafts will be saved here for you."}</p>{!q && <Link className="primary-button" style={{ marginTop: 15 }} href="/generate">Write your first reply <ArrowUpRight size={13} /></Link>}</div>}
  </main>;
}
