## How to read the links

Highlighted terms throughout the notebook link here. Every entry gives an original plain-language definition, its connection to homework, and a direct link to the relevant **PDF page**. Most references point to the downloaded English textbook; topics added in the 2026 slides point to those slides explicitly.

## Notation at a glance

| Symbol | Read it as | In an implementation |
|---|---|---|
| ρ ⊢ e ⇒ v | Under runtime environment ρ, e evaluates to v | eval env expression |
| ρ, M ⊢ e ⇒ v, M′ | Evaluation also transforms memory | eval env memory expression returns a pair |
| Γ ⊢ e : T | Under type context Γ, e has type T | infer type_env expression |
| x ↦ v | A mapping from x to v | A lookup-table entry |
| Dom(M) | The allocated locations in memory M | Used to decide freshness |
| [x ↦ v]ρ | Extend or shadow x in environment ρ | Prepend a binding when lookup chooses the first |
| S(T) | Apply a type substitution throughout T | Recursive substitution helper |
| FTV(T) | Free type variables of T | A set computed by traversing the type |
| ∀α. T | A scheme universally quantifying α | Freshly instantiate α at each use |
| S <: T | S can safely be used where T is expected | A subtype check, not unification |

The course uses different letters for environments and memory in different documents. In HW3, σ is the environment and M is memory. A symbol’s domain and codomain identify its role.

## Choose the kind of question

