# Chapter-by-chapter comparison with the supplied textbook

Review date: 20 September 2026. Source: the locally downloaded `sources/pdfs/pl-book-eng.pdf`, Hakjoo Oh, *Principles of Programming Languages*, English draft dated 31 August 2026, 292 PDF pages. Public source: [course PDF](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf).

## Judgment and method

The earlier website was easier to **scan and revise**: it already had glossary links, chapter cheat sheets, lecture connections, Mermaid diagrams, executable examples, and all 48 numbered source sections. It was not consistently easier for a **first reading**. In particular, Chapter 2 compressed many pages of syntax and examples into short summaries; Chapters 3–9 often omitted intermediate derivation states. A factual mismatch also excluded list equality that the PDF includes on p.152.

This is an editorial assessment of explanatory coverage, not a measured learner study. No student comprehension test has been performed. The reader remains a companion, not a verbatim replacement for every source explanation or figure.

The review proceeded in chapter order:

1. Match the contents and numbered sections to `book/textbook-structure.json`.
2. Compare the existing chapter, integrated lecture practice, and source definitions/examples. Inspect extracted chapter text and focused PDF passages; check representative mathematical pages visually because extraction flattens proof bars and subscripts.
3. Ask whether the reader can identify the objects, decode the notation, follow intermediate steps, recognize an error/boundary, and connect the result to an exercise or implementation task.
4. Keep adequate explanations; add original paraphrases and worked reasoning only where the compact path leaves a gap. Link each supplement to exact PDF pages.
5. Check cross-chapter consistency, especially equality, state, type-system scope, and lambda evaluation strategy. Verify code changes, generated diagrams, links, and disclosure behavior before publication.

Visually inspected source pages in this review: 26, 54, 107, 139, **152**, 154, 170, 216, 267, and 288. These complement text comparisons; they are not a claim that every PDF page was visually rendered and checked.

## 1. Induction — pp. 11–32

**Before:** terminology and a few examples were concise, but membership, grammar, derivation, and proof were too easy to conflate.

| Section | Finding | Implemented action |
|---|---|---|
| 1.1 | Missing bridge between least generated set and an individual derivation | Added a list proof tree, no-base-case explanation, and rule/grammar/datatype comparison |
| 1.2 | A reader could confuse a grammar arrow with evaluation, or syntax addition with arithmetic | Added a notation table and complete nested-addition derivation |
| 1.3 | The number and scope of induction hypotheses needed an explicit example | Added the two-hypothesis leaf/Fork proof with case obligations |

**After:** the same constructors visibly determine data, computation, and proof cases. Three expandable supplements avoid lengthening the quick revision path.

## 2. Functional Programming — pp. 33–96

**Before:** the largest first-reading gap. The source's progression through values, types, application, tuples, lists, patterns, recursive examples, and higher-order functions was much more extensive than the website.

| Section | Finding | Implemented action |
|---|---|---|
| 2.1 | Basics too compressed for a beginner | Added expression/type table, integer/float operators, tuple/list punctuation, REPL terminator distinction, application/arrow grouping, scope, polymorphic identity, annotated datatype matching, modules, exceptions |
| 2.2 | Recursive design jumped to short examples | Added nth's zero-based contract, first-removal versus filter, full insertion-sort trace, helper precondition, accumulator invariant and stack/heap distinction |
| 2.3 | Fold equations existed, but selection among traversals needed help | Added map/filter/fold comparison, helper signatures, pipeline trace and noncommutative check |
| 2.4 | All 12 source problems already had numbered routes and worked solutions | Retained the exercise set; strengthened the prerequisite route leading into it |

**After:** syntax has a local explanation before it is used to design recursive solutions. Problem contracts remain authoritative; library helpers are not silently substituted where an assignment prohibits them.

## 3. Variables and the Environment — pp. 97–117

**Before:** correct shadowing overview and evaluator, but not enough intermediate mathematical judgments.

