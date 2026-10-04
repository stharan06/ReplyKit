import { NextResponse } from "next/server";
import { generateSchema } from "@/lib/schemas";
import { buildPrompt, generateDrafts } from "@/lib/prompt";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Step 3: Read key inside server route and return clear error if missing
  const key = process.env.LLM_API_KEY;
  if (!key) {
    console.error("LLM_API_KEY is not set");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  // 1. Check the user is logged in
  const supabase = await createClient();
  if (!supabase) {
    console.error("Supabase client is not available");
    return NextResponse.json({ error: "ReplyKit is not connected to Supabase yet." }, { status: 503 });
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Please sign in to write a reply." }, { status: 401 });
  }

  // 2. Validate the request body (review length, rating, tone)
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "That request could not be read. Please try again." }, { status: 400 });
  }
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the review details and try again." }, { status: 400 });
  }

  // Retrieve or create business and voice profile
  let business: { id: string; name: string; category: string } | null = null;
  if (parsed.data.business_id) {
    const { data: b } = await supabase.from("businesses").select("id,name,category").eq("id", parsed.data.business_id).eq("owner_id", user.id).maybeSingle();
    business = b;
  }
  if (!business) {
    const { data: b } = await supabase.from("businesses").select("id,name,category").eq("owner_id", user.id).maybeSingle();
    business = b;
  }
  if (!business) {
    const { data: newBiz } = await supabase.from("businesses").insert({
      owner_id: user.id,
      name: "My Business",
      category: "other",
    }).select("id,name,category").single();
    business = newBiz;
  }

  const businessId = business?.id;
  const businessName = business?.name ?? "Our Business";
  const businessCategory = business?.category ?? "local business";

  let voice = {
    signature: null as string | null,
    use_phrases: [] as string[],
    avoid_phrases: [] as string[],
    sample_reply: null as string | null,
    contact_method: "contact us directly",
  };

  if (businessId) {
    const { data: v } = await supabase.from("brand_voices").select("signature,use_phrases,avoid_phrases,sample_reply,contact_method").eq("business_id", businessId).maybeSingle();
    if (v) {
      voice = {
        signature: v.signature,
        use_phrases: v.use_phrases ?? [],
        avoid_phrases: v.avoid_phrases ?? [],
        sample_reply: v.sample_reply,
        contact_method: v.contact_method || "contact us directly",
      };
    }
  }

  // 3. Check the user's daily limit
  const { data: businesses } = await supabase.from("businesses").select("id").eq("owner_id", user.id);
  const businessIds = (businesses ?? []).map((item) => item.id);
  if (businessIds.length) {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
    const { count, error } = await supabase.from("replies").select("id", { count: "exact", head: true }).in("business_id", businessIds).gte("created_at", startOfDay);
    if (error) return NextResponse.json({ error: "We couldn't check your daily limit. Please try again." }, { status: 500 });
    if ((count ?? 0) >= 30) return NextResponse.json({ error: "You’ve reached today’s 30-reply limit. Come back tomorrow and we’ll be ready." }, { status: 429 });
  }

  // 4. Build the prompt and call the LLM with `key`
  let drafts: string[];
  try {
    const prompt = buildPrompt(parsed.data, { name: businessName, category: businessCategory }, voice);
    drafts = await generateDrafts(prompt.system, prompt.user, key);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "The reply service is having trouble. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // 5. Return the drafts; never return or log the key
  let replyId = "";
  if (businessId) {
    const { data: reply } = await supabase.from("replies").insert({
      business_id: businessId,
      review_text: parsed.data.review_text,
      rating: parsed.data.rating,
      tone: parsed.data.tone,
      drafts,
    }).select("id").single();
    if (reply) replyId = reply.id;
  }

  return NextResponse.json({ reply_id: replyId, drafts });
}
