# Glossary

## Project terms

| Term            | Meaning                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Module          | A package: `apps/web`, or a library such as `libs/contracts` with its package `@shubrt/contracts`.                         |
| App             | An executable entrypoint that exposes or composes modules.                                                                 |
| Module core     | The module's `src/_/` entrypoints, environment and context setup.                                                          |
| Step            | One of the three offers, always in this order: Structure, Workflow, Agent. Their IDs are `structure`, `workflow`, `agent`. |
| Section         | A top-level part of the one-pager: nav, hero, chaos, steps, towers, contact, footer.                                       |
| Chaos           | The "Kommt das bekannt vor?" section: a pile of windows that a click tidies into a card, which docks on the first step.    |
| Towers          | The "Wo anfangen?" section. Each tower has a chip that selects its topic in the contact form.                              |
| Inquiry         | One contact form submission.                                                                                               |
| Parked terminal | The previous site. `apps/web/archive/terminal` and `libs/session` keep it for later use; the site does not ship or use it. |

Use existing terms for other business concepts; do not introduce additional canonical terminology without a concrete decision.

## Names

- Use `libs/<name>` with `@shubrt/<name>`. Directory types under `src/` are singular.
- Use kebab-case for ordinary files and directories, including Astro components such as `lang-switch.astro`. Tool-required names retain their prescribed spelling.
- Use PascalCase for types and components; camelCase for functions, variables and fields. Name functions for their action.
- Use `is`, `has`, `can` or `should` for booleans. Use UPPER_SNAKE_CASE for deliberately named fixed constants, including module constants; ordinary `const` bindings remain camelCase.
- Prefer concise, explicit words. Familiar technical names `ctx`, `id`, `url` and `env` are allowed, and so is `t` for the translation helper. Write `assetId` and `apiUrl`, not `assetID` or `APIURL`.
- The SVG builders in `ui/svg.ts` carry the name of what they draw, such as `rect` or `line`. They read as markup.
- CSS classes are lowercase words in kebab-case that a reader does not have to decode: `.chat`, not `.wc`.
- Keep implementation details private by not exporting them. Do not add an internal-name prefix by default.
- `get...` returns one item or fails when absent. `find...` allows absence. `list...` returns a collection.
- Form fields, URL parameters, anchors and their values are English (`topic=workflow`, `#sent`). German is for visible copy, which includes the legal paths `/impressum/` and `/datenschutz/`.

Legacy names are not permission for an unrelated rename.
