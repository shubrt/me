# Coding

## Functions and types

- Prefer functions. Use named function declarations for operations and public functions; arrows suit callbacks and small inline transformations. Use classes when stateful behavior benefits from them, with composition over inheritance.
- Prefer `type`; use interfaces for contracts that genuinely need implementation or extension. Infer types from schemas, clients and functions instead of copying them. Add explicit return types when they define a deliberate contract.
- TypeScript strict mode is mandatory. Do not introduce `any`. Avoid `unknown` in application contracts; when an untrusted boundary requires it, validate or narrow it immediately. Prefer inference, validation and narrowing over assertions that claim unverified facts. Make nullability explicit only where it is meaningful.
- Validate untrusted requests, files and external data at their boundary, then use the validated types internally without repeated validation.
- Pass runtime dependencies through a typed module context, normally the first parameter. Pure calculations need no context. Do not introduce globals solely to make injection possible.

## Control flow and errors

- Prefer early returns and clear names. Split functions by responsibility and readability, not a fixed line or parameter limit. Use an options object when it clarifies the call.
- Use errors and throws internally. Catch only where the caller actually handles a failure; do not wrap every function in a result tuple. Use domain-specific errors or codes where callers need to distinguish outcomes. Follow [Logging and error handling](logging.md) for outcome classification, diagnosis and public responses.
- Prefer `const`. Local mutation is fine when it is clearer or useful for performance. Do not mutate caller-owned inputs unless that is part of the explicit contract; use `readonly` where the contract requires it.
- Prefer `async`/`await`. Run independent operations concurrently when useful; bound concurrency for external work. Preserve sequence when order, shared state or external limits require it.

## Readability

- Follow the [code style examples](examples/code-style.md) for file layout and explicit data flow. Read them before adding or substantially rewriting functions or modules, unless their current contents are already in context. They are the reference style; explain deviations when a concrete readability or responsibility benefit warrants one.
- Put the central public operation early in the file, followed by its private helpers. Keep related public operations together and place types and constants where they help the reader. This is a reading order, not a fixed file template.
- Make the main function show the meaningful steps in execution order. Use names and intermediate values that explain the data. Separate steps with blank lines and keep each operation next to its relevant result or error check.
- Extract a helper when its name explains a meaningful step or hides distracting detail. Keep local helpers with their caller under [Structure](structure.md#responsibilities-and-dependencies). The main flow should be understandable without repeatedly opening other files.
- Make field mappings visible in object literals. Use small named functions for field calculations when helpful; introduce a generic mapper only for a concrete need.
- Use loops for control flow, local state and per-item handling; use `map` and `filter` for straightforward transformations. Unpack nested expressions or chains when they hide decisions. Fewer lines alone do not make code clearer.
- Comments explain intent, non-obvious behavior or how to use a function when names and types are insufficient. Keep them as short as possible and as long as necessary, and update them with the code.
- Use the repository's formatter and import conventions. Avoid boilerplate, speculative abstractions and optimizations without a concrete benefit.

## UI

- A section is one Astro component with its CSS file next to it. Scope the CSS under the section's root class.
- Write copy with `t(lang, de, en)` so both languages sit side by side.
- Pages must work without JavaScript. Anything that starts hidden sits behind the `html.js` class, and the section's static end state is the fallback. Respect `prefers-reduced-motion`.
- Keep client `<script>` blocks free of imports, so Astro keeps inlining them and the first load stays one document.