| Section | Finding | Implemented action |
|---|---|---|
| 3.1 | AST forms and initializer/body distinction already clear | Retained |
| 3.2 | The high-level semantic judgment supplied the needed overview | Retained; expanded its two detailed subsections |
| 3.2.1 | Map/domain/sum/product notation could block reading | Added a symbol table and concrete overriding lookup examples |
| 3.2.2 | Rules needed a complete derivation with changing environments labeled | Added six steps for LET and a Mermaid premise-dependency tree |
| 3.3 | Existing evaluator cases, error behavior, and shadowing example sufficient | Retained; new derivation explicitly connects to its LET code pattern |

**After:** a reader can map each premise to an evaluator operation without confusing AST construction, lookup, and arithmetic.

## 4. Defining and Calling Functions — pp. 119–145

**Before:** good static/dynamic comparison, but returned closures and recursive self-binding deserved slower explanations.

| Section | Finding | Implemented action |
|---|---|---|
| 4.1 | Function definition and call syntax adequately introduced | Retained |
| 4.2 | Free-variable calculation could be misapplied across LET's initializer | Added a five-step calculation separating binding regions |
| 4.2.1 | Saved environments needed an example surviving a completed call | Added returned add-three closure, state table, and Mermaid trace |
| 4.2.2 | Existing dynamic-scope worked comparison sufficient | Retained; new returned-closure supplement states its dynamic alternative |
| 4.2.3 | Why ordinary LET does not supply recursion was implicit | Added ordinary closure versus recursive self-binding explanation and factorial trace |
| 4.3 | Existing static/dynamic evaluator and recursive closure implementation adequate | Retained and connected to the new explanation |

**After:** readers can distinguish lexical environment capture from recursive rebinding instead of treating both as one lookup trick.

## 5. Fun — pp. 147–160

**Before:** the website and evaluator incorrectly restricted equality to integers and booleans. The PDF explicitly includes lists; its footnote leaves nested equality underspecified.

| Section | Finding | Implemented action |
|---|---|---|
| 5.1 | Large constructor list could blur syntax and values | Added surface expression → AST → intermediate list → final value trace |
| 5.2 | List equality omitted; partial-operation contracts scattered | Corrected primary explanation; added contract table and equality decision graph; stated nested-data policy |
| 5.3 | Evaluator reproduced the scalar-only mistake | Implemented recursive list equality with explicit admissibility checks and regression cases; retained existing reverse/output examples |

**Chosen completion of the source:** allow recursive integer/boolean/list data; reject Unit and all procedure variants anywhere, including after an unequal prefix; require matching outer families; differing allowed shapes inside lists are unequal. The document labels this as the example evaluator's interpretation. Generic OCaml comparison is not used on closures.

**Cross-chapter correction:** Chapter 8's checker stays monomorphic and scalar-only for equality. Its download label, explanation, code comment, and README now say that it is a narrower teaching baseline. It is no longer described as implementing the evaluator's entire equality domain. HW2/HW4 retain their separately specified scalar-equality discussion; they are different languages/tasks.

## 6. State Changes — pp. 161–192

**Before:** correct model comparison and state-threading code, but too few visible intermediate stores.

| Section | Finding | Implemented action |
|---|---|---|
| 6.1 | Explicit-reference overview already distinguished values from locations | Retained |
| 6.1.1 | Reference syntax adequately described | Retained |
| 6.1.2 | Reader had to reconstruct each output store | Added allocation/update/read table and graph, freshness after initializer, course assignment result versus OCaml unit |
| 6.2 | Existing explicit/implicit model comparison useful | Retained |
| 6.2.1 | Implicit syntax and variable-cell convention adequate | Retained |
| 6.2.2 | Fresh copied cells versus aliases needed a counterexample | Added x/y scalar trace and closure's saved binding versus current store explanation |
| 6.2.3 | Call-by-reference versus passing a reference value could be conflated | Added side-by-side location trace and variable-actual boundary |
| 6.3 | Both interpreters and existing runnable checks adequate | Retained; additional prose explains their state-passing obligations |

**After:** readers can state which map changes, which location changes, and which updated store reaches the next expression.

## 7. Pointers and Memory Management — pp. 193–221

**Before:** good record-sharing example and GC safety warning. Pointer indirection and a heap containing every reference shape still needed more detail.

