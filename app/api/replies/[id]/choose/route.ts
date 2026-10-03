import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const choiceSchema = z.object({ chosen_draft: z.string().trim().min(1).max(1200) });
type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Workspace is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  const parsed = choiceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose a reply to save." }, { status: 400 });
  const { id } = await context.params;
  const { data: reply, error: readError } = await supabase.from("replies").select("drafts").eq("id", id).maybeSingle();
  if (readError || !reply) return NextResponse.json({ error: "We couldn't find that reply in your history." }, { status: 404 });
  if (!Array.isArray(reply.drafts) || !reply.drafts.includes(parsed.data.chosen_draft)) return NextResponse.json({ error: "Choose one of the generated replies." }, { status: 400 });
  const { error } = await supabase.from("replies").update({ chosen_draft: parsed.data.chosen_draft }).eq("id", id);
  if (error) return NextResponse.json({ error: "We couldn't save your choice." }, { status: 500 });
  return NextResponse.json({ saved: true });
}
