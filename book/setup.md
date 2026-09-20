## Use the official workbench

The [course environment repository](https://github.com/kupl-courses/COSE212-2026fall) includes the homework templates and a VS Code Dev Container. At the source snapshot, its image is `ghcr.io/sambyeol/ocaml-devcontainer:4.14.1`. The container’s display name still mentions 2023; the repository and image configuration are the relevant references.

Follow its README to install Docker, Visual Studio Code, and the Dev Containers extension. Then:

```bash
git clone https://github.com/kupl-courses/COSE212-2026fall.git
cd COSE212-2026fall
code .
```

In VS Code, choose **Reopen in Container**. Open a new terminal in that container and run `ocaml -version`; the course image is configured for 4.14.1. The commands below run in that Linux container, including when VS Code itself runs on Windows. If `ocaml` is missing in PowerShell, first check that you opened the container terminal. At the downloaded snapshot, the course's TryML PDF link returned 404; use the official workbench instructions.

## Choose where to type each command

| Method | Command | What to expect |
|---|---|---|
| Interactive top level | `ocaml` | Enter expressions ending in `;;`; OCaml displays values and inferred types |
| Load a file in the top level | `#use "scratch.ml";;` | Evaluates definitions from the file in the current session |
| Run a source file from the shell | `ocaml scratch.ml` | Executes the file; only explicit printing appears |
| Compile a program | `ocamlc -o scratch scratch.ml` then `./scratch` | Creates and runs a program; print explicitly to see output |

Inside a `.ml` file, ordinary consecutive `let` definitions do not need `;;`. At the interactive prompt, `;;` finishes a phrase. Omit the displayed prompt `#`, but **keep the leading `#` in directives such as `#use` and `#quit`**. Directives belong in the REPL, not in a file you compile with `ocamlc`.

`ocaml scratch.ml` uses script mode; `ocaml < scratch.ml` feeds the interactive system and expects phrase terminators. Prefer the first command for the downloadable examples. These modes and directives are distinguished in the [OCaml 4.14 manual](https://ocaml.org/manual/4.14/toplevel.html).

```ocaml
let square x = x * x
let () = Printf.printf "%d\n" (square 6)
```

This original example prints `36`. A definition by itself does not print its value in a compiled program.

<details class="textbook-depth"><summary>Step by step · Your first successful run</summary>

1. Save the two lines above as `scratch.ml` in the folder open in the container.
2. In the container **shell**, run `ocaml scratch.ml`. Expect one line: `36`.
3. Run `ocamlc -i scratch.ml` to inspect the interface. It includes `val square : int -> int`.
4. Run `ocaml` to enter the **REPL**, then type `#use "scratch.ml";;`. This loads `square` and also executes the print statement again.
5. Enter `square 7;;`. Expect `- : int = 49`. Enter `#quit;;` to return to the shell.

If you edit the file, the existing REPL does not automatically reload it. Use `#use` again, or start a fresh REPL to avoid confusing old bindings with current code. `Cannot find file` means the filename or current directory does not match; it is not an OCaml type error.

</details>

## A productive scratch-file habit

Keep assignment templates separate from exploratory examples. HW1 reuses names such as `exp` and `btree` for incompatible types across problems. Combining every template into one top-level scope can produce misleading type errors or shadow earlier definitions. Work in separate files, or place experiments in separate modules.

```mermaid
flowchart TD
  accTitle: A step-by-step reasoning flow
  accDescr: Each arrow passes the result of one reasoning step to the next.
  N0["Predict<br/>Write the result and type before running."]
  N1["Trace<br/>Follow constructors, environments, or<br/>memory on paper."]
  N0 --> N1
  N2["Run<br/>Test one small expression in the official<br/>environment."]
  N1 --> N2
  N3["Explain<br/>If the result differs, identify the exact<br/>rule you misunderstood."]
  N2 --> N3
```

## Read the template before implementing

The expected filenames are `hw1/prime.ml`, `range.ml`, `suml.ml`, `drop.ml`, `maxmin.ml`, `sigma.ml`, `forall.ml`, `double.ml`, `mem.ml`, `mirror.ml`, `nat.ml`, `eval.ml`, `diff.ml`, `calculator.ml`, and `check.ml`; later assignments use `hw2/ml_minus.ml`, `hw3/b.ml`, and `hw4/typeof.ml`.

Keep the supplied public function names and types. Helpers can carry additional information: for example, a public `check : exp -> bool` can call a private helper that also accepts the set of currently bound names. An interface that starts with an empty environment does not mean recursive calls should forget the environment.

## Companion examples

Download [the original OCaml examples](examples/notebook_examples.ml) and run them with:

```bash
ocaml notebook_examples.ml
```

They demonstrate structural recursion, lexical closures, persistent store updates, and unification with assertions. They are separate teaching examples, not replacements for the assignment templates. The repository’s validation report lists the interpreter version used for testing.

For the new focused walkthroughs, download [supporting examples](examples/supporting_examples.ml) and run `ocaml supporting_examples.ml`. For chapter implementations, use the download beside the relevant [textbook section](textbook.html#chapter-by-chapter-reading-guide). Run files separately: similarly named AST constructors do not imply interchangeable languages. In particular, HW2's starter forbids modules, so textbook `List.*` and module examples are for learning, not direct submission code.

## A checklist for confusing errors

- **Type mismatch:** compare the inferred type with the expected type. Did you pass a pair to a curried function, or a list where an element is expected?
- **Unbound value:** check spelling, lexical scope, and whether a function calling itself was introduced with `let rec`.
- **Non-exhaustive match:** compare your branches to every constructor in the datatype, including empty structures.
- **Stack overflow:** check that each recursive call decreases an input. Then consider whether an accumulator makes a long traversal tail recursive.
- **Wrong interpreter result:** first distinguish the host language’s behavior from your object language’s rules. B assignment returns its assigned value; OCaml reference assignment returns `unit`.

**Read alongside:** [lecture 3](https://prl.korea.ac.kr/courses/cose212/2026/slides/lec3.pdf#page=7), [official setup README](https://github.com/kupl-courses/COSE212-2026fall/blob/main/README.md).
