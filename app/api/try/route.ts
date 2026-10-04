import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { buildPrompt, generateDrafts } from "@/lib/prompt";

export const runtime = "nodejs";

const trySchema = z.object({
  review_text: z.string().trim().min(3, "Please paste or type a review first.").max(600, "Reviews must be 600 characters or fewer."),
  rating: z.number().int().min(1).max(5),
  tone: z.enum(["warm", "formal", "short"]).default("warm"),
});

// Daily IP rate limiter (3 tries per visitor per calendar day)
type IpRecord = { count: number; date: string; lastInput?: string };
const ipCache = new Map<string, IpRecord>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const parsed = trySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const today = getTodayString();
  const record = ipCache.get(ip);

  let currentCount = 0;
  if (record && record.date === today) {
    currentCount = record.count;
    if (record.lastInput && record.lastInput.toLowerCase() === parsed.data.review_text.toLowerCase()) {
      return NextResponse.json({ error: "You already generated a reply for this exact review." }, { status: 400 });
    }
  }

  if (currentCount >= 3) {
    return NextResponse.json(
      {
        error: "You’ve reached the limit of 3 free preview tries today. Create a free account to continue writing replies with three options and your own voice!",
        remaining: 0,
      },
      { status: 429 }
    );
  }

  const defaultBusiness = {
    name: "Our Business",
    category: "local independent business",
  };

  const defaultVoice = {
    signature: "The Team",
    use_phrases: [],
    avoid_phrases: [],
    sample_reply: null,
    contact_method: "contact us directly",
  };

  let draft: string;
  try {
    const prompt = buildPrompt(
      {
        business_id: "00000000-0000-0000-0000-000000000000",
        review_text: parsed.data.review_text,
        rating: parsed.data.rating,
        tone: parsed.data.tone,
      },
      defaultBusiness,
      defaultVoice
    );

    if (process.env.LLM_API_KEY) {
      const drafts = await generateDrafts(prompt.system, prompt.user);
      draft = drafts[0] || fallbackReply(parsed.data.review_text, parsed.data.rating, parsed.data.tone);
    } else {
      // Realistic fallback draft if LLM_API_KEY is not configured yet
      draft = fallbackReply(parsed.data.review_text, parsed.data.rating, parsed.data.tone);
    }
  } catch (err) {
    draft = fallbackReply(parsed.data.review_text, parsed.data.rating, parsed.data.tone);
  }

  const newCount = currentCount + 1;
  ipCache.set(ip, { count: newCount, date: today, lastInput: parsed.data.review_text });

  return NextResponse.json({
    draft,
    remaining: Math.max(0, 3 - newCount),
  });
}

function fallbackReply(review: string, rating: number, tone: "warm" | "formal" | "short"): string {
  const isNegative = rating <= 2;
  if (isNegative) {
    if (tone === "short") {
      return "We're very sorry your experience did not meet expectations. Please reach out to us directly so we can make this right.";
    }
    if (tone === "formal") {
      return "Thank you for bringing this to our attention. We take this feedback seriously and apologize for falling short during your visit. Please contact our team directly so we can look into this further.";
    }
    return "We're genuinely sorry your visit fell short of what you deserved. We always aim to provide a great experience, and we would appreciate the chance to learn more and make things right — please email us directly.";
  }

  // Positive / neutral
  if (tone === "short") {
    return "Thank you so much for the kind words and support! We look forward to seeing you again soon.";
  }
  if (tone === "formal") {
    return "Thank you for taking the time to share your review. We greatly appreciate your patronage and hope to welcome you back in the near future.";
  }
  return "Thank you so much for stopping by and taking the time to leave such a thoughtful review! We're thrilled you had a good experience and can't wait to welcome you back.";
}
