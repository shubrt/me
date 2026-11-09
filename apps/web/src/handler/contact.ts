import { contactSchema, type Contact } from "@shubrt/contracts";

import type { Context } from "../_/context.ts";

const TO = "shubrt.me@gmail.com";
// Must sit on a domain set up in Cloudflare Email Service, see the README.
const FROM = "kontakt@shubrt.me";
const MIN_FILL_MS = 3000;
// The longest valid form, percent-encoded, stays well below this.
const MAX_BODY_BYTES = 64 * 1024;

export async function handleContact(ctx: Context, request: Request): Promise<Response> {
  const form = await readForm(request);

  // The fake success: spam gets the same answer as a sent inquiry, and nothing goes out. The
  // log names the trap only, so a real inquiry that got caught at least leaves a trace.
  const trap = findSpamTrap(form);
  if (trap) {
    console.info("contact discarded by spam trap", trap);

    return reply(request, form, 200);
  }

  const contact = contactSchema.safeParse(Object.fromEntries(form));
  if (!contact.success) {
    return reply(request, form, 400);
  }

  try {
    await ctx.EMAIL.send(composeMail(contact.data));
  } catch (error) {
    // The code only: an error message may quote the addresses.
    const code = error instanceof Error && "code" in error ? error.code : "unknown";
    console.error("contact mail failed", code);

    return reply(request, form, 502);
  }

  return reply(request, form, 200);
}

// A body declared too big stays unread. It ends up as an empty form, like a body that is no
// form, and fails validation. A missing length passes: losing a real inquiry to a proxy that
// drops the header costs more than parsing a junk body, which the platform caps anyway.
async function readForm(request: Request) {
  const isTooBig = Number(request.headers.get("Content-Length")) > MAX_BODY_BYTES;
  if (isTooBig) {
    return new FormData();
  }

  return request.formData().catch(() => new FormData());
}

function findSpamTrap(form: FormData) {
  if (form.get("trap")) {
    return "honeypot";
  }

  // `elapsed` is the time on the page in ms, so no clocks get compared. Only the page's
  // script sends it: no-JS visitors have no such field and pass.
  const elapsed = form.get("elapsed");
  if (elapsed !== null && Number(elapsed) < MIN_FILL_MS) {
    return "too-fast";
  }

  return null;
}

function composeMail({ name, email, topic, message, lang }: Contact) {
  return {
    to: TO,
    from: FROM,
    replyTo: email,
    subject: composeSubject(),
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Topic: ${topic ?? "none"}`,
      `Language: ${lang}`,
      "",
      message || "(no message)",
    ].join("\n"),
  };
}

// Cloudflare keeps the subject of every mail in its event data for 31 days, so no visitor data
// goes in here. The minute keeps Gmail from threading unrelated inquiries into one conversation.
function composeSubject() {
  return `shubrt.me contact ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;
}

// The page's script asks for JSON. A form post without JS gets redirected to an anchor instead,
// so its status only decides between `sent` and `error`.
function reply(request: Request, form: FormData, status: number) {
  const isOk = status === 200;
  const shouldAnswerJson = request.headers.get("Accept")?.includes("application/json");

  if (shouldAnswerJson) {
    return Response.json({ ok: isOk }, { status });
  }

  const home = form.get("lang") === "en" ? "/en/" : "/";

  return new Response(null, {
    status: 303,
    headers: { Location: `${home}#${isOk ? "sent" : "error"}` },
  });
}
