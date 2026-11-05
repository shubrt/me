import { describe, expect, it } from "vite-plus/test";

import { contactSchema } from "../schema/contact.ts";

const VALID = { name: "Eva Brandt", email: "eva@example.com", lang: "de" };

describe("contactSchema", () => {
  it.each([
    ["an injected header", "eva@example.com\r\nBcc: victim@example.com"],
    ["an address list", "eva@example.com,tom@example.com"],
    ["a display name", "Eva <eva@example.com>"],
  ])("keeps %s out of the mail headers", (_, email) => {
    expect(contactSchema.safeParse({ ...VALID, email }).success).toBe(false);
  });

  it.each(["a&b@example.com", "eva@example.xn--p1ai"])(
    "accepts what browsers accept: %s",
    (email) => {
      expect(contactSchema.safeParse({ ...VALID, email }).success).toBe(true);
    },
  );

  it("counts a submitted line break as one character", () => {
    const parsed = contactSchema.parse({ ...VALID, message: "ab\r\nc".repeat(1250) });

    expect(parsed.message).toHaveLength(5000);
    expect(parsed.message).not.toContain("\r");
  });
});
