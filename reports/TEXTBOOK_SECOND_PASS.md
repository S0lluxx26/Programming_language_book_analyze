# Second evaluation of the textbook reader

Date: 20 September 2026. Baseline: `5794822`, **after** the first review's 25 walkthroughs and equality correction. Plan: [TEXTBOOK_EVALUATION_PLAN.md](../TEXTBOOK_EVALUATION_PLAN.md). Source: [English textbook PDF](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf), local copy `sources/pdfs/pl-book-eng.pdf`.

## Conclusion

The improved baseline is well suited to guided reading and revision in Chapters 1, 3, 4, 7, and 9: definitions, intermediate examples, and boundaries are mostly explicit. It still had identifiable first-reading gaps in Chapters 2, 5, 6, and 8. In particular, exercise types were often hidden, the module example was reduced to a sentence, lazy evaluation was missing from Chapter 6's own discussion, and equation generation lacked the PDF's complete core-case table.

This pass implements those additions and clarifies source/interface differences. The website offers shorter summaries, linked definitions, selective detail, and numbered reasoning; the PDF retains the full exposition. “Easier to understand” here is an editorial judgment against the five reading tasks in the plan, not a measured outcome from learners. No comprehension study has been conducted.

## How the comparison was performed

- Reused the first pass's source verification and checked the current authored chapters, supplements, exercise solutions, and relevant executable implementations. This is a follow-up against the improved version, not a second count of the previous changes.
- Re-read the complete exercise pages 89–96 and compared every interface and all five P10 subparts. Re-read focused source passages for modules (65–70), recursion/cost (73–81), mutual recursion (153–160), state/freshness (166–173), parameter passing/laziness (186–192), implementation interfaces (144–145, 219–221), typing rules/constraints (225–258, 274–276), and lambda implementation tasks (291–292).
- Visually inspected p.78's printed loop, p.95's exact expression datatype, and p.256's Figure 8.9. This confirmed both a source error and notation that text extraction can flatten. The earlier report records other rendered source pages used for the retained sections.
- For each section below, checked meaning, notation, reasoning, practice readiness, and source fidelity. **Retain** means the current explanation met these editorial criteria; it does not mean all source prose was reproduced. **Expand** addresses an omitted topic or intermediate step. **Correct** addresses an inaccurate description.

## Chapter 1 — Induction

The existing supplements already make the construction/proof connection explicit. Additional prose would mostly repeat the current explanation.

| Section | Decision | Evidence / result |
|---|---|---|
| 1.1 | Retain | Least set, finite membership tree, no-base-case boundary, and two inclusions for multiples of three are explicit |
| 1.2 | Retain | Grammar versus evaluation notation, numeral premises, and a nested-addition derivation connect syntax to meaning |
| 1.3 | Retain | Base/wrap/join proof, necessary-versus-sufficient caveat, and two-subtree induction hypotheses cover the proof method |

## Chapter 2 — Functional programming

The main remaining weakness was the path from reading a concept to independently attempting a problem. Source assumptions and function interfaces now appear before the numbered reasoning and before the solution.

| Section | Decision | Evidence / result |
|---|---|---|
| 2.1 | Expand | Added the module/queue progression from pp.69–70, immutable old/new queue values, tuple result, failure case, and limits of representation hiding |
| 2.2 | Expand | Flagged p.78's faulty factorial loop; added a zero-safe tail-recursive example, invariant trace and negative-input policy; removed an unsupported claim that the source section includes a merge example |
| 2.3 | Retain | Existing traversal signatures, fold grouping, pipeline example, and strict-evaluation caveat provide the necessary distinctions |
| 2.4 | Expand | Added all 12 interfaces, direct prerequisites, and visible result criteria; P12 now includes its exact datatype, AST graph and runnable smart-constructor helpers |

**Source error:** the C factorial loop on p.78 multiplies by i starting at 0; any positive input therefore returns 0. The reader identifies that error instead of adopting it. Later variants stopping at n=1 need positive inputs; our displayed version deliberately supports n=0 and rejects negatives. Arithmetic still assumes representable integer results.

### Individual exercise comparison

