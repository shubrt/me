import { handleContact } from "../handler/contact.ts";
import type { Context } from "./context.ts";

export default {
  /** Answers every request under /api. Cloudflare passes the bindings, our context, second. */
  async fetch(request: Request, ctx: Context): Promise<Response> {
    if (new URL(request.url).pathname !== "/api/contact") {
      return new Response(null, { status: 404 });
    }
    if (request.method !== "POST") {
      return new Response(null, { status: 405, headers: { Allow: "POST" } });
    }

    return handleContact(ctx, request);
  },
};
