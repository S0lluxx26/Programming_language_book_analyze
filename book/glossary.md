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

## Inductive definition

A specification of the smallest set containing its base elements and closed under its construction rules.

**Use it in:** HW1 P9–P13; every AST in HW2–HW4.

[See the explanation](01-induction.html) · [English textbook, PDF p. 12](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=12)

## Inference rule

A rule that derives a conclusion when all its premises and side conditions hold. A rule with no premises is an axiom.

**Use it in:** HW2 and HW3 semantic rules; HW4 typing rules.

[See the explanation](01-induction.html) · [English textbook, PDF p. 13](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=13)

## Abstract syntax tree

A tree representing a program's constructors and children rather than its surface punctuation. The textbook introduces programs as trees before implementing them with datatypes.

**Use it in:** HW1 P12–P15; HW2–HW4 exp datatypes.

[See the explanation](04-expressions.html) · [English textbook, PDF p. 23](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=23)

## Semantics

The rules defining a program's meaning, such as how an expression evaluates to a value. A grammar alone does not provide these rules.

**Use it in:** HW2 runml; HW3 runb.

[See the explanation](04-expressions.html) · [English textbook, PDF p. 25](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=25)

## Structural induction

A proof method with a base case for each base constructor and an inductive case that assumes the property for immediate recursive components.

**Use it in:** HW1 P9–P13 correctness reasoning.

[See the explanation](01-induction.html) · [English textbook, PDF p. 28](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=28)

## Pattern matching

Selecting a case by the constructor and components of a value, binding names to the matched components.

**Use it in:** All HW1 recursive datatypes; interpreter and checker branches.

[See the explanation](02-ocaml.html) · [English textbook, PDF p. 54](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=54)

## Structural recursion

Computing over an inductively built value by recursively processing its smaller components and combining their results.

**Use it in:** HW1 lists, trees, formulas, and symbolic differentiation.

[See the explanation](03-recursion.html) · [English textbook, PDF p. 70](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=70)

## Tail recursion

Recursion in which the recursive call is the final computation in its branch. An accumulator can carry work that would otherwise remain on the stack.

**Use it in:** HW1 long list and interval traversals.

[See the explanation](03-recursion.html) · [English textbook, PDF p. 79](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=79)

## Higher-order function

A function that accepts a function as an argument or returns one as its result.

**Use it in:** HW1 P6 sigma, P7 forall, P8 double.

[See the explanation](03-recursion.html) · [English textbook, PDF p. 81](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=81)

## Environment

A mapping that gives identifiers their current interpretation. It maps names to values in a pure interpreter, and to locations or procedure bindings in B.

**Use it in:** HW1 P15 context; HW2 values; HW3 locations and procedures.

[See the explanation](04-expressions.html) · [English textbook, PDF p. 102](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=102)

## Syntactic sugar

A convenient language form expressible by a translation into more basic forms while preserving its intended behavior.

**Use it in:** HW2 fixed-point examples; let and multiargument encodings.

[See the explanation](15-lambda.html) · [English textbook, PDF p. 123](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=123)

## Free variable

A variable occurrence without a corresponding binder inside the expression being considered. It may still be bound by an outer context.

**Use it in:** HW1 P15; HW2 closures.

[See the explanation](06-scope-recursion.html) · [English textbook, PDF p. 124](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=124)

## Lexical scope

A reference is associated with an enclosing declaration according to program structure, rather than the chain of runtime callers.

**Use it in:** HW1 P15; HW2 and HW3 procedure bodies.

[See the explanation](05-closures.html) · [English textbook, PDF p. 128](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=128)

## Closure

A procedure's parameter and body packaged with its definition environment, which supplies meanings for free variables when the procedure is called.

**Use it in:** HW2 Procedure, RecProcedure, and MRecProcedure.

[See the explanation](05-closures.html) · [English textbook, PDF p. 129](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=129)

## Dynamic scope

Resolving nonlocal names through runtime calling environments. This differs from the lexical scope required by the posted interpreters.

**Use it in:** A useful negative test for HW2 and HW3.

[See the explanation](05-closures.html) · [English textbook, PDF p. 134](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=134)

## Store

A mapping from locations to their current values. Stateful evaluation returns both a value and an updated store, also called memory.

**Use it in:** HW3 every stateful evaluation case.

[See the explanation](07-state.html) · [English textbook, PDF p. 165](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=165)

## Call by value

Evaluate an argument before the call. In the implicit-reference language, initialize a fresh parameter cell with the argument value.

**Use it in:** HW2 CALL; HW3 CALLV.

[See the explanation](07-state.html) · [English textbook, PDF p. 183](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=183)

## Call by reference

Bind a formal parameter to the caller's existing variable location so assignments through the parameter affect that shared cell.

**Use it in:** HW3 CALLR.

[See the explanation](07-state.html) · [English textbook, PDF p. 184](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=184)

## Record

In the imperative course language, a collection mapping field names to locations. Field contents are found in the store.

**Use it in:** HW3 RECORD, FIELD, ASSIGNF.

[See the explanation](08-records.html) · [English textbook, PDF p. 194](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=194)

## Reachability

Whether a location can be reached by following references from the current roots. Tracing garbage collection retains reachable cells conservatively.

