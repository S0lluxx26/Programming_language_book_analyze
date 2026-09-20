# Supporting content compared with the textbook

Reviewed 20 September 2026 against baseline `6bdec72`, following [the plan](../SUPPORTING_CONTENT_PLAN.md). Scope: all 24 pages after Read the textbook in the navigation, including their existing reasoning routes and reference data.

## Finding

The focused pages already had useful short examples and mostly accurate rules. Their main weakness was navigation and transfer: they often sent readers to another short explanation without connecting to the richer textbook walkthrough, and important differences between Fun, ML−, B, and the host OCaml language were scattered across separate pages. Several explanations needed a concrete intermediate trace. A few statements needed correction or a more precise boundary.

The revision keeps the shorter explanations, links every page to the main reading sequence, and adds detail only for identified gaps. The comparison is an editorial judgment about accuracy, recoverable prerequisites, traceability, and practice readiness; it is not a learner comprehension study.

## Page-by-page decisions

| Page | Source comparison | Finding and implemented improvement |
|---|---|---|
| setup | PDF §2.1; official README and devcontainer configuration; OCaml 4.14 REPL manual | Clarified container terminal versus Windows shell, directive `#` versus prompt, script versus redirected interactive input; added a five-step first run and interface inspection; separated runnable examples from submission templates |
| 01-induction | PDF §§1.1–1.3, especially p.28; textbook §1.3 supplement | Retained least-set definition and proof; supplied the missing `forks` function and a nested-tree trace connecting tests to the induction claim |
| 02-ocaml | PDF §2.1, pp.34–69; textbook types/patterns/module trace | Added curried/tupled call comparison and module abstraction link; corrected the claim that jointly declared formula/exp types require mutually recursive evaluator helpers |
| 03-recursion | PDF pp.70–88; textbook §§2.2–2.3; 4.14 List reference | Retained decreasing-input and accumulator reasoning; added fold signatures, execution-order probe, and the distinction between right-fold association and early stopping |
| 04-expressions | PDF Fig.3.2 p.107; textbook full LET derivation | Retained evaluator and branch-selection rules; added explicit AST/environment/result correspondence for nested shadowing |
| 05-closures | PDF p.129 and pp.165–172; textbook §§4.2.1,6.1.2 | Retained lexical creation/call split; added a mutable-reference example to prevent interpreting capture as a frozen snapshot of cell contents |
| 06-scope-recursion | PDF pp.139,154–160; lecture 7 pp.11–15 | Added per-call mutual-closure environments and linked seven-part representation; labeled lexical addresses as a lecture extension; retained correct sibling-scope isolation |
| 07-state | PDF pp.166,176,183–188; textbook Chapter 6 | Restricted opening name-to-location model to implicit references; compared all three environment models; added lazy/eager/reference diagram and nested-allocation link |
| 08-records | PDF pp.194–218; textbook heap/marking supplement | Retained record aliasing and conservative reachability; added the p.216 edge traversal and pending-computation root requirement, distinguishing B's smaller value domain |
| 09-exceptions | Lecture 10 pp.9–20; integrated Chapter 6 extension | Explicit extension label; added a complete payload/frame/handler trace, including removal of the active handler before its body runs |
| 10-objects | Lecture 11 pp.18–26; Chapters 6–7 prerequisites | Retained self/super, host, and field-shadowing distinctions; replaced ambiguous allocation prose with numbered steps satisfying post-argument freshness and clarified absence of default field initialization |
| 11-types | PDF §§8.1–8.5, especially pp.232–241 | Replaced ambiguous “common type” with same type after unification; showed how a fresh parameter type becomes int; retained soundness limits |
| 12-inference | PDF Fig.8.9 p.256 and pp.267–269; textbook generator/solver traces | Added a substitution-composition graph and explained requested-type V notation; linked all eight core generation cases; retained occurs-check and list-extension boundaries |
| 13-polymorphism | PDF pp.271–273; lecture 18; textbook §8.7 | Added a five-step generalization/instantiation calculation that keeps the captured result type shared; retained monomorphic parameters and value-restriction caveat |
| 14-subtyping | Lecture 19 pp.10–20; integrated Chapter 8 extension | Explicit extension label; added a call traced through static parent signature and dynamic child override; retained contra/covariant direction and constructor exception |
| 15-lambda | PDF pp.281–290; textbook §§9.1–9.3 | Added a Church-boolean reduction diagram with an unused divergent branch; retained capture avoidance, normal-order versus weak evaluation, and Y/Z distinction |
| homework-map | All four handouts; textbook Chapters 1–9 | Added a textbook-to-assignment transfer table and direct links to adaptation sections; highlighted the different exercise numberings |
| hw1 | All six handout pages, all 15 pinned starters; textbook §2.4's 12 tasks | Added 15 explicit textbook correspondences, including fold restriction, iter/double signature, tree datatype, and P12/P13 distinction; clarified one-way formula-helper dependency |
| hw2 | HW2 pp.2–5 and pinned starter; textbook Fun pp.151–160 | Added side-by-side equality/helper/interface comparison. List equality remains forbidden in ML− despite its inclusion in textbook Fun. Retained no-module restriction and exact starter printer |
| hw3 | HW3 pp.2–5 and pinned starter; textbook Chapters 6–7 | Added representation/constructor/call-scope adaptation table and an effectful-false-condition trace. Retained B's distinct binding kinds, equality, empty-record, output, and exception rules |
| hw4 | Complete two-page handout and pinned starter; textbook §8.8 and downloadable checker | Explained single `typeof` result versus textbook alternative enumeration, and unresolved equality rejection versus enumeration. Retained all AST constraint families and unresolved official policy questions |
| syntax | All 24 entries; PDF definitions and matched lectures | Added overloaded-symbol table, precise recursive/fold/reference meanings, and direct textbook context on every entry |
| glossary | All 42 definitions and source locations; canonical textbook sections | Added a definition-to-textbook mapping for every entry, lecture-extension destinations where appropriate, and clarification that displayed evaluator signatures are conceptual; refined call-by-value wording |
| sources | Saved manifest, previous PDF reviews, handouts, lecture 11 | Added source-selection guide and comparison/errata index; linked all nine chapter rows to reader pages and labeled availability as snapshot evidence |

