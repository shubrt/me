import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import type { Context } from "../_/context.ts";
import worker from "../_/worker.ts";

const ENDPOINT = "https://shubrt.me/api/contact";
const JSON_TYPE = "application/json";

// What a browser posts without JS: no `elapsed`, only the page's script adds it.
const FIELDS = {
  name: "Eva Brandt",
  email: "eva@example.com",
  topic: "workflow",
  message: "Rechnungen laufen noch per Hand.",
  lang: "de",
  trap: "",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("contact mail", () => {
  it("sends plain text to the owner with the visitor as reply-to", async () => {
    const { send, mail } = await submit(post());

    expect(send).toHaveBeenCalledOnce();
    expect(mail).toMatchObject({
      to: "shubrt.me@gmail.com",
      from: "kontakt@shubrt.me",
      replyTo: "eva@example.com",
    });
    expect(mail).not.toHaveProperty("html");
    expect(mail?.text).toContain("Name: Eva Brandt");
    expect(mail?.text).toContain("Rechnungen laufen noch per Hand.");
  });

  it("keeps visitor data out of the subject, which Cloudflare logs", async () => {
    const { mail } = await submit(post());

    expect(mail?.subject).toMatch(/^shubrt\.me contact \d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });

  it("accepts multipart forms, which the page's script sends", async () => {
    const body = new FormData();
    body.set("name", "Eva Brandt");
    body.set("email", "eva@example.com");
    body.set("message", "");
    body.set("lang", "en");
    const { send } = await submit(
      new Request(ENDPOINT, { method: "POST", headers: { "Content-Length": "512" }, body }),
    );

    expect(send).toHaveBeenCalledOnce();
  });

  it("still delivers when a proxy dropped the length", async () => {
    const request = post({}, JSON_TYPE);
    request.headers.delete("Content-Length");

    const { send, response } = await submit(request);

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
  });
});

describe("invalid input", () => {
  it("rejects what the schema rejects and sends nothing", async () => {
    const { send, response } = await submit(post({ email: "not-a-mail" }, JSON_TYPE));

    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a body that is not a form", async () => {
    const body = JSON.stringify(FIELDS);
    const { send, response } = await submit(
      new Request(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": JSON_TYPE,
          "Content-Length": String(body.length),
          Accept: JSON_TYPE,
        },
        body,
      }),
    );

    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("leaves a body over the limit unread", async () => {
    const request = post({}, JSON_TYPE);
    request.headers.set("Content-Length", "65537");

    const { send, response } = await submit(request);

    expect(response.status).toBe(400);
    expect(request.bodyUsed).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });
});

describe("spam traps", () => {
  it.each([
    ["a filled honeypot", { trap: "https://spam.example" }, "honeypot"],
    ["a form sent after 2 seconds", { elapsed: "2000" }, "too-fast"],
    ["a bot that also fails validation", { trap: "x", email: "nope" }, "honeypot"],
  ])(
    "answers %s with a fake success, sends nothing and logs only the trap",
    async (_, overrides, trap) => {
      const log = vi.spyOn(console, "info").mockImplementation(() => {});

      const { send, response } = await submit(post(overrides, JSON_TYPE));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: true });
      expect(send).not.toHaveBeenCalled();
      expect(log.mock.calls).toEqual([["contact discarded by spam trap", trap]]);
    },
  );

  it.each([
    ["a form sent after exactly 3 seconds", { elapsed: "3000" }],
    ["a form without the field, as sent without JS", {}],
  ])("lets through %s", async (_, overrides) => {
    const { send } = await submit(post(overrides));

    expect(send).toHaveBeenCalledOnce();
  });
});

describe("form posts without JS", () => {
  it.each([
    ["de", "/#sent", "/#error"],
    ["en", "/en/#sent", "/en/#error"],
  ])("redirects %s with 303", async (lang, sent, error) => {
    const success = await submit(post({ lang }));
    const failure = await submit(post({ lang, email: "nope" }));

    expect(success.response.status).toBe(303);
    expect(success.response.headers.get("Location")).toBe(sent);
    expect(failure.response.status).toBe(303);
    expect(failure.response.headers.get("Location")).toBe(error);
  });
});

describe("send failure", () => {
  it("gives JSON callers a 502 and logs only the code", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await worker.fetch(post({}, JSON_TYPE), createFailingContext());

    expect(response.status).toBe(502);
    expect(log.mock.calls).toEqual([["contact mail failed", "E_DELIVERY_FAILED"]]);
  });

  it("redirects form posts to the error anchor", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await worker.fetch(post({ lang: "en" }), createFailingContext());

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/en/#error");
  });
});

function post(overrides: Record<string, string> = {}, accept?: string) {
  const body = new URLSearchParams({ ...FIELDS, ...overrides });
  const headers = { "Content-Length": String(body.toString().length) };

  return new Request(ENDPOINT, {
    method: "POST",
    headers: accept ? { ...headers, Accept: accept } : headers,
    body,
  });
}

/** Runs one request against a mail binding that records what it was asked to send. */
async function submit(request: Request) {
  const send = vi.fn<Context["EMAIL"]["send"]>(async () => ({ messageId: "test" }));
  const response = await worker.fetch(request, { EMAIL: { send } });

  return { response, send, mail: send.mock.lastCall?.[0] };
}

function createFailingContext() {
  const error = Object.assign(new Error("rejected for eva@example.com"), {
    code: "E_DELIVERY_FAILED",
  });

  return { EMAIL: { send: vi.fn().mockRejectedValue(error) } };
}
