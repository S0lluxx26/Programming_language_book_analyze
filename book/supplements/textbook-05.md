## 5.1 Connect surface syntax, AST constructors, and runtime values

Source: [PDF pp. 147–150](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=147). The interpreter is an OCaml program that processes a different language, Fun. Its uppercase AST constructors are data, not OCaml functions that automatically execute the represented operation.

| Layer | Example | What it says |
|---|---|---|
| Surface Fun expression | `head (1 :: [])` | A programmer requests the first element |
| AST supplied to the evaluator | `HEAD (CONS (CONST 1, NIL))` | A head node containing a cons node and its children |
| Intermediate runtime list | `List [Int 1]` | The result of evaluating the cons node |
| Final runtime value | `Int 1` | The result of applying the head rule |

1. Inspect `HEAD`; it needs its operand evaluated first.
2. Inspect `CONS`; evaluate `CONST 1` and `NIL` in order.
3. Check that the second result is a list, then form `List [Int 1]`.
4. Check that the list is nonempty, then return its first value.

`UNIT` evaluates to `Unit`, while `NIL` evaluates to `List []`. Both are legitimate results with different shapes. `HEAD NIL` fails; `ISNIL NIL` returns true. Making that distinction explicit is more useful than memorizing constructor names alone.

## 5.2 Give every operation a precise value contract

Source: [PDF pp. 150–155](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=150), especially [the list-equality rules and qualification on p. 152](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=152).

| Operation | Required input | Result / boundary |
|---|---|---|
| `CONS` | A value and a list | A list with the value prepended |
| `APPEND` | Two lists | All elements of the first followed by the second |
| `HEAD`, `TAIL` | A nonempty list | First value / remaining list; empty input fails |
| `NOT` | A boolean | Its opposite |
| `EQUAL` | Two integers, two booleans, or two comparable lists | A boolean; function comparison is excluded |
| `PRINT` | An evaluated value | Emits output, then returns Unit |
| `SEQ` | Two expressions evaluated in order | Discards the first result and returns the second |

**Equality in the PDF includes lists.** Two lists compare equal when their lengths agree and all corresponding elements compare equal. The rule is broader than scalar-only equality in some of the course's other languages; check which language a problem specifies.

The PDF leaves the treatment of nested list elements open. The worked evaluator makes its policy explicit: recursively compare integer, boolean, and list values; reject Unit and procedures anywhere in either operand. Top-level operands must be from the same family. Inside lists, different allowed shapes compare unequal. This is a documented completion of the underspecified case, not an additional rule quoted from the PDF.

```mermaid
flowchart TD
  accTitle: Chapter 5 - compare lists under the worked evaluator policy
  accDescr: Validate comparable values first, then compare list lengths and corresponding elements recursively without ever comparing closures.
  A["1. Evaluate both operands"] --> B{"2. Any Unit or procedure, even nested?"}
  B -->|Yes| X["Reject unsupported equality"]
  B -->|No| C{"3. Same top-level family?"}
  C -->|No| X
  C -->|Yes, lists| D{"4. Same length and all paired elements equal?"}
  C -->|Yes, scalars| S["Compare integer or boolean values"]
  D -->|Yes| T["true"]
  D -->|No| F["false"]
```

For `[[1];[2;3]] = [[1];[2;4]]`, the first pair of inner lists is equal; the second pair reaches 3 versus 4, so the result is false. `[] = []` is true. A list containing a procedure is rejected even if an earlier unequal element could have short-circuited the comparison. Validation makes this error policy predictable.

**Checker boundary:** [the Chapter 8 downloadable checker](textbook-08.html#8-8-implementation) still implements a deliberately narrower scalar-equality restriction. It can reject a list comparison that this evaluator runs successfully. Do not treat its rejection as the PDF's definition of equality.

## 5.3 Build both bindings when calling a mutually recursive closure

The rule on [PDF p. 155](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=155) and datatype on [p. 157](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=157) carry seven components. Reading them as a record of two definitions is easier than memorizing a long tuple.

Let even and odd share outer environment ρ₀. The body of even returns true at 0 and otherwise calls odd with n−1; odd returns false at 0 and otherwise calls even with n−1.

| Component of even's closure | What it preserves |
|---|---|
| `even, n, even_body` | The selected function's name, parameter, and body |
| `odd, n, odd_body` | Its partner's name, parameter, and body |
| `ρ₀` | Their shared definition environment |

1. Create closure C_even using that order. Create C_odd with the two definition triples swapped, retaining ρ₀.
2. Bind **both names** in the surrounding letrec body.
3. To call even 2, start from ρ₀, install even→C_even and odd→C_odd, then install the parameter n→2.
4. The body calls odd 1. The argument is evaluated in the current call's environment; odd's body uses ρ₀ extended with both closures and its own n→1.
5. That body calls even 0, whose body environment has n→0 and both closures again. It returns true, which becomes the result of the waiting calls.

```mermaid
flowchart TD
  accTitle: Chapter 5 - mutual calls preserve both recursive bindings
  accDescr: Each call extends the shared saved environment with both function closures and a fresh parameter binding; the decreasing argument reaches even zero.
  A["1. Save common outer environment rho0"] --> B["2. Bind even=C_even and odd=C_odd"]
  B --> C["3. even 2: both closures, n=2"]
  C --> D["4. odd 1: both closures, n=1"]
  D --> E["5. even 0: both closures, n=0"]
  E --> F["6. Base case returns true"]
```

The callee's parameter binding replaces the previous call's argument for that body; it does not alter the saved ρ₀. Keeping only the current function's self-binding would make the first partner call unbound. Copying the partner without swapping which triple is selected would execute the wrong body. Match this table to `MRecProcedure` in the [complete evaluator](examples/textbook_functional.ml).
