## How to use this reference

Click a linked inline code token or a chapter’s syntax guide to arrive at its explanation. Each entry links to a definition, a precise source page, and its integrated textbook practice. Use your browser’s Back command to return to the passage you were reading.

**Three layers:** OCaml is the implementation language; Let, Proc, Fun, and B are course languages; judgments such as Γ ⊢ e : T are mathematical descriptions. The same punctuation can serve different roles. Whole code blocks remain readable code; expandable chapter examples put explanations beside each line.

## Same symbol, different job

| Symbol | Read the surrounding construct | Meaning |
|---|---|---|
| `->` | Function type `int -> bool` | Input/output type relationship |
| `->` | `fun x -> e` or a match branch | Separates a binder/pattern from an expression |
| `↦` | Environment or memory extension | A map entry; its target can be a value, location, or type |
| `:=` | OCaml reference assignment | Writes a cell and returns unit |
| `:=` | B assignment | Writes a cell and returns the assigned value |
| `=` | OCaml binding `let x = e` | Introduces a binding |
| `=` | An equality expression | Uses the particular language's comparison rules |
| `::` / `@` | OCaml list expression | Cons adds one element at the front; append joins two lists |
| `#` | Displayed REPL prompt / `#use` / nameless `#0` | Prompt to omit / directive to type / lexical index in a different language |

