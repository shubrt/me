# Structure

## Ownership

- Apps own transport, pages, navigation and composition of module capabilities.
- `libs/<name>` owns logic that an app uses but does not need to contain. Its package is `@shubrt/<name>`. `tools/` holds workspace tooling.
- Apps may depend on libraries; libraries may depend on libraries. Libraries must not depend on app code.
- Organize source by responsibility under `src/<type>/`, using singular names such as `handler`, `service`, `helper`, `schema`, `ui`, `asset` and `test`. Add a type directory only when needed. Tool-required names such as Astro's `src/pages/` keep their spelling.
- Put module entrypoints, environment/configuration handling and the module's context contract in `src/_/`. This is the module's core, not a separate generic business layer.

```text
apps/web/src/
  _/             # worker entrypoint, env and context contract
  handler/       # request orchestration
  helper/        # small functions several types use
  pages/         # Astro routes
  ui/            # sections, layouts, their CSS and generated markup
  asset/         # images processed at build time
  test/          # focused tests

libs/<name>/src/
  _/             # package entrypoint
  service/       # specific tasks
  helper/        # small functions several services use
  schema/        # zod schemas and the types inferred from them
  test/          # focused tests
```

`apps/web/archive/` holds parked code outside the build, lint and these rules. Leave it as it is unless the task restores it.

Existing file moves need a migration task. An ordinary edit does not require relocating its file to this target layout.

## Responsibilities and dependencies

- Handlers make the route's sequence readable. They may call services directly. Keep transport parsing and response mapping at the transport boundary.
- A service performs a specific task. Do not add a service that only forwards one call.
- Keep cohesive functions, helpers and types together. Split when responsibilities or readability require it; there is no one-function-per-file rule.
- Dependencies must be acyclic. If breaking a cycle appears to require a higher-level module that only resolves imports, reassess ownership or pass the needed capability explicitly. Do not create that module just to hide the cycle.
- Define explicit package entrypoints for public capabilities as needed. Other packages use only these entrypoints. Browser code must not import worker code. Use direct file imports internally; do not put a barrel in every subdirectory.
- Assemble module contexts at the entrypoint from platform bindings and explicit configuration. Avoid hidden global dependencies.
