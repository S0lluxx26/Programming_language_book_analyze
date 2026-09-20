## Choose your lecture

Each sheet connects the lecture’s big picture, focus points, notation, numbered problem-solving route, worked trace, textbook reading, and homework. These are original revision notes, not replacements for the slides. Use **Print chapter** for a compact reference; a long lecture may need more than one printed page.

[Open the syntax reference](syntax.html) · [Read the textbook](textbook.html) · [Homework map](homework-map.html)

| Lecture | Focus | Textbook connection |
|---|---|---|
| [0 · Course overview](lecture-00.html) | Learn language concepts by defining a small language and implementing its interpreter. OCaml is the implementation tool; the interpreted language is a separate object of study. | [Chapter 1](textbook-01.html) |
| [1 · Inductive definitions I](lecture-01.html) | Define an infinite set using finite base and construction rules, with no extra elements. | [Chapter 1](textbook-01.html) |
| [2 · Inductive definitions II](lecture-02.html) | The shape of a datatype determines the cases of its recursive functions and structural proofs. | [Chapter 1](textbook-01.html) |
| [3 · Basics of OCaml](lecture-03.html) | Read OCaml as expressions built from bindings, functions, patterns, and typed values. | [Chapter 2](textbook-02.html) |
| [4 · Recursion and higher-order programming](lecture-04.html) | Solve a smaller instance, then combine its result; abstract repeated traversal with functions. | [Chapter 2](textbook-02.html) |
| [5 · Expressions and environments](lecture-05.html) | Translate each evaluation rule into a matching AST case and keep the environment explicit. | [Chapter 3](textbook-03.html) |
| [6 · Procedures and recursive closures](lecture-06.html) | A lexical procedure carries the environment where it was defined; a call extends that saved environment. | [Chapter 4](textbook-04.html) |
| [7 · Lexical addresses and nameless programs](lecture-07.html) | Resolve a variable to its binder statically and replace names with positions. | [Chapter 4](textbook-04.html) |
| [8 · State and parameter passing](lecture-08.html) | Separate the binding map from mutable memory and carry the updated store through every evaluation step. | [Chapter 6](textbook-06.html) |
| [9 · Records, pointers, and garbage collection](lecture-09.html) | Follow locations through structured values and distinguish unreachable memory from memory that merely looks unused. | [Chapter 7](textbook-07.html) |
| [10 · Exceptions and continuations](lecture-10.html) | Make pending computation explicit so a raised exception can discard frames up to the nearest handler. | Dedicated slide topic |
| [11 · Classes and objects](lecture-11.html) | An object combines mutable field locations with a class identity used for method lookup. | Dedicated slide topic |
| [12 · Why static types?](lecture-12.html) | Use a computable static approximation to prevent a specified class of runtime type errors. | [Chapter 8](textbook-08.html) |
| [13 · Designing typing rules](lecture-13.html) | Build typing derivations using a type environment instead of executing the program. | [Chapter 8](textbook-08.html) |
| [14 · Manual type annotations](lecture-14.html) | Explicit procedure annotations make syntax-directed checking possible without guessing parameter types. | [Chapter 8](textbook-08.html) |
| [15 · Type inference I: the idea](lecture-15.html) | Infer unknown types from how expressions are used, by turning typing rules into equations. | [Chapter 8](textbook-08.html) |
| [16 · Type inference II: constraint generation](lecture-16.html) | Define V(Γ,e,t) to generate the equalities required for expression e to have target type t. | [Chapter 8](textbook-08.html) |
| [17 · Type inference III: unification](lecture-17.html) | Solve type equations by substitution, decomposition, mismatch rejection, and the occurs check. | [Chapter 8](textbook-08.html) |
| [18 · Let-polymorphism](lecture-18.html) | Generalize independent type variables at let bindings and instantiate them freshly at each use. | [Chapter 8](textbook-08.html) |
| [19 · Typed objects and subtyping](lecture-19.html) | Check class programs using safe substitutability, with contravariant method inputs and covariant outputs. | Dedicated slide topic |
| [20 · Lambda calculus](lecture-20.html) | Understand functions and application as a small core, then make binding and reduction strategy precise. | [Chapter 9](textbook-09.html) |