## Evidence and boundaries

- Read all 24 page sources, the generated-page builders, 42 definitions, and 24 syntax entries. Compared relevant material with the already reviewed textbook chapters and their source extracts. Retained accurate parts rather than duplicating the full PDF.
- Re-read selected textbook pages 54, 65, 69, 79, 86–87, 102, 107, 129, 139, 152, 154, 166, 170, 176, 185, 187, 194, 216, 241, 256, 267, and 273. The preceding textbook review supplies the broader section-by-section comparison and remaining chapter context.
- Re-read all HW1 tasks and HW2–HW4 contracts/semantic or typing cases; checked the pinned starter interfaces. Re-read the relevant nameless, continuation, object, and subtype lecture rules. Visually inspected HW2 p.3, textbook p.152, and lecture 11 p.24 to check equality and allocation premises that text extraction can obscure.
- Re-fetched the official setup README and container configuration on 20 September 2026; the configuration still names image `ghcr.io/sambyeol/ocaml-devcontainer:4.14.1`. Checked the versioned OCaml [REPL](https://ocaml.org/manual/4.14/toplevel.html) and [List](https://ocaml.org/manual/4.14/libref/List.html) documentation. No claim is made that Docker or this container was installed or launched on the user's machine during this review.
- Homework ambiguities remain visible. This pass does not create a new instructor rubric, add constructors to official templates, or silently broaden the declared checker policy. The textbook implementations remain separate teaching programs.

## Verification

The implementation adds 24 checked textbook connections, context links for all 42 glossary definitions and 24 syntax entries, four new Mermaid diagrams, and ten executable checks for the complete supporting examples. Browser review also identified unnecessary enlargement of narrow diagrams on phones; intrinsic-width classification now lets those graphs fit while retaining contained scrolling for wide graphs. The HW1 comparison table includes a sideways-scroll hint. Existing textbook and assignment coverage remains in the build checks. Actual build, browser, and publication outcomes are recorded in [VALIDATION.md](../VALIDATION.md) and the GitHub Actions run for the published commit.
