# Clarity review and implementation plan

## Scope and method

Inventory every rendered H2–H4 section in all 58 pages, including generated reading aids. Separate structural screening from editorial judgment: word counts and “example” keywords are not proof of teaching quality or correctness.

Record each section's purpose, source/navigation links, code, diagrams, and question/check cues. Read instructional content by topic to identify inconsistent terminology, missing transitions, and opportunities to contrast a correct model with a plausible wrong one. Reference and navigation sections should stay brief; they do not need artificial exercises.

## Priorities and implementation

1. **Remove ambiguity.** Distinguish the 15 concept guides from the nine textbook chapters in the study schedule. Correct Chapter 7's opening claim about predicting future memory use. Preserve source caveats and homework contracts.
2. **Make each textbook section testable.** Add 48 individually authored prediction/explanation checkpoints, one per numbered source section. Keep answers collapsed; provide a common trap and a precise prerequisite link.
3. **Explain transitions.** Add compact prerequisite and “what changes here” introductions to the nine textbook chapters. Preserve original numbering, PDF links, and section order.
4. **Expose intermediate states.** Add comparisons for closure creation/calling, explicit/implicit references, and evaluation/type analysis; add a complete equation-solving trace to the short inference overview.
5. **Clarify the reading route.** Link the named concept guides in the eight-session schedule and explain how to use checkpoints, the floating syntax panel, and source links.
6. **Retain effective material.** Keep the 21 lecture sheets, concept-guide checks, homework routes, exercise solutions, and reference organization. Do not add a diagram or paragraph merely to satisfy a count.
7. **Verify and publish.** Validate checkpoint coverage, prerequisite anchors, diagrams, and links. Review disclosures and tables on desktop/mobile. Run existing OCaml suites in CI and verify Pages deployment.

## Deliverables

- Before/after inventories and section-by-section recommendations in reports/.
- Reusable checkpoint data, chapter transitions, and focused content edits.
- Updated public book through the existing SSH/Pages workflow.

## Limits

This is an editorial and usability review, not an instructor-issued specification or an independent formal proof of every sentence. Static checks cannot establish pedagogical effectiveness; the new questions let readers test understanding directly.

## Execution record

Priorities 1–6 are implemented. The report inventories 493 headings; all 48 numbered textbook sections have individually authored checkpoints. Desktop/mobile disclosure checks passed. Build, link validation, and the publishing workflow provide the final verification gate.