| Section | Finding | Implemented action |
|---|---|---|
| 7.1 | Existing record sharing graph distinguishes field assignment from rebinding | Retained |
| 7.2 | Pointer variable's cell could be confused with its pointee | Added double-lookup table, address-of distinction, and update trace |
| 7.3 | Scope versus lifetime introduction adequate | Retained |
| 7.3.1 | Dangling pointer, double reclamation, leak and aliasing explanation adequate | Retained |
| 7.3.2 | Existing tiny cycle example lacked record and closure edges | Added p.216 heap as Mermaid, reachability sets by round, unreachable cycle, computable approximation explanation |
| 7.4 | Four implementation tasks and continuation-root limitation already unusually clear | Retained; new graph emphasizes preserving surviving edges during sweep |

**After:** the reader can trace pointer, record, and closure reachability on one concrete heap. The environment-only GC safe-point restriction remains explicit.

## 8. Static Type Systems — pp. 223–276

**Before:** pipeline was clear, but equations appeared to solve themselves; scheme freshness and the type checker's restricted coverage needed clarification.

| Section | Finding | Implemented action |
|---|---|---|
| 8.1 | Runtime/static comparison already distinguishes the analyses | Retained |
| 8.2 | Types and shared identity unknown adequately introduced | Retained |
| 8.3 | Γ versus runtime ρ already clear | Retained; scheme supplement adds an environment-dependent unknown |
| 8.4 | Needed one full typing derivation and careful safety vocabulary | Added conditional-procedure derivation and soundness/completeness distinction |
| 8.5 | Annotations versus equation generation adequately motivated | Retained |
| 8.6 | Existing identity-call pipeline trace sufficient as an overview | Retained |
| 8.6.1 | Single-call example did not show distant constraints meeting | Added f x + f 1, full equations table, solved result and Mermaid dependencies |
| 8.6.2 | Worklist/substitution distinction and indirect cycles needed steps | Added solver-state table and normalization exposing an occurs-check failure |
| 8.7 | Formula alone did not explain why environment variables remain shared | Added two identity instances and captured-y non-generalization example |
| 8.8 | Download and equality explanation overstated checker coverage | Relabeled restricted baseline; stated list-equality omission and recursive comparability obligation |

**After:** generated equations, their solution, and quantified versus shared variables are separate visible steps. Accepted types do not promise termination or rule out all partial-operation errors.

## 9. Lambda Calculus — pp. 277–292

**Before:** capture avoidance and strategy limits were good, but Church encodings and Y lacked enough explicit reductions.

| Section | Finding | Implemented action |
|---|---|---|
| 9.1 | Needed a compact distinction among renaming, substitution, reduction and strategy | Added comparison and normal-form counterexamples |
| 9.2 | Encoding ideas were listed without enough actual lambda terms | Added booleans/numerals/ADD/ISZERO table, selection trace, addition reasoning and Mermaid |
| 9.3 | Recursive translation needed one explicit self-reproducing reduction | Added Y F → G G → F(G G), base-case connection and eager-strategy boundary |

**After:** readers can interpret encodings behaviorally and check binding/strategy as well as numerical answers. Equational simplifications in the addition explanation are explicitly distinguished from a strict normal-order step trace. Existing natural/signed-number scope notes remain.

## Delivery and verification scope

- 25 collapsed supplements integrated into 25 of the 48 original sections; the other 23 sections retain their existing treatment. All nine chapters receive additions.
- Nine additional Mermaid diagrams (115 total), numbered steps, exact source links, and a chapter-by-chapter guide in Textbook Complete contents.
- Direct links reveal the targeted disclosure; mouse and keyboard retain native details behavior. Cheat sheets remain collapsed on ordinary visits. The supplements are included when printing and prior open states are restored afterward.
- Build/static checks enforce source-page bounds, internal links, unique anchors, all 48 original sections/checkpoints, all 25 supplements, all nine cheat sheets, and existing lecture/homework coverage.
- Executable equality regression checks cover empty/equal/different/nested lists, different allowed element shapes, mismatched outer families, and unsupported Unit/procedure values. The existing deployment workflow runs all textbook suites under OCaml 4.14.1 before publishing.
- See the appended record in `VALIDATION.md` for checks actually completed for this change. This review makes no claim of comprehensive mathematical proof checking, universal input testing, or learner-study results.
