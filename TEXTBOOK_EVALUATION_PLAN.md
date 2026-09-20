# Evaluate the textbook reader against the PDF, then implement improvements

Baseline: commit `5794822`, including the first review and its 25 expandable explanations. Source: the downloaded 292-page English textbook dated 31 August 2026. This follow-up evaluates that improved state; it does not count the previous additions as new work.

## Evaluation rules

For each of the 48 numbered source sections, inspect the current chapter together with its supplements, integrated lecture practice, and relevant problems. Judge five concrete reading tasks:

1. **Meaning:** can a reader state the main definition and identify its inputs and result?
2. **Notation:** are new symbols, value shapes, and host/object-language distinctions explained or directly linked?
3. **Reasoning:** can the reader reconstruct the intermediate steps of a representative example without guessing?
4. **Practice:** is the required interface, prerequisite, and success criterion visible before the solution?
5. **Fidelity:** does the prose/code agree with the PDF, with extensions and implementation limits labeled?

Use **retain**, **expand**, or **correct**, with a specific reason. Do not assign invented comprehension percentages. Passing a structural check is evidence of coverage, not proof that every learner will understand the material.

## Chapter-by-chapter work

| Order | Chapter / source pages | Comparison to perform | Acceptance evidence |
|---|---|---|---|
| 1 | Induction, 11–32 | Rules, least sets, finite derivations, structural proof cases | Distinguish membership from an invariant and identify all induction hypotheses |
| 2 | Functional programming, 33–96 | Types, patterns, recursive design, higher-order functions; individually compare all 12 exercises and P10's five subparts | Function interfaces, data definitions, boundary contracts, and prerequisite links support an independent attempt |
| 3 | Environments, 97–117 | Syntax domains, map notation, LET/IF rules, source interpreter | Translate a rule to code and distinguish a bad value from a missing binding |
| 4 | Functions, 119–145 | Definition/application, capture, scope, recursion and implementation | Trace caller/saved environments and explain a returned closure |
| 5 | Fun, 147–160 | Constructor contracts, list equality, mutual recursion, output | Explain evaluation order and the actual recursive environments |
| 6 | State, 161–192 | Explicit/implicit references, store threading, parameter passing | Record the store after a nested effectful initializer and a call |
| 7 | Heap, 193–221 | Records, pointer indirection, reclamation, roots, GC implementation | Predict sharing and distinguish safe reclamation from a merely unreachable-looking cell |
| 8 | Types, 223–276 | Rules, equation generation/solving, schemes, implementation scope | Connect a particular syntax rule to generated equations and solved types |
| 9 | Lambda calculus, 277–292 | Parsing, substitution, reduction, encodings and translation | Identify a redex, avoid capture, and distinguish normal order from eager execution |

## Implementation and verification

1. Record the second-pass judgment for every section, explicitly retaining explanations that are adequate.
2. Add missing source-grounded explanations in the existing reading path. Preserve collapsed cheat sheets, optional detail panels, section numbers, and source links.
3. Keep exercise signatures and data constructors close to the task; connect them to the chapter explanation needed to solve it.
4. Use numbered steps and Mermaid for newly identified reasoning gaps. Keep source claims distinct from original examples and extensions.
5. Run the build and static source/link/diagram checks. Run changed executable examples through the existing OCaml CI gate; inspect light/dark and mobile reading layouts and disclosure navigation.
6. Publish using the repository's existing SSH remote and GitHub Pages workflow; verify the public version. Record actual results in the follow-up report and `VALIDATION.md`.

## Completion criteria

- All nine chapters and 48 sections receive a recorded retain/expand/correct decision against the improved baseline.
- All 12 Chapter 2 exercise contracts and all five Problem 10 transformations are individually accounted for.
- Every identified accuracy or first-reading gap within this pass is either implemented or explicitly bounded as outside the source's specification.
- Build, source references, links, diagrams, affected executable checks, and public deployment pass. The result states the limits of this editorial assessment.
