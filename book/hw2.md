## The contract

**Official starter:** [`hw2/ml_minus.ml`](https://github.com/kupl-courses/COSE212-2026fall/blob/b0c917f0e648907ef0460522ff8f3e686b64d2fb/hw2/ml_minus.ml). The file supplies syntax, values, environments, printing, sample programs, and the `runml` wrapper. Its evaluator still has TODO cases, so it is a starting point rather than an official solution.

**Template constraint:** the first comment says “Do not use any module.” Use the supplied standalone `fold_left` and `map`, or your own recursive helpers; do not paste `List.*` calls or module-based helpers from the independent textbook examples into this assignment. Keep `eval : exp -> env -> value` in the template's argument order. Its lookup helper currently raises `Failure` for an unbound name; adapt relevant failures to the handout's `UndefinedSemantics` contract when implementing the missing behavior.

Implement `runml : program -> value` for the ML− language in the [official handout](https://prl.korea.ac.kr/courses/cose212/2026/hw/hw2.pdf). Raise `UndefinedSemantics` whenever no dynamic rule applies. The official AST and value constructors appear on PDF pp. 4–5; the semantic rules are on pp. 2–4.

The supplied public entry point already starts `eval` under `empty_env`. Follow its actual order, `eval expression environment`. The interface’s simplicity does not remove the need for environments internally.

## Build in layers

```mermaid
flowchart TD
  accTitle: A staged plan for the ML-minus interpreter
  accDescr: Each implementation layer depends on the previous one and should be tested before adding more constructors.
  A["1. Preserve the supplied interface"] --> B["2. Tagged values and lookup"]
  B --> C["3. Scalar and list rules"]
  C --> D["4. IF and LET"]
  D --> E["5. Closures and recursion"]
  E --> F["6. Effect order and undefined cases"]
  F --> G["7. Run official examples and distinguishing tests"]
```

Do not postpone all error cases until the end: each layer should reject wrong value shapes as soon as its rule requires a particular shape.

## Map every constructor family

| Constructors | Reasoning rule | Boundary or negative test |
|---|---|---|
| `UNIT`, `TRUE`, `FALSE`, `CONST` | Return the matching tagged value | A literal does not inspect the environment |
| `VAR` | Find the nearest binding | An unbound name raises `UndefinedSemantics` |
| `ADD`, `SUB`, `MUL`, `DIV` | Evaluate operands and require integers | A Boolean operand is invalid; divisor zero is invalid |
| `EQUAL` | Compare two integers or two booleans | Unit, lists, functions, and mixed pairs have no rule |
| `LESS` | Require two integers; return Bool | Boolean comparison is invalid |
| `NOT` | Require a Boolean | An integer operand is invalid |
| `NIL` | Return the empty language list | Distinguish the list value from Unit |
| `CONS` | Head may be any value; tail must be a list | A scalar tail is invalid |
| `APPEND` | Both operands must be list values | A scalar operand is invalid |
| `HEAD`, `TAIL` | Require a nonempty list | Empty list and non-list operands are invalid |
| `ISNIL` | Require a list and test emptiness | A non-list operand is invalid |
| `IF` | Require Bool; evaluate only the chosen branch | A failing unchosen branch is not executed |
| `LET` | Evaluate definition, extend for body | Definition sees the old environment |
| `PROC`, `CALL` | Create a closure; apply it lexically | Caller shadowing must not change captured names |
| `LETREC`, `LETMREC` | Store recursive definitions; restore self/peer bindings on calls | A peer function must be reachable recursively |
| `PRINT`, `SEQ` | Perform effects in the specified order | Print returns Unit; sequence returns its second value |

ML−’s dynamic list domain allows sequences of arbitrary values. A homogeneous static list type in HW4 can conservatively reject heterogeneous lists; do not accidentally impose a type-checker restriction inside the HW2 evaluator unless its dynamic rules require it.

## Closures and recursion

The three procedure value forms are not interchangeable. For `Procedure`, save parameter, body, and creation environment. For `RecProcedure`, also save the function’s name. For `MRecProcedure`, save both definitions and their shared creation environment.

At a call, evaluate the function expression and argument in the caller. Then branch on the procedure value form and construct the body environment from the saved lexical environment. Reintroduce all recursive names required by that form, then the appropriate argument binding according to the rule’s binding convention.

```mermaid
flowchart TD
  accTitle: Choosing the environment for a procedure call
  accDescr: A call evaluates its operands in the caller, then evaluates the body using the closure's saved context plus recursive and parameter bindings.
  A["1. Evaluate function in caller"] --> A2["2. Evaluate argument in caller"]
  A2 --> B{"3. Select the procedure's saved environment"}
  B -->|"ordinary"| C["4. No recursive binding needed"]
  B -->|"recursive"| D["4. Restore self binding"]
  B -->|"mutually recursive"| E["4. Restore both procedure bindings"]
  B -->|"not a procedure"| X["UndefinedSemantics"]
  C --> F["5. Bind parameter; evaluate stored body"]
  D --> F
  E --> F
```

Avoid assuming that a host OCaml `let rec` automatically gives object-language names their meaning. The object-language recursion lives in your value representation and environment construction.

## Make evaluation order visible

OCaml does not promise the left-to-right argument evaluation order that you might assume from another language. Use sequential `let` bindings to express required ordering. For example, evaluate the first sequence expression, discard only its value, and then evaluate the second. Printing makes an otherwise invisible ordering mistake observable.

The handout’s print inference rule omits the operand-evaluation premise, but the prose says to print the operand’s value. Handle this as a schematic rule, not a request to skip evaluation. The official starter already implements PRINT with `string_of_value` and supplies that formatter; retain its formatting rather than substituting the independent textbook solution's printer unless the instructor directs otherwise.

## Tests that distinguish wrong models

| Test idea | What it diagnoses |
|---|---|
| Create f with x = 10; shadow x with 90; call f | Capturing the definition environment |
| Pass the caller’s shadowed x as an argument to f | Evaluating the argument in the caller |
| A recursive function reaching a base case | Reintroducing the self-binding |
| Alternating calls between two procedures | Reintroducing both peer bindings |
| `IF(TRUE, CONST 7, DIV(CONST 1, CONST 0))` | Evaluating only the selected branch |
| `EQUAL(NIL, NIL)` | Respecting ML− equality restrictions |
| Head of an empty list | Converting partial-operation failure to the required exception |
| Two prints in a sequence | Preserving effect order and Unit results |

The first official example should produce `Int 5`; the recursive doubling example `Int 12`; the AST in the mutual-recursion example `Bool true`; the reversal example a reversed list. These are useful regression checks after each refactor, but do not substitute for constructor coverage.

## A source discrepancy worth resolving on paper

On HW2 PDF p. 6, the prose says `even 13`, but the supplied AST calls `odd 13` and expects true. Those are different programs. Follow the AST when verifying the stated expected result: odd(13) is true, even(13) is false. On p. 3, the mutual-call rule’s concluding result is missing from the printed formula; the body premise supplies the intended result.

## When you are ready for HW3

Explain precisely why `eval` currently returns only a value and what must change when a subexpression mutates memory. The answer leads to [the store-threading interface](07-state.html) and [HW3](hw3.html).

**Prerequisites:** [expressions](04-expressions.html), [closures](05-closures.html), [recursive scope](06-scope-recursion.html). **Source:** [HW2 pp. 2–5](https://prl.korea.ac.kr/courses/cose212/2026/hw/hw2.pdf#page=2).
