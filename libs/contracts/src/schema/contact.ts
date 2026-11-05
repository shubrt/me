import { z } from "zod";

// One contact form submission. The worker handles the spam fields (`website`,
// `elapsed`) before parsing, so they are not part of the contract. contact.astro
// repeats the limits as maxlength.
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  // The pattern browsers use for type=email, so what they accept also passes here.
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email({ pattern: z.regexes.html5Email })),
  topic: z.enum(["structure", "workflow", "agent", "unsure"]).optional(),
  // Forms submit line breaks as CRLF, while maxlength counts them as one character.
  message: z
    .string()
    .overwrite((text) => text.replaceAll("\r\n", "\n"))
    .trim()
    .max(5000)
    .optional(),
  lang: z.enum(["de", "en"]),
});

export type Contact = z.infer<typeof contactSchema>;
