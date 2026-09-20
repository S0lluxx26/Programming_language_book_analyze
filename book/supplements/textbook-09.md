## 9.1 Separate renaming, substitution, and evaluation order

Source: [PDF pp. 279–285](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=279).

| Operation | Meaning | Example |
|---|---|---|
| Alpha-renaming | Change a bound name and exactly its bound occurrences to a fresh name | `λx.x` and `λz.z` represent the same binding structure |
| Capture-avoiding substitution | Replace free occurrences while preserving binding | Substitute y for x in `λy.x y` only after renaming the inner y |
| Beta-reduction | Contract a call whose function is a lambda | `(λx.body) arg → body[x:=arg]` |
| Normal order | Choose the leftmost outermost redex at every step | Avoid evaluating an unused divergent argument |

For `(λx. λy. x y) y`:

1. The argument y is free; it must remain free after substitution.
2. Rename the inner binder y to a fresh z, obtaining `(λx. λz. x z) y`.
3. Substitute the argument for the free x in the body, giving `λz. y z`.
4. Stop: `y z` is not a beta-redex because its function is a variable, not a lambda.

This result is a normal form even though it contains an application. Conversely, `λz. (λw.w) z` is a lambda but still contains a redex; full normalization proceeds to `λz.z`.

## 9.2 Decode Church data through what it does

Source: [PDF pp. 286–290](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=286). The names below abbreviate closed lambda terms. They are explanatory names, not extra primitive constructors.

| Name | Encoding | Behavioral meaning |
|---|---|---|
| TRUE | `λt.λf.t` | Select the first argument |
| FALSE | `λt.λf.f` | Select the second argument |
| ZERO | `λs.λz.z` | Apply s zero times |
| TWO | `λs.λz.s (s z)` | Apply s twice |
| ADD | `λn.λm.λs.λz.m s (n s z)` | Do n applications, then m more |
| ISZERO | `λn.n (λignored.FALSE) TRUE` | Zero keeps TRUE; any positive number changes it to FALSE |

**Boolean selection, one contraction at a time:**

1. `TRUE a b` means `((λt.λf.t) a) b` because calls associate leftward.
2. Substitute a for t: `(λf.a) b` (choose fresh binder names if a contains free f).
3. The body does not use f, so the result is a. The unselected b need not be reduced under normal order.

**Addition, with the numeral applications made visible:**

1. Apply ADD to ONE and TWO: `λs.λz.TWO s (ONE s z)`.
2. Expand `ONE s z` to `s z`.
3. TWO applies s twice to that starting expression: `s (s (s z))`.
4. The complete result is `λs.λz.s (s (s z))`, the encoding of THREE.

These are equational simplifications to expose the meaning; a strict normal-order reducer may contract a different intermediate redex first and reach the same normal form. The count of s applications explains the answer without pretending that a Church numeral is a host integer.

```mermaid
flowchart LR
  accTitle: Chapter 9 - Church addition composes repetitions
  accDescr: One application of s transforms z into s z, then two further applications produce the encoding of three.
  Z["1. Start: z"] --> O["2. ONE s z: s z"]
  O --> T["3. TWO s uses that as its start: s (s (s z))"]
  T --> R["4. Abstract s and z: THREE"]
```

## 9.3 Understand one unfolding before using the recursive encoding

Source: [PDF pp. 289–292](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=289). Write `F = λself.λn.body` so the places formerly calling the recursive name now call self. Then use `Y F`, with `Y = λf.(λx.f (x x)) (λx.f (x x))`.

1. Substitute F for f. Define the abbreviation `G = λx.F (x x)`.
2. Then `Y F → G G`.
3. Contract that application: `G G → F (G G)`.
4. F receives `G G` as its self argument. A recursive occurrence can therefore perform another unfolding when needed.

For factorial at 1, one unfolding selects the recursive branch and requests factorial at 0; the next unfolding selects the base branch, yielding 1. The pending multiplication returns 1. Arithmetic and conditionals in this description abbreviate their encodings, rather than introducing extra lambda-calculus primitives.

The strategy is essential: an eager evaluator keeps trying to evaluate `G G` before supplying it to F and does not obtain this behavior from Y. Test the translator together with the requested normal-order reducer and the intended numeric decoder. Passing a few arithmetic examples does not check capture avoidance or recursion by itself.