**Use it in:** Reasoning extension to HW3 sharing; no GC implementation requested.

[See the explanation](08-records.html) · [English textbook, PDF p. 217](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=217)

## Garbage collection

Automatic reclamation of storage that can safely be reused, commonly based on identifying cells unreachable from runtime roots.

**Use it in:** Lecture extension beyond HW3.

[See the explanation](08-records.html) · [English textbook, PDF p. 218](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=218)

## Type

An abstraction classifying values and constraining operations that may safely use them. Function types describe argument/result relationships.

**Use it in:** HW4 typ datatype and typeof.

[See the explanation](11-types.html) · [English textbook, PDF p. 226](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=226)

## Type environment

A context mapping identifiers to types, or to type schemes in a polymorphic system. It is used by static analysis rather than runtime evaluation.

**Use it in:** HW4 variable lookup, bindings, procedures, recursion.

[See the explanation](11-types.html) · [English textbook, PDF p. 230](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=230)

## Typing judgment

A statement Γ ⊢ e : T asserting that expression e has type T under the assumptions in Γ.

**Use it in:** HW4 all constraint rules.

[See the explanation](11-types.html) · [English textbook, PDF p. 232](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=232)

## Soundness

The guarantee that accepted programs satisfy the safety property established for a particular language and its typing rules. It does not by itself prove termination or absence of every runtime failure.

**Use it in:** HW4 checker contract and partial-operation caveat.

[See the explanation](11-types.html) · [English textbook, PDF p. 241](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=241)

## Type variable

An unknown type used in inference. Constraints restrict what it can become; a free unknown is distinct from a universally quantified scheme variable.

**Use it in:** HW4 fresh_tyvar.

[See the explanation](12-inference.html) · [English textbook, PDF p. 254](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=254)

## Unification

Solving type equations by finding a substitution that makes both sides structurally identical, or rejecting incompatible constraints.

**Use it in:** HW4 constraint solver.

[See the explanation](12-inference.html) · [English textbook, PDF p. 259](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=259)

## Occurs check

Rejecting a proposed variable binding when the variable occurs within its replacement type, preventing an infinite type in a finite simple-type grammar.

**Use it in:** HW4 self-application and indirect cyclic constraints.

[See the explanation](12-inference.html) · [English textbook, PDF p. 269](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=269)

## Substitution

A mapping from type variables to types, applied throughout a type expression. Term substitution in lambda calculus is a separate operation replacing free variable occurrences while avoiding capture.

**Use it in:** HW4 composed substitutions; lambda calculus term substitution.

[See the explanation](12-inference.html) · [English textbook, PDF p. 266](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=266)

## Let-polymorphism

Giving an eligible let-bound value a type scheme whose quantified variables are freshly instantiated at each use. Variables fixed by the surrounding environment must remain shared.

**Use it in:** HW4 extension if required by the instructor.

[See the explanation](13-polymorphism.html) · [English textbook, PDF p. 273](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=273)

## Type scheme

A type together with explicitly universally quantified variables, such as ∀α. α → α. Instantiation replaces only those quantified variables with fresh unknowns.

**Use it in:** Polymorphic let inference.

[See the explanation](13-polymorphism.html) · [Lecture 18, PDF p. 12](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec18.pdf#page=12)

## Continuation

An explicit representation of the work waiting for a computation's result. Exception handling can inspect and discard these pending frames.

**Use it in:** Lecture 10 extension; not a posted interpreter constructor.

[See the explanation](09-exceptions.html) · [Lecture 10, PDF p. 9](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec10.pdf#page=9)

## Dynamic dispatch

Choosing a method implementation by searching from the receiver's runtime class through its ancestors.

**Use it in:** Builds on HW3 state and records.

[See the explanation](10-objects.html) · [Lecture 11, PDF p. 25](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec11.pdf#page=25)

## Subtyping

A relation S <: T allowing an S value where a T is expected. Function arguments are contravariant and results covariant in the lecture's system.

**Use it in:** Typed class extension, not ML− HW4.

[See the explanation](14-subtyping.html) · [Lecture 19, PDF p. 8](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec19.pdf#page=8)

## Lambda calculus

A core language of variables, abstractions, and applications, used to study binding, substitution, computation, and encodings.

**Use it in:** HW1 P15; HW2 fixed-point examples.

[See the explanation](15-lambda.html) · [English textbook, PDF p. 279](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=279)

## Beta reduction

Reducing an applied abstraction by substituting its argument for the parameter's free occurrences in the body, without capturing variables.

**Use it in:** Understanding the fixed-point tests in HW2.

[See the explanation](15-lambda.html) · [English textbook, PDF p. 281](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=281)

## Alpha-renaming

Consistently changing a binder and the occurrences it binds while preserving the program's binding structure.

**Use it in:** HW1 P15 scope reasoning and capture-avoiding substitution.

[See the explanation](15-lambda.html) · [English textbook, PDF p. 283](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=283)

## Normal order

Choosing the leftmost outermost reducible application, continuing under abstractions when computing a full normal form.

**Use it in:** Lecture 20 evaluation-strategy comparison.

[See the explanation](15-lambda.html) · [English textbook, PDF p. 284](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=284)