| Problem | Source requirement checked | Result in this pass |
|---|---|---|
| 1 | `int -> int -> int list`; inclusive endpoints, n≤m | Exposed interface and endpoint check; reversed-input extension remains labeled |
| 2 | `'a list list -> 'a list`; concatenate in order | Exposed nesting change, input/output types and append prerequisite |
| 3 | `int list -> int list -> int list`; first-list element first, retain leftovers | Exposed exact requested type; generalized implementation is labeled |
| 4 | `('a * 'b) list -> 'a list * 'b list`; retain component order | Exposed the pair result and potentially different component types |
| 5 | `'a list -> int -> 'a list`; exhausted input yields empty | Exposed argument order and checks; negative-count interpretation remains explicit |
| 6 | `(int -> int) -> int -> int -> int`; inclusive sum | Exposed function argument and one-endpoint check; effect-order caveat retained |
| 7 | `int * (int -> int) -> (int -> int)`; n=0 identity | Exposed tuple input/function output and linked type-arrow explanation |
| 8 | `('a -> bool) -> 'a list -> bool`; specifically fold_right | Exposed traversal restriction and distinction from early stopping |
| 9 | `int list -> int`; specifically fold_left, digits 0–9 | Exposed digit precondition and order-sensitive result check |
| 10 | Five functions, each with both folds | Added separate interface/meaning rows for length, reverse, is_all_pos, map, filter; retained all ten implementations |
| 11 | `nat -> nat -> nat` for addition and multiplication | Exposed ZERO/SUCC domain and requirement to return constructors, not integers |
| 12 | `aexp * string -> aexp`; exact five-constructor datatype | Added the datatype and constructor meanings before solving, source-example AST, and helper definitions previously available only in the download |

P12's empty-sum/product identities are now explicitly called a solution convention, since the displayed source example does not itself specify those boundaries. Its simplifier removes neutral terms but is not a general polynomial normalizer.

## Chapter 3 — Variables and environments

| Section | Decision | Evidence / result |
|---|---|---|
| 3.1 | Retain | Surface LET to AST translation and name-versus-value distinction are present |
| 3.2 | Retain | Judgment inputs/output, semantic domain, and failure examples distinguish syntax from valid evaluation |
| 3.2.1 | Retain | Finite-map notation, nearest-first lookup, extension and preserved old environments have concrete examples |
| 3.2.2 | Retain | Full LET derivation and proof-dependency diagram explain premise environments; IF runs only the selected branch |
| 3.3 | Retain | The p.117 scope trace matches −3; download mapping of ISZERO to EQUAL-with-zero is explicit |

## Chapter 4 — Functions

| Section | Decision | Evidence / result |
|---|---|---|
| 4.1 | Retain | Procedure creation versus invocation and multiple-argument desugaring connect to the OCaml application explanation |
| 4.2 | Retain | Worked FV calculation keeps initializer and body binding regions separate |
| 4.2.1 | Retain | Caller-argument versus saved-body contexts and returned closure trace explain what survives a call |
| 4.2.2 | Retain | The source's 5-versus-6 example distinguishes static and dynamic scope with concrete environments |
| 4.2.3 | Retain | Self-binding and parameter priority are explicit, including the dynamic rebinding boundary |
| 4.3 | Retain | Both scope modes have a clear invocation and examples; p.144 explicitly permits list-based environments instead of function-based maps |

## Chapter 5 — Fun

| Section | Decision | Evidence / result |
|---|---|---|
| 5.1 | Retain | Surface syntax, AST and runtime values are separately traced; Unit and NIL remain distinct |
| 5.2 | Retain | Prior list-equality correction matches p.152; the nested-data convention and checker restriction are visible |
| 5.3 | Expand | Added the seven-part mutual closure layout, swapped partner closure, per-call environments and even 2 → odd 1 → even 0 trace |

The previous simple call chain did not show how both recursive names become available at every call. The new supplement connects the tuple in the PDF directly to the existing interpreter's `MRecProcedure` case.

## Chapter 6 — State

| Section | Decision | Evidence / result |
|---|---|---|
| 6.1 | Retain | Explicit-reference overview gives the value/location/store distinction |
| 6.1.1 | Retain | Allocation, dereference, assignment and sequence have identifiable syntax |
| 6.1.2 | Retain | Value-and-memory table and assignment-return caveat already explain the core rules |
| 6.2 | Retain | Explicit versus implicit references are compared without collapsing their environment types |
| 6.2.1 | Retain | SET and ordinary variable lookup are distinguished from first-class pointers |
| 6.2.2 | Retain | Copy-versus-alias trace and saved binding/current store explanation already resolve common errors |
| 6.2.3 | Expand | Restored the source's pp.187–188 lazy-evaluation discussion; separate argument timing from cell sharing; distinguish deferred execution from the implemented CALLREF form |
| 6.3 | Expand | Added ref(ref 0), two distinct cells, store-after-initializer freshness, and executable nested-allocation checks |

