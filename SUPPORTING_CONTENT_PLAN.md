# Review the supporting pages against the textbook

Baseline: `6bdec72`. Scope: all 24 pages after the textbook reader in the navigation: setup, 15 concept explanations, five practice pages, and three references.

## Comparison and implementation order

1. **Setup:** compare commands with the official course environment and OCaml 4.14 documentation. Make the first successful run reproducible and distinguish shell, REPL, and source-file input.
2. **Foundations:** compare induction, OCaml, and recursion with textbook Chapters 1–2. Retain useful shorter examples; fill missing type, fold, and correctness steps.
3. **Interpreters:** compare environments, closures, recursion, state, and records with Chapters 3–7. Check exceptions and objects against lectures 10–11, explicitly identifying them as extensions.
4. **Types:** compare typing, constraints, polymorphism, and lambda calculus with Chapters 8–9. Check subtyping against lecture 19 and preserve its separate language contract.
5. **Practice:** compare every HW1 problem and every HW2–HW4 constructor family with the downloaded handouts and pinned official starters. Make textbook-to-homework differences visible before implementation.
6. **References:** connect definitions to the canonical textbook sections; clarify overloaded notation and update the source discrepancy index.

For each page ask: Is the meaning accurate? Are prerequisites and symbols recoverable? Can a reader trace a concrete example? Is the language/source boundary explicit? Does the page add something useful to the textbook reading path?

## Acceptance and publication

- Record a finding and implemented action for every requested page in `reports/SUPPORTING_CONTENT_REVIEW.md`.
- Preserve the textbook as the main reading sequence. Give every supporting page a direct connection to that sequence and its source.
- Keep longer new walkthroughs collapsed and use numbered steps and Mermaid for reasoning gaps.
- Verify generated references, internal anchors, PDF page bounds, diagrams, and all existing coverage checks.
- Run new complete OCaml examples through the publishing workflow; inspect desktop/mobile and light/dark layouts and disclosure navigation.
- Publish through the existing SSH remote and verify the public pages after the tests and deployment pass.

The readability comparison is an editorial review, not a measured learner study. Handout omissions remain identified as omissions; companion choices are not presented as official grading requirements.
