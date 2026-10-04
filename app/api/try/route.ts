import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { buildPrompt, generateDrafts } from "@/lib/prompt";

export const runtime = "nodejs";

const trySchema = z.object({
  review: z.string().trim().min(5, "Please enter at least 5 characters.").max(600, "Review must be 600 characters or fewer.").optional(),
  review_text: z.string().trim().min(5, "Please enter at least 5 characters.").max(600, "Review must be 600 characters or fewer.").optional(),
  rating: z.number().int().min(1).max(5),
  tone: z.enum(["warm", "formal", "short"]).default("warm"),
}).refine((data) => Boolean(data.review || data.review_text), {
  message: "Review text is required.",
  path: ["review"],
});

// Daily counter for ip_hash (hash of IP, not raw IP)
type TryLimitRecord = { count: number; day: string };
const tryLimits = new Map<string, TryLimitRecord>();

function getIpHash(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = (forwarded ? forwarded.split(",")[0]?.trim() : null) ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const parsed = trySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const reviewText = (parsed.data.review ?? parsed.data.review_text)!.trim();
  const ipHash = getIpHash(req);
  const day = getTodayString();
  const existing = tryLimits.get(ipHash);

  let currentCount = 0;
  if (existing && existing.day === day) {
    currentCount = existing.count;
  }

  if (currentCount >= 3) {
    return NextResponse.json(
      {
        error: "You’ve reached today’s 3 free tries. Create a free account to continue writing replies with three options and your own brand voice.",
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
        review_text: reviewText,
        rating: parsed.data.rating,
        tone: parsed.data.tone,
      },
      defaultBusiness,
      defaultVoice
    );

    if (process.env.LLM_API_KEY) {
      const drafts = await generateDrafts(prompt.system, prompt.user);
      draft = drafts[0] || fallbackReply(reviewText, parsed.data.rating, parsed.data.tone);
    } else {
      draft = fallbackReply(reviewText, parsed.data.rating, parsed.data.tone);
    }
  } catch {
    draft = fallbackReply(reviewText, parsed.data.rating, parsed.data.tone);
  }

  // Update limit count for ip_hash (reviews are NOT saved)
  const newCount = currentCount + 1;
  tryLimits.set(ipHash, { count: newCount, day });

  return NextResponse.json({
    draft,
    remaining: Math.max(0, 3 - newCount),
  });
}

function fallbackReply(review: string, rating: number, tone: "warm" | "formal" | "short"): string {
  const isNegative = rating <= 2;
  if (isNegative) {
    if (tone === "short") {
      return "We're very sorry your visit did not meet expectations. Please reach out to us directly so we can make this right.";
    }
    if (tone === "formal") {
      return "Thank you for bringing this to our attention. We apologize for falling short of our standards during your visit. Please contact our team directly so we can resolve this matter.";
    }
    return "We're sorry your visit went this way. That is not the experience we want anyone to have. We'd like to hear more and put things right — please reach out to us directly so we can follow up with you.";
  }

  if (tone === "short") {
    return "Thank you so much for the kind words and support! We look forward to seeing you again soon.";
  }
  if (tone === "formal") {
    return "Thank you for taking the time to share your feedback. We greatly appreciate your visit and look forward to welcoming you back.";
  }
  return "Thank you so much for stopping by and taking the time to leave such a thoughtful review! We're thrilled you had a wonderful visit and can't wait to see you again soon.";
}
