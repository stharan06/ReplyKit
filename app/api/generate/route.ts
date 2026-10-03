import { NextResponse } from "next/server";
import { generateSchema } from "@/lib/schemas";
import { buildPrompt, generateDrafts } from "@/lib/prompt";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "ReplyKit is not connected to Supabase yet." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to write a reply." }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "That request could not be read. Please try again." }, { status: 400 }); }
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the review details and try again." }, { status: 400 });

  const { data: business } = await supabase.from("businesses").select("id,name,category").eq("id", parsed.data.business_id).eq("owner_id", user.id).maybeSingle();
  if (!business) return NextResponse.json({ error: "We couldn't find that business in your workspace." }, { status: 404 });
  const { data: voice } = await supabase.from("brand_voices").select("signature,use_phrases,avoid_phrases,sample_reply,contact_method").eq("business_id", business.id).maybeSingle();
  if (!voice) return NextResponse.json({ error: "Set up your brand voice before writing a reply." }, { status: 409 });

  const { data: businesses } = await supabase.from("businesses").select("id").eq("owner_id", user.id);
  const businessIds = (businesses ?? []).map((item) => item.id);
  if (businessIds.length) {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
    const { count, error } = await supabase.from("replies").select("id", { count: "exact", head: true }).in("business_id", businessIds).gte("created_at", startOfDay);
    if (error) return NextResponse.json({ error: "We couldn't check your daily limit. Please try again." }, { status: 500 });
    if ((count ?? 0) >= 30) return NextResponse.json({ error: "You’ve reached today’s 30-reply limit. Come back tomorrow and we’ll be ready." }, { status: 429 });
  }

  let drafts: string[];
  try {
    const prompt = buildPrompt(parsed.data, business, voice);
    drafts = await generateDrafts(prompt.system, prompt.user);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "The reply service is having trouble. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const { data: reply, error: saveError } = await supabase.from("replies").insert({
    business_id: business.id,
    review_text: parsed.data.review_text,
    rating: parsed.data.rating,
    tone: parsed.data.tone,
    drafts,
  }).select("id").single();
  if (saveError || !reply) return NextResponse.json({ error: "Your drafts are ready, but we couldn't save them. Please try once more." }, { status: 500 });
  return NextResponse.json({ reply_id: reply.id, drafts });
}
