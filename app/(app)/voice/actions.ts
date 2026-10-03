"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { voiceSchema } from "@/lib/schemas";

export async function saveVoice(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = voiceSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    signature: formData.get("signature") ?? "",
    use_phrases: formData.get("use_phrases") ?? "",
    avoid_phrases: formData.get("avoid_phrases") ?? "",
    sample_reply: formData.get("sample_reply") ?? "",
    contact_method: formData.get("contact_method") ?? "contact us directly",
  });
  if (!parsed.success) redirect("/voice?error=fields");

  const { data: existing, error: lookupError } = await supabase.from("businesses").select("id").eq("owner_id", user.id).maybeSingle();
  if (lookupError) redirect("/voice?error=save");
  let businessId = existing?.id;
  if (businessId) {
    const { error } = await supabase.from("businesses").update({ name: parsed.data.name, category: parsed.data.category }).eq("id", businessId);
    if (error) redirect("/voice?error=save");
  } else {
    const { data, error } = await supabase.from("businesses").insert({ owner_id: user.id, name: parsed.data.name, category: parsed.data.category }).select("id").single();
    if (error || !data) redirect("/voice?error=save");
    businessId = data.id;
  }

  const { error } = await supabase.from("brand_voices").upsert({
    business_id: businessId,
    signature: parsed.data.signature,
    use_phrases: parsed.data.use_phrases.split(",").map((phrase) => phrase.trim()).filter(Boolean),
    avoid_phrases: parsed.data.avoid_phrases.split(",").map((phrase) => phrase.trim()).filter(Boolean),
    sample_reply: parsed.data.sample_reply,
    contact_method: parsed.data.contact_method,
  }, { onConflict: "business_id" });
  if (error) redirect("/voice?error=save");
  revalidatePath("/voice");
  revalidatePath("/generate");
  redirect("/voice?saved=1");
}