For equality, compare [Fun and ML−](hw2.html#what-transfers-from-textbook-fun) before borrowing a rule. For function types, distinguish [tupled from curried inputs](02-ocaml.html#read-function-types-with-parentheses).

## Find a symbol

[Grammar and AST constructors](#grammar) · [Premises and conclusions](#rule) · [Binding: let x = e1 in e2](#let) · [Functions and application](#function) · [Patterns and recursive cases](#match) · [Lists, cons, and tuples](#list) · [Runtime evaluation judgment](#evaluation) · [Lookup and map extension](#extension) · [Closure and saved environment](#closure) · [Lexical address #i](#address) · [Locations and memory](#store) · [Reference operations and assignment](#reference) · [Records and field locations](#record) · [Reachability and fixed points](#reach) · [Continuation and exception frames](#continuation) · [Class environment, self, and super](#dispatch) · [Static typing judgment](#typing) · [Type constructors and unknowns](#type) · [Constraint generation V](#constraints) · [Type substitution versus term substitution](#substitution) · [Quantified type schemes](#scheme) · [Subtyping and variance](#subtype) · [Lambda binding and beta reduction](#lambda) · [Folds: combining a list](#fold)

<a id="grammar"></a>

## Grammar and AST constructors

**Look for:** `AST`.

A grammar lists allowed expression shapes. Its vertical bar separates alternatives, not logical OR. Metavariables such as e range over syntax trees.

**Example:** E ::= n | x | E + E describes numbers, variables, and additions; an OCaml datatype assigns a constructor to each form.

[Textbook §1.2](textbook-01.html#1-2-inductive-definition-of-programming-languages) · [Definition: Abstract syntax tree](glossary.html#abstract-syntax-tree) · [Lecture 5, PDF p. 5](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec5.pdf#page=5) · [Practice in the textbook](textbook-03.html#lecture-05) · [Definition source, PDF p. 23](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=23)

<a id="rule"></a>

## Premises and conclusions

**Look for:** `∈`.

An inference rule licenses its conclusion when every premise and side condition holds. A rule without premises is an axiom. The meaning of an arrow depends on its surrounding judgment.

**Example:** From n ∈ S derive n+3 ∈ S only when that construction rule is present.

[Textbook §1.1](textbook-01.html#1-1-inductive-definition-of-sets) · [Definition: Inference rule](glossary.html#inference-rule) · [Lecture 1, PDF p. 7](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec1.pdf#page=7) · [Practice in the textbook](textbook-01.html#lecture-01) · [Definition source, PDF p. 13](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=13)

<a id="let"></a>

## Binding: let x = e1 in e2

**Look for:** `let`, `LET`.

Evaluate the initializer in the original environment, then bind x for the body. Ordinary binding is not assignment. Recursive binding has different visibility rules.

**Example:** let x = 2 in let x = x + 1 in x returns 3; the inner initializer sees the outer x.

[Textbook §3.2.1](textbook-03.html#3-2-1-environment) · [Definition: Environment](glossary.html#environment) · [Lecture 5, PDF p. 11](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec5.pdf#page=11) · [Practice in the textbook](textbook-03.html#lecture-05) · [Definition source, PDF p. 102](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=102)

<a id="function"></a>

## Functions and application

**Look for:** `fun`, `proc`, `PROC`, `CALL`, `->`.

OCaml fun x -> e and course proc x e introduce parameter and body. f a applies a function. In a type, α -> β means a function taking α and returning β. Type arrows associate to the right; applications associate to the left.

**Example:** int -> int -> int means int -> (int -> int); f a b means (f a) b.

[Textbook §2.3](textbook-02.html#2-3-higher-order-functions) · [Definition: Higher-order function](glossary.html#higher-order-function) · [Lecture 3, PDF p. 24](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec3.pdf#page=24) · [Practice in the textbook](textbook-02.html#lecture-03) · [Definition source, PDF p. 81](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=81)

<a id="match"></a>

## Patterns and recursive cases

**Look for:** `match`, `with`, `let rec`.

match inspects a value's constructor and binds its components. Cases are tried in order. Patterns describe shapes, not Boolean tests. let rec makes a function name available in its own body; and can join mutually recursive function definitions. Recursive calls usually follow smaller components, but rec alone does not guarantee termination.

**Example:** match xs with [] -> 0 | h :: t -> 1 + length t covers empty and nonempty lists.

[Textbook §2.1](textbook-02.html#2-1-ocaml-basics) · [Definition: Pattern matching](glossary.html#pattern-matching) · [Lecture 3, PDF p. 28](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec3.pdf#page=28) · [Practice in the textbook](textbook-02.html#lecture-03) · [Definition source, PDF p. 54](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=54)

<a id="list"></a>

## Lists, cons, and tuples

**Look for:** `::`, `[]`, `@`.

[] is an empty list; h :: t constructs a list from a head and list tail; @ appends two lists. Tuple positions may have different types. [] can also denote an empty environment in mathematics: inspect the domain.

**Example:** 1 :: [2;3] and [1] @ [2;3] have the same value but use different operations.

[Textbook §2.2](textbook-02.html#2-2-recursive-functions) · [Definition: Structural recursion](glossary.html#structural-recursion) · [Lecture 3, PDF p. 39](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec3.pdf#page=39) · [Practice in the textbook](textbook-02.html#lecture-03) · [Definition source, PDF p. 70](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=70)

<a id="evaluation"></a>

## Runtime evaluation judgment

**Look for:** `ρ`, `ρ ⊢ e ⇒ v`, `eval`.

ρ ⊢ e ⇒ v says expression e evaluates to v under runtime environment ρ. With state, ρ,M ⊢ e ⇒ v,M′ also reports changed memory. This describes execution, not typing.

**Example:** If ρ(x)=3, then ρ ⊢ x+1 ⇒ 4.

[Textbook §1.2](textbook-01.html#1-2-inductive-definition-of-programming-languages) · [Definition: Semantics](glossary.html#semantics) · [Lecture 5, PDF p. 10](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec5.pdf#page=10) · [Practice in the textbook](textbook-03.html#lecture-05) · [Definition source, PDF p. 25](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=25)

<a id="extension"></a>

## Lookup and map extension

**Look for:** `↦`, `ρ(x)`, `Γ(x)`.

x ↦ v is a binding. ρ[x ↦ v] or [x ↦ v]ρ extends a map with a shadowing binding. ρ(x) means lookup. The map's codomain determines whether the result is a value, location, or type.

**Example:** In a nearest-first association list, (x,v)::env shadows an older x entry.

[Textbook §3.2.1](textbook-03.html#3-2-1-environment) · [Definition: Shadowing](glossary.html#shadowing) · [Lecture 5, PDF p. 8](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec5.pdf#page=8) · [Practice in the textbook](textbook-03.html#lecture-05) · [Definition source, PDF p. 105](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=105)

<a id="closure"></a>

## Closure and saved environment

**Look for:** `Closure`, `ρdef`.

A closure packages parameter, body, and definition environment. A lexical call extends that saved environment rather than using the caller environment for the body. Recursive variants also retain function identity.

**Example:** The closure (x,x+y,ρdef) obtains free y from ρdef and x from the actual argument.

[Textbook §4.2.1](textbook-04.html#4-2-1-static-scope) · [Definition: Closure](glossary.html#closure) · [Lecture 6, PDF p. 10](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec6.pdf#page=10) · [Practice in the textbook](textbook-04.html#lecture-06) · [Definition source, PDF p. 129](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=129)

<a id="address"></a>

## Lexical address #i

**Look for:** `#0`, `#1`.

A nameless variable refers to a position in a nearest-first environment. #0 is the nearest binder. Static translation and runtime environment layout must agree.

**Example:** proc x (proc y (x-y)) becomes proc (proc (#1-#0)).

[Textbook §4.2.1](textbook-04.html#4-2-1-static-scope) · [Definition: Lexical scope](glossary.html#lexical-scope) · [Lecture 7, PDF p. 10](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec7.pdf#page=10) · [Practice in the textbook](textbook-04.html#lecture-07) · [Definition source, PDF p. 128](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=128)

<a id="store"></a>

## Locations and memory

**Look for:** `M`, `σ`, `NEWREF`, `DEREF`, `SETREF`, `SEQ`, `SET`.

A location identifies a cell; memory maps locations to current values. Implicit-reference environments map variables to locations. Explicit-reference values can themselves be locations. The letter σ is not universal: HW3 uses it for the environment and M for memory. NEWREF evaluates and allocates a cell; DEREF reads it; SETREF writes through a reference expression. SET assigns a named variable in the implicit model. SEQ evaluates its first expression, then its second with the resulting memory.

**Example:** ρ(x)=L0 and M(L0)=4 means x reads as 4. Assignment changes M(L0), not the binding of x.

[Textbook §6.1.2](textbook-06.html#6-1-2-semantic-structure) · [Definition: Store](glossary.html#store) · [Lecture 8, PDF p. 25](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec8.pdf#page=25) · [Practice in the textbook](textbook-06.html#lecture-08) · [Definition source, PDF p. 165](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=165)

<a id="reference"></a>

## Reference operations and assignment

**Look for:** `ref`, `!`, `:=`, `CALLV`, `CALLR`, `CALLREF`.

OCaml ref allocates, ! reads, and := writes a reference cell and returns unit. B's ASSIGN returns the assigned value. In B, CALLV allocates fresh parameter cells after evaluating arguments; CALLR accepts identifiers and reuses caller locations. The textbook engine names its single-argument reference-call constructor CALLREF. A reference call is not lazy evaluation.

**Example:** let r = ref 0 in r := 2; !r returns 2, but the assignment subexpression returns ().

[Textbook §6.2.3](textbook-06.html#6-2-3-function-call-method) · [Definition: Call by reference](glossary.html#call-by-reference) · [Lecture 8, PDF p. 33](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec8.pdf#page=33) · [Practice in the textbook](textbook-06.html#lecture-08) · [Definition source, PDF p. 184](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=184)

<a id="record"></a>

## Records and field locations

**Look for:** `RECORD`, `FIELD`, `ASSIGNF`.

A record in the course state language maps field names to locations. Reading follows the location into memory; writing changes that cell. Shared records can expose shared field locations.

**Example:** If r.f and s.f identify one cell, a write through r.f is visible through s.f.

[Textbook §7.1](textbook-07.html#7-1-records) · [Definition: Record](glossary.html#record) · [Lecture 9, PDF p. 7](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec9.pdf#page=7) · [Practice in the textbook](textbook-07.html#lecture-09) · [Definition source, PDF p. 194](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=194)

<a id="reach"></a>

## Reachability and fixed points

**Look for:** `reach`, `Dom(M)`.

Dom(M) is the allocated-location set. Reachability repeatedly follows locations from live roots until no new location appears. Fresh allocation uses a location outside Dom(M); collection retains the reachable region.

**Example:** A reachable L0 pointing to L1 makes L1 reachable even without a variable directly naming L1.

[Textbook §7.3.2](textbook-07.html#7-3-2-automatic-memory-recycling) · [Definition: Reachability](glossary.html#reachability) · [Lecture 9, PDF p. 19](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec9.pdf#page=19) · [Practice in the textbook](textbook-07.html#lecture-09) · [Definition source, PDF p. 217](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=217)

<a id="continuation"></a>

## Continuation and exception frames

**Look for:** `k`, `raise`, `try`.

k describes pending computation. A handler frame saves its body and environment. Raising discards ordinary frames up to the nearest handler. OCaml's exception syntax differs from the course try/catch notation.

**Example:** try (1 + raise 5) catch x x returns 5 because the waiting addition is discarded.

[Integrated lecture 10 extension](textbook-06.html#lecture-10) · [Definition: Continuation](glossary.html#continuation) · [Lecture 10, PDF p. 9](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec10.pdf#page=9) · [Practice in the textbook](textbook-06.html#lecture-10) · [Definition source, PDF p. 9](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec10.pdf#page=9)

<a id="dispatch"></a>

## Class environment, self, and super

**Look for:** `ζ`, `self`, `super`.

ζ holds class information. self denotes the receiver. Normal lookup starts at the receiver's runtime class; super starts at the parent of the method's host class, keeping the same receiver.

**Example:** An inherited method can dispatch through self to a child override. super is not a second object.

[Integrated lecture 11 extension](textbook-07.html#lecture-11) · [Definition: Dynamic dispatch](glossary.html#dynamic-dispatch) · [Lecture 11, PDF p. 26](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec11.pdf#page=26) · [Practice in the textbook](textbook-07.html#lecture-11) · [Definition source, PDF p. 25](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec11.pdf#page=25)

<a id="typing"></a>

## Static typing judgment

**Look for:** `Γ`, `Γ ⊢ e : T`, `typeof`.

Γ ⊢ e : T says e has type T under type context Γ. Γ holds types or schemes, not runtime values. The turnstile separates assumptions from the judgment; the colon connects expression and type.

**Example:** Γ(x)=int licenses Γ ⊢ x+1:int without executing x+1.

[Textbook §8.4](textbook-08.html#8-4-type-inference-rules) · [Definition: Typing judgment](glossary.html#typing-judgment) · [Lecture 13, PDF p. 5](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec13.pdf#page=5) · [Practice in the textbook](textbook-08.html#lecture-13) · [Definition source, PDF p. 232](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=232)

<a id="type"></a>

## Type constructors and unknowns

**Look for:** `α`, `β`, `TyVar`, `TyFun`, `TyList`.

A type variable is an unknown type, not a program variable. Function and list types are recursive structures; unification compares their constructors and solves unknowns.

**Example:** α list = int list requires α=int; int and bool cannot unify.

[Textbook §8.6.1](textbook-08.html#8-6-1-generating-type-equations) · [Definition: Type variable](glossary.html#type-variable) · [Lecture 16, PDF p. 4](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec16.pdf#page=4) · [Practice in the textbook](textbook-08.html#lecture-16) · [Definition source, PDF p. 254](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=254)

<a id="constraints"></a>

## Constraint generation V

**Look for:** `V(Γ,e,t)`.

V(Γ,e,t) generates equations whose solutions give e target type t in Γ. It does not run e or necessarily solve the equations. Fresh variables describe unknown child types.

**Example:** For f a with target β, constrain f to α→β and a to fresh α.

[Textbook §8.6.2](textbook-08.html#8-6-2-solving-type-equations) · [Definition: Unification](glossary.html#unification) · [Lecture 16, PDF p. 6](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec16.pdf#page=6) · [Practice in the textbook](textbook-08.html#lecture-16) · [Definition source, PDF p. 259](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=259)

<a id="substitution"></a>

## Type substitution versus term substitution

**Look for:** `S(T)`, `FTV`.

A type substitution replaces unknown type variables throughout types, contexts, and equations. FTV collects free type variables. Term substitution instead replaces free program-variable occurrences and must avoid capture.

**Example:** S={α↦int} gives S(α→α)=int→int; e[x:=a] substitutes a term rather than a type.

[Textbook §8.6.2](textbook-08.html#8-6-2-solving-type-equations) · [Definition: Substitution](glossary.html#substitution) · [Lecture 17, PDF p. 21](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec17.pdf#page=21) · [Practice in the textbook](textbook-08.html#lecture-17) · [Definition source, PDF p. 266](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=266)

<a id="scheme"></a>

## Quantified type schemes

**Look for:** `∀`, `Gen`, `Inst`.

∀α.t quantifies variables that can be replaced freshly at every use. Generalization excludes variables free in the surrounding context. A procedure parameter is not generalized like a let binding.

**Example:** ∀α.α→α independently instantiates to int→int and bool→bool.

[Textbook §8.7](textbook-08.html#8-7-polymorphic-type-systems) · [Definition: Type scheme](glossary.html#type-scheme) · [Lecture 18, PDF p. 12](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec18.pdf#page=12) · [Practice in the textbook](textbook-08.html#lecture-18) · [Definition source, PDF p. 12](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec18.pdf#page=12)

<a id="subtype"></a>

## Subtyping and variance

**Look for:** `<:`.

A <: B means values of A may safely be used where B is expected. This is directional compatibility, not equality. Function parameters vary contravariantly and results covariantly.

**Example:** If ColorPoint <: Point, Point→ColorPoint can stand where Point→Point is expected.

[Integrated lecture 19 extension](textbook-08.html#lecture-19) · [Definition: Subtyping](glossary.html#subtyping) · [Lecture 19, PDF p. 10](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec19.pdf#page=10) · [Practice in the textbook](textbook-08.html#lecture-19) · [Definition source, PDF p. 8](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec19.pdf#page=8)

<a id="lambda"></a>

## Lambda binding and beta reduction

**Look for:** `λ`, `→β`.

λx.e binds x in e. Beta reduction (λx.e) a →β e[x:=a] uses capture-avoiding substitution. Rename conflicting binders before substituting.

**Example:** (λx.λy.x) y reduces to λz.y with z fresh; the argument's free y stays free.

[Textbook §9.1](textbook-09.html#9-1-lambda-calculus) · [Definition: Capture-avoiding substitution](glossary.html#capture-avoiding-substitution) · [Lecture 20, PDF p. 16](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec20.pdf#page=16) · [Practice in the textbook](textbook-09.html#lecture-20) · [Definition source, PDF p. 282](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=282)

<a id="fold"></a>

## Folds: combining a list

**Look for:** `fold`, `fold_left`, `fold_right`.

A fold replaces list construction with a combining function and a base accumulator. List.fold_left f z [a;b] combines as f (f z a) b; List.fold_right f [a;b] z associates as f a (f b z). The accumulator and element positions differ. In strict OCaml a right fold computes the recursive result before the outer combiner, so using && there does not stop traversal early. A bare fold is a general idea or a local helper; check its signature.

**Example:** List.fold_left (-) 0 [1;2] = -3, while List.fold_right (-) [1;2] 0 = -1.

[Textbook §2.3](textbook-02.html#2-3-higher-order-functions) · [Definition: Higher-order function](glossary.html#higher-order-function) · [Lecture 4, PDF p. 25](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec4.pdf#page=25) · [Practice in the textbook](textbook-02.html#lecture-04) · [Definition source, PDF p. 81](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=81)

