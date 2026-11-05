# Testing

## Decide whether a test is needed

Use YAGNI. A new test needs a concrete, currently possible failure with a critical consequence, such as a lost inquiry, mail sent on a spammer's behalf or visitor data in a log. New code, a deleted feature or a coverage gap alone does not justify a test.

Before adding a test, identify the failure and its consequence, check existing protection, and choose the smallest useful test. This is a decision aid, not a required written checklist for every task.

- Keep tests for business decisions and critical behavior that types cannot establish.
- Do not test type-guaranteed properties, ordinary response shapes, schema declarations, framework/SDK behavior, constants, thin forwarding or simple application startup.
- A correctly typed string may still carry an injected mail header. Test that critical decision where it actually happens.
- Do not add UI tests for now.
- Use a focused reproducer for a relevant bug, preferably by extending an existing test. Do not preserve the absence of a removed feature with a new regression test.

## Keep the suite small

- Test observable outcomes, not internal method sequences, HTML fragments or the behavior of your own fake. Use only the mocks needed to control external behavior.
- Keep distinct critical cases. Merge redundant setup and overlapping cases; a coherent test may have several assertions, including an allowed-operation control. Do not reduce test counts by hiding unrelated scenarios in one large test.
- Use the existing runner and fixtures. Do not introduce a general integration suite to recheck response contracts.
- Coverage is not a target. Do not add tests to raise it.

## Verify the change

Run relevant existing checks and affected tests in proportion to the change. Broaden or repeat verification only for a new change, a failure, a required repository check or an unresolved concern. Never substitute a live integration for missing fixtures.

Keep affected tests accurate. Remove or combine unrelated existing tests only under an explicit cleanup task.

Report what was actually checked and any material gap. Do not claim an unexecuted check passed. For external systems, follow [Local work](local-work.md).