The source introduces lazy evaluation for comparison; it does not ask these two implementation tasks to build a lazy evaluator. The website now states that boundary instead of omitting the topic or implying that CALLREF implements laziness.

## Chapter 7 — Heap and memory management

| Section | Decision | Evidence / result |
|---|---|---|
| 7.1 | Retain | Shared record fields versus independent variable cells have a graph and mutation trace |
| 7.2 | Retain | Pointer variable versus pointee, address-of and double lookup are explicit |
| 7.3 | Retain | Scope versus reachable lifetime is explained before reclamation |
| 7.3.1 | Retain | Premature, repeated and missing reclamation distinguish dangling references and leaks |
| 7.3.2 | Retain | The p.216 mixed-reference graph, fixed-point marking table, unreachable cycle and root limitation are present |
| 7.4 | Expand | Added the exact ASSIGN→SET naming map and shared engine's Implicit-mode entry point; retained the source-signature discrepancy and continuation-safe GC explanation |

The naming map is needed when a reader copies the source's AST into the shared download. It changes no language semantics and does not alter official homework templates.

## Chapter 8 — Static types

| Section | Decision | Evidence / result |
|---|---|---|
| 8.1 | Correct | Initial grammar summary omitted recursive binding despite Figure 8.2; now includes it and distinguishes the smaller §8.8 starter AST |
| 8.2 | Retain | Primitive/function types and a shared unknown for identity are explained |
| 8.3 | Retain | Γ versus ρ and the body environment distinction are explicit |
| 8.4 | Expand | Added LETREC's provisional function type, parameter scope, surrounding-body scope and shared recursive constraints |
| 8.5 | Expand | Added all eight Figure 8.9 constructor rows, interpretation of V, requested types, freshness, conjunction and a complete LET/ISZERO generation trace |
| 8.6 | Retain | Existing generate/solve/apply identity-call trace provides the pipeline overview |
| 8.6.1 | Expand | Aligned notation with source V and linked the full rule table; retained the coupled f x / f 1 example |
| 8.6.2 | Retain | Worklist/substitution trace, function decomposition and indirect occurs-check example are sufficient |
| 8.7 | Retain | Scheme instances and the environment-dependent captured-y counterexample explain generalization boundaries |
| 8.8 | Retain | Complete core generator/solver and narrower Fun baseline are accurately labeled; no claim of full polymorphism or list-equality checking |

The V table distinguishes the figure's core cases from subtraction in the starter and recursion in the larger language. It does not silently claim that Figure 8.9 includes every Fun constructor.

## Chapter 9 — Lambda calculus

| Section | Decision | Evidence / result |
|---|---|---|
| 9.1 | Retain | Binding-sensitive substitution, alpha-renaming, redex detection and normal-order limits have worked cases |
| 9.2 | Retain | Explicit Church terms, selection/addition reductions, natural-number boundary and evaluation-strategy caveat are present |
| 9.3 | Retain | Both requested interfaces, Y unfolding and signed-number extension are distinguished; reducer checks include capture avoidance |

## Implemented outcome and limits

- Evaluated all 48 numbered sections: 37 retain, 10 expand, 1 correct. All 12 exercise contracts and P10's five subparts are accounted for separately.
- Three additional top-level supplements bring the total to **28**. Existing supplements also gained modules, factorial boundaries, lazy evaluation and recursive typing. Four new Mermaid diagrams bring the total to **119**.
- Exercise presentation now follows task → interface → prerequisite/result checks → numbered reasoning → diagrams → expandable solution. P12's helper disclosure remains inside its solution.
- New runnable queue/factorial examples have eight checks. The state suite has two new checks for nested allocation. No existing homework contract, interpreter policy, or type-checker restriction was silently broadened.
- Remaining limitations are deliberate and visible: no user comprehension study; the website does not reproduce every PDF paragraph; the Fun type-checker download remains a restricted teaching baseline; lazy evaluation is explained but not implemented by the state engine; arithmetic examples assume no host overflow.
- Actual local/browser/CI results are recorded in `VALIDATION.md` and the publication workflow. A successful build alone is not proof of these pedagogical judgments.