- **What does this symbol mean?** Start with the [syntax reference](syntax.html#same-symbol-different-job).
- **How does the definition work in a program?** Each entry below links to its numbered textbook context and a focused explanation.
- **Which assignment uses it?** Follow the [homework map](homework-map.html), where textbook and assignment numbers stay separate.

The evaluator names in the notation table are conceptual. Actual signatures differ: HW2 uses `eval expression environment`; HW3 uses `eval environment memory expression`. Read the template before copying a call.

## Inductive definition

A specification of the smallest set containing its base elements and closed under its construction rules.

**Use it in:** HW1 P9–P13; every AST in HW2–HW4.

[Textbook §1.1](textbook-01.html#1-1-inductive-definition-of-sets) · [Focused explanation](01-induction.html) · [English textbook, PDF p. 12](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=12)

## Inference rule

A rule that derives a conclusion when all its premises and side conditions hold. A rule with no premises is an axiom.

**Use it in:** HW2 and HW3 semantic rules; HW4 typing rules.

[Textbook §1.1](textbook-01.html#1-1-inductive-definition-of-sets) · [Focused explanation](01-induction.html) · [English textbook, PDF p. 13](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=13)

## Abstract syntax tree

A tree representing a program's constructors and children rather than its surface punctuation. The textbook introduces programs as trees before implementing them with datatypes.

**Use it in:** HW1 P12–P15; HW2–HW4 exp datatypes.

[Textbook §1.2](textbook-01.html#1-2-inductive-definition-of-programming-languages) · [Focused explanation](04-expressions.html) · [English textbook, PDF p. 23](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=23)

## Semantics

The rules defining a program's meaning, such as how an expression evaluates to a value. A grammar alone does not provide these rules.

**Use it in:** HW2 runml; HW3 runb.

[Textbook §1.2](textbook-01.html#1-2-inductive-definition-of-programming-languages) · [Focused explanation](04-expressions.html) · [English textbook, PDF p. 25](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=25)

## Structural induction

A proof method with a base case for each base constructor and an inductive case that assumes the property for immediate recursive components.

**Use it in:** HW1 P9–P13 correctness reasoning.

[Textbook §1.3](textbook-01.html#1-3-inductive-proof) · [Focused explanation](01-induction.html) · [English textbook, PDF p. 28](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=28)

## Pattern matching

Selecting a case by the constructor and components of a value, binding names to the matched components.

**Use it in:** All HW1 recursive datatypes; interpreter and checker branches.

[Textbook §2.1](textbook-02.html#2-1-ocaml-basics) · [Focused explanation](02-ocaml.html) · [English textbook, PDF p. 54](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=54)

## Structural recursion

Computing over an inductively built value by recursively processing its smaller components and combining their results.

**Use it in:** HW1 lists, trees, formulas, and symbolic differentiation.

[Textbook §2.2](textbook-02.html#2-2-recursive-functions) · [Focused explanation](03-recursion.html) · [English textbook, PDF p. 70](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=70)

## Tail recursion

Recursion in which the recursive call is the final computation in its branch. An accumulator can carry work that would otherwise remain on the stack.

**Use it in:** HW1 long list and interval traversals.

[Textbook §2.2](textbook-02.html#2-2-recursive-functions) · [Focused explanation](03-recursion.html) · [English textbook, PDF p. 79](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=79)

## Higher-order function

A function that accepts a function as an argument or returns one as its result.

**Use it in:** HW1 P6 sigma, P7 forall, P8 double.

[Textbook §2.3](textbook-02.html#2-3-higher-order-functions) · [Focused explanation](03-recursion.html) · [English textbook, PDF p. 81](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=81)

## Environment

A mapping that gives identifiers their current interpretation. It maps names to values in a pure interpreter, and to locations or procedure bindings in B.

**Use it in:** HW1 P15 context; HW2 values; HW3 locations and procedures.

[Textbook §3.2.1](textbook-03.html#3-2-1-environment) · [Focused explanation](04-expressions.html) · [English textbook, PDF p. 102](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=102)

## Syntactic sugar

A convenient language form expressible by a translation into more basic forms while preserving its intended behavior.

**Use it in:** HW2 fixed-point examples; let and multiargument encodings.

[Textbook §4.1](textbook-04.html#4-1-syntactic-structure) · [Focused explanation](15-lambda.html) · [English textbook, PDF p. 123](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=123)

## Free variable

A variable occurrence without a corresponding binder inside the expression being considered. It may still be bound by an outer context.

**Use it in:** HW1 P15; HW2 closures.

[Textbook §4.2](textbook-04.html#4-2-semantic-structure) · [Focused explanation](06-scope-recursion.html) · [English textbook, PDF p. 124](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=124)

## Lexical scope

A reference is associated with an enclosing declaration according to program structure, rather than the chain of runtime callers.

**Use it in:** HW1 P15; HW2 and HW3 procedure bodies.

[Textbook §4.2.1](textbook-04.html#4-2-1-static-scope) · [Focused explanation](05-closures.html) · [English textbook, PDF p. 128](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=128)

## Closure

A procedure's parameter and body packaged with its definition environment, which supplies meanings for free variables when the procedure is called.

**Use it in:** HW2 Procedure, RecProcedure, and MRecProcedure.

[Textbook §4.2.1](textbook-04.html#4-2-1-static-scope) · [Focused explanation](05-closures.html) · [English textbook, PDF p. 129](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=129)

## Dynamic scope

Resolving nonlocal names through runtime calling environments. This differs from the lexical scope required by the posted interpreters.

**Use it in:** A useful negative test for HW2 and HW3.

[Textbook §4.2.2](textbook-04.html#4-2-2-dynamic-scope) · [Focused explanation](05-closures.html) · [English textbook, PDF p. 134](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=134)

## Store

A mapping from locations to their current values. Stateful evaluation returns both a value and an updated store, also called memory.

**Use it in:** HW3 every stateful evaluation case.

[Textbook §6.1.2](textbook-06.html#6-1-2-semantic-structure) · [Focused explanation](07-state.html) · [English textbook, PDF p. 165](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=165)

## Call by value

Evaluate the argument before entering the function body. A pure interpreter binds the parameter to that value; an implicit-reference interpreter puts it in a fresh parameter cell. Copying a reference or record value can still preserve shared cells.

**Use it in:** HW2 CALL; HW3 CALLV.

[Textbook §6.2.3](textbook-06.html#6-2-3-function-call-method) · [Focused explanation](07-state.html) · [English textbook, PDF p. 183](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=183)

## Call by reference

Bind a formal parameter to the caller's existing variable location so assignments through the parameter affect that shared cell.

**Use it in:** HW3 CALLR.

[Textbook §6.2.3](textbook-06.html#6-2-3-function-call-method) · [Focused explanation](07-state.html) · [English textbook, PDF p. 184](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=184)

## Record

In the imperative course language, a collection mapping field names to locations. Field contents are found in the store.

**Use it in:** HW3 RECORD, FIELD, ASSIGNF.

[Textbook §7.1](textbook-07.html#7-1-records) · [Focused explanation](08-records.html) · [English textbook, PDF p. 194](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=194)

## Reachability

Whether a location can be reached by following references from the current roots. Tracing garbage collection retains reachable cells conservatively.

**Use it in:** Reasoning extension to HW3 sharing; no GC implementation requested.

[Textbook §7.3.2](textbook-07.html#7-3-2-automatic-memory-recycling) · [Focused explanation](08-records.html) · [English textbook, PDF p. 217](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=217)

## Garbage collection

Automatic reclamation of storage that can safely be reused, commonly based on identifying cells unreachable from runtime roots.

**Use it in:** Textbook §7.3 and lecture 9; beyond the HW3 implementation contract.

[Textbook §7.3.2](textbook-07.html#7-3-2-automatic-memory-recycling) · [Focused explanation](08-records.html) · [English textbook, PDF p. 218](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=218)

## Type

An abstraction classifying values and constraining operations that may safely use them. Function types describe argument/result relationships.

**Use it in:** HW4 typ datatype and typeof.

[Textbook §8.2](textbook-08.html#8-2-type) · [Focused explanation](11-types.html) · [English textbook, PDF p. 226](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=226)

## Type environment

A context mapping identifiers to types, or to type schemes in a polymorphic system. It is used by static analysis rather than runtime evaluation.

**Use it in:** HW4 variable lookup, bindings, procedures, recursion.

[Textbook §8.3](textbook-08.html#8-3-type-environment) · [Focused explanation](11-types.html) · [English textbook, PDF p. 230](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=230)

## Typing judgment

A statement Γ ⊢ e : T asserting that expression e has type T under the assumptions in Γ.

**Use it in:** HW4 all constraint rules.

[Textbook §8.4](textbook-08.html#8-4-type-inference-rules) · [Focused explanation](11-types.html) · [English textbook, PDF p. 232](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=232)

## Soundness

The guarantee that accepted programs satisfy the safety property established for a particular language and its typing rules. It does not by itself prove termination or absence of every runtime failure.

**Use it in:** HW4 checker contract and partial-operation caveat.

[Textbook §8.4](textbook-08.html#8-4-type-inference-rules) · [Focused explanation](11-types.html) · [English textbook, PDF p. 241](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=241)

## Type variable

An unknown type used in inference. Constraints restrict what it can become; a free unknown is distinct from a universally quantified scheme variable.

**Use it in:** HW4 fresh_tyvar.

[Textbook §8.6.1](textbook-08.html#8-6-1-generating-type-equations) · [Focused explanation](12-inference.html) · [English textbook, PDF p. 254](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=254)

## Unification

Solving type equations by finding a substitution that makes both sides structurally identical, or rejecting incompatible constraints.

**Use it in:** HW4 constraint solver.

[Textbook §8.6.2](textbook-08.html#8-6-2-solving-type-equations) · [Focused explanation](12-inference.html) · [English textbook, PDF p. 259](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=259)

## Occurs check

Rejecting a proposed variable binding when the variable occurs within its replacement type, preventing an infinite type in a finite simple-type grammar.

**Use it in:** HW4 self-application and indirect cyclic constraints.

[Textbook §8.6.2](textbook-08.html#8-6-2-solving-type-equations) · [Focused explanation](12-inference.html) · [English textbook, PDF p. 269](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=269)

## Substitution

A mapping from type variables to types, applied throughout a type expression. Term substitution in lambda calculus is a separate operation replacing free variable occurrences while avoiding capture.

**Use it in:** HW4 composed substitutions; lambda calculus term substitution.

[Textbook §8.6.2](textbook-08.html#8-6-2-solving-type-equations) · [Focused explanation](12-inference.html) · [English textbook, PDF p. 266](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=266)

## Let-polymorphism

Giving an eligible let-bound value a type scheme whose quantified variables are freshly instantiated at each use. Variables fixed by the surrounding environment must remain shared.

**Use it in:** HW4 extension if required by the instructor.

[Textbook §8.7](textbook-08.html#8-7-polymorphic-type-systems) · [Focused explanation](13-polymorphism.html) · [English textbook, PDF p. 273](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=273)

## Type scheme

A type together with explicitly universally quantified variables, such as ∀α. α → α. Instantiation replaces only those quantified variables with fresh unknowns.

**Use it in:** Polymorphic let inference.

[Textbook §8.7](textbook-08.html#8-7-polymorphic-type-systems) · [Focused explanation](13-polymorphism.html) · [Lecture 18, PDF p. 12](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec18.pdf#page=12)

## Continuation

An explicit representation of the work waiting for a computation's result. Exception handling can inspect and discard these pending frames.

**Use it in:** Lecture 10 extension; not a posted interpreter constructor.

[Integrated lecture 10 extension](textbook-06.html#lecture-10) · [Focused explanation](09-exceptions.html) · [Lecture 10, PDF p. 9](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec10.pdf#page=9)

## Dynamic dispatch

Choosing a method implementation by searching from the receiver's runtime class through its ancestors.

**Use it in:** Builds on HW3 state and records.

[Integrated lecture 11 extension](textbook-07.html#lecture-11) · [Focused explanation](10-objects.html) · [Lecture 11, PDF p. 25](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec11.pdf#page=25)

## Subtyping

A relation S <: T allowing an S value where a T is expected. Function arguments are contravariant and results covariant in the lecture's system.

**Use it in:** Typed class extension, not ML− HW4.

[Integrated lecture 19 extension](textbook-08.html#lecture-19) · [Focused explanation](14-subtyping.html) · [Lecture 19, PDF p. 8](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec19.pdf#page=8)

## Lambda calculus

A core language of variables, abstractions, and applications, used to study binding, substitution, computation, and encodings.

**Use it in:** HW1 P15; HW2 fixed-point examples.

[Textbook §9.1](textbook-09.html#9-1-lambda-calculus) · [Focused explanation](15-lambda.html) · [English textbook, PDF p. 279](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=279)

## Beta reduction

Reducing an applied abstraction by substituting its argument for the parameter's free occurrences in the body, without capturing variables.

**Use it in:** Understanding the fixed-point tests in HW2.

[Textbook §9.1](textbook-09.html#9-1-lambda-calculus) · [Focused explanation](15-lambda.html) · [English textbook, PDF p. 281](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=281)

## Alpha-renaming

Consistently changing a binder and the occurrences it binds while preserving the program's binding structure.

**Use it in:** HW1 P15 scope reasoning and capture-avoiding substitution.

[Textbook §9.1](textbook-09.html#9-1-lambda-calculus) · [Focused explanation](15-lambda.html) · [English textbook, PDF p. 283](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=283)

## Normal order

Choosing the leftmost outermost reducible application, continuing under abstractions when computing a full normal form.

**Use it in:** Lecture 20 evaluation-strategy comparison.

[Textbook §9.1](textbook-09.html#9-1-lambda-calculus) · [Focused explanation](15-lambda.html) · [English textbook, PDF p. 284](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=284)

## Capture-avoiding substitution

Replacing free occurrences of a name while renaming conflicting binders so that free variables in the replacement do not accidentally become bound.

**Use it in:** Textbook §9.3 reduce; HW1 binding analysis.

[Textbook §9.1](textbook-09.html#9-1-lambda-calculus) · [Focused explanation](textbook-09.html) · [English textbook, PDF p. 282](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=282)

## Shadowing

A nearer binding with the same name hides an outer binding within its scope; extending an environment does not mutate the outer binding.

**Use it in:** Textbook §3.3 and §4.3; HW2 LET.

[Textbook §3.2.1](textbook-03.html#3-2-1-environment) · [Focused explanation](textbook-03.html) · [English textbook, PDF p. 105](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=105)

## Normal form

A lambda term containing no beta-redex anywhere, including inside abstraction bodies.

**Use it in:** Textbook §9.3 reduce.

[Textbook §9.1](textbook-09.html#9-1-lambda-calculus) · [Focused explanation](textbook-09.html) · [English textbook, PDF p. 282](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=282)

## Redex

A reducible lambda application whose function is an abstraction, of the form (lambda x. body) argument.

**Use it in:** Textbook §9.3 normal-order reduction.

[Textbook §9.1](textbook-09.html#9-1-lambda-calculus) · [Focused explanation](textbook-09.html) · [English textbook, PDF p. 281](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=281)

