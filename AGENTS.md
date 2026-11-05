# shubrt.me agent instructions

Build the requested outcome with the least complexity that solves the current problem. These rules describe the agreed target; inspect the current checkout for actual paths, exports and commands.

## Working agreement

- Questions and requests for assessment are read-only unless the user also asks for implementation. For implementation requests, complete authorized local work and relevant verification without asking again for routine steps.
- Apply the rules to the requested work. Retrospective cleanup, bulk renaming and structural migration require an explicit task; noticing older patterns does not authorize them.
- Challenge a rule when a concrete alternative materially improves simplicity, correctness, performance or maintenance. Explain the affected case, proposed alternative, benefit and tradeoff. Use discretion within stated defaults; obtain agreement before changing a firm rule. Continue independent authorized work while a decision is pending.
- Production and daily-use build or preview channels require explicit authorization. Identify the target before touching it. Every push to `main` deploys to shubrt.me, so a merge counts as touching production. Local credentials are not permission to use a live integration.
- Reply in the user's language. Write repository content in English; Pushdraft documents follow the user's language unless requested otherwise. Visible site copy exists in German and English.

## Read the relevant rules

Before the corresponding work, read the linked file if its current contents are not already in context. Read additional categories when the task crosses boundaries; do not load every category for every task.

| Work                                                                    | Instructions                                     |
| ----------------------------------------------------------------------- | ------------------------------------------------ |
| Write, edit or review code                                              | [Coding](.agents/coding.md)                      |
| Add files, change responsibilities, imports, exports or dependencies    | [Structure](.agents/structure.md)                |
| Name code or interpret project terms                                    | [Glossary](.agents/glossary.md)                  |
| Set up a worktree, run commands, start services or provide a preview    | [Local work](.agents/local-work.md)              |
| Decide whether to add, change, remove or run tests; verify code changes | [Testing](.agents/testing.md)                    |
| Change logging, error handling or request outcomes                      | [Logging and error handling](.agents/logging.md) |

## Maintain these instructions

Mandatory wording defines a requirement; "prefer", "default" and "when needed" leave room for judgment. Keep each rule in its owning file. Add concise examples only where they prevent a concrete misunderstanding.

Do not add module-level instruction files or model-specific copies of the rules without an explicit decision. `CLAUDE.md` only imports this entrypoint. Update affected paths and commands during an authorized change; revise policy through an agreed decision.
