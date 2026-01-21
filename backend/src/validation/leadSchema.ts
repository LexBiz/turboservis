import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  service: z.string().trim().max(80).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  message: z.string().trim().max(1000).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  preferredContact: z.enum(["phone", "whatsapp", "telegram"]).optional(),
  consent: z.boolean(),
  // simple anti-spam honeypot (must stay empty)
  company: z.string().optional()
});

export type LeadInput = z.infer<typeof leadSchema>;


