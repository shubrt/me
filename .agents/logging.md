# Logging and error handling

## Evidence and diagnosis

- The contact worker is the only server code. It logs through `console`, and `wrangler tail` shows the result. Add a log sink only for a concrete need.
- Keep diagnostic context relevant and bounded. Preserve useful internal error causes while excluding secrets from diagnostics and internal details from public responses.
- Never log visitor data. The privacy page promises this, and error messages may quote addresses, so log error codes instead of messages.

## Event ownership

- The responsible request boundary emits one log line for a relevant outcome. Services enrich the error or propagate it; they do not log the same failure at every layer.

## Errors and outcomes

- Distinguish expected rejection, not found, partial success, cancellation, uncertain outcome and technical failure. A catch must not silently turn an outage into success. Preserve the original technical cause when translating errors or handling a secondary failure.
- Map outcomes to deliberate severity and safe public responses at the responsible boundary. Partial completion must remain visible even when the function returns normally.
- The spam traps are the one deliberate exception: they answer with a fake success and send nothing.
