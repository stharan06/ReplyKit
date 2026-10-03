import { z } from "zod";

export const toneSchema = z.enum(["warm", "formal", "short"]);
export const categorySchema = z.enum(["restaurant", "clinic", "salon", "gym", "other"]);

export const generateSchema = z.object({
  business_id: z.string().uuid(),
  review_text: z.string().trim().min(1, "Paste a review first.").max(1500, "Reviews must be 1,500 characters or fewer."),
  rating: z.number().int().min(1).max(5),
  tone: toneSchema,
});

export const voiceSchema = z.object({
  name: z.string().trim().min(1, "Add your business name.").max(100),
  category: categorySchema,
  signature: z.string().trim().max(160).default(""),
  use_phrases: z.string().trim().max(500).default(""),
  avoid_phrases: z.string().trim().max(500).default(""),
  sample_reply: z.string().trim().max(900).default(""),
  contact_method: z.string().trim().max(160).default("contact us directly"),
});
