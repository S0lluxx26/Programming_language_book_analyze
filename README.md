# The Programming Languages Notebook

An illustrated, English-language study companion to Hakjoo Oh's **COSE212, Korea University, Fall 2026**. It connects the official definitions to OCaml representations, reasoning diagrams, worked traces, and every posted homework problem.

## Read

- Published book: <https://s0lluxx26.github.io/Programming_language_book_analyze/>
- Textbook reader: <https://s0lluxx26.github.io/Programming_language_book_analyze/textbook.html>
- Official course: <https://prl.korea.ac.kr/courses/cose212/2026/>
- Detailed implementation plan: [PLAN.md](PLAN.md)
- Verification notes: [VALIDATION.md](VALIDATION.md)

## Contents

- 15 concept chapters, covering lectures 1–20.
- A source-aligned reader following all 9 English textbook chapters and 48 numbered sections, plus the complete 12-problem §2.4 walkthrough.
- Worked solutions to the implementation tasks in Chapters 4–9, with five executable OCaml files and explicit assumptions where the draft leaves gaps.
- 4 assignment guides, including all 15 HW1 problems and constructor maps for HW2–HW4.
- 37 numbered thinking routes across the homework guides and textbook exercises, with links to all 18 official OCaml starter files.
- Mermaid flowcharts and relationship graphs, rendered to accessible static SVG; editable source is included beside each diagram.
- 42 definition entries with highlighted term links, in-place definition dialogs, and verified textbook/slide PDF page references.
- 58 reading pages and 106 Mermaid diagrams, with source code available under each graph.
- Interactive closure, store, exception, and type-inference traces; search; chapter navigation; responsive layout; print styles.
- A full source inventory with byte sizes, SHA-256 hashes, and PDF page counts.

## Lecture and syntax reading aids

- [Lecture cheat sheets 0–20](https://s0lluxx26.github.io/Programming_language_book_analyze/lectures.html): main ideas, formulas, syntax, numbered Mermaid routes, worked traces, homework links, and self-checks.
- [Syntax reference](https://s0lluxx26.github.io/Programming_language_book_analyze/syntax.html): 24 notation groups with definition and source-page links. Exact inline tokens throughout the book link here.
- All nine textbook chapters include expandable code with an explanation beside each line (stacked on phones). Seven complete examples are generated into `examples/reading_aids.ml`; two interpreter fragments explicitly identify their required helpers.
- Edit `book/lecture-guides.json`, `book/syntax-reference.json`, and `book/code-walkthroughs.json`. The build generates their reading pages and the complete example file. Do not edit the generated lecture Markdown directly.

## Floating syntax reference

Every reading page has a **Syntax beside you** panel. It follows the current section and explains matching notation, including code inside worked-solution disclosures. Search all 26 quick definitions, switch to All symbols, or click an inline syntax link to open its meaning without leaving the chapter. On smaller screens, use the floating button at the bottom right. The page contents remain available inside the panel.

Edit `book/notation-panel.json` for concise explanations and matching terms. Each entry links to its source-backed syntax reference.

## Course downloads

The source page linked 29 unique PDFs on 2026-09-20. **27 PDFs downloaded successfully**, including the English/Korean textbooks, lectures 0–20, and HW1–HW4. `slides/fixpoint.pdf` and `howtotryml.pdf` returned HTTP 404. The additional OCaml example link `code/let.ml` also returned 404. Broken links are recorded rather than replaced with unrelated versions.

Local originals live in `sources/pdfs/`; extracted research text lives in `sources/text/`. These files are ignored by Git. The published companion links to the instructor's original PDFs and publishes original explanatory material. Download the same archive after cloning:

```bash
python -m pip install -r requirements.txt
python scripts/download_sources.py
python scripts/check_sources.py
```

Rerunning the downloader refreshes source files and the manifest. Review changed course content before assuming existing companion explanations still match it.

## Build and preview

Requires Node.js 22 or newer, npm, and a Chromium browser for Mermaid rendering.

```bash
npm ci
npx playwright install chromium
npm run build
npm run check
npm run serve
```

Preview at <http://127.0.0.1:4173/>. On Windows the renderer defaults to installed Chrome; set `BOOK_BROWSER_CHANNEL=msedge` to use Edge. On CI it uses Playwright Chromium. For a local Playwright-managed Chromium, set `CI=1` for the build. The published book itself requires no Node server, CDN, or Mermaid runtime.

Author numbered reasoning steps in `book/thinking-routes.json`; the build inserts them into their matching sections and generates the associated HW1 Mermaid plans. Official starter provenance is recorded in `sources/professor-templates.json`.

Author chapters in `book/*.md` and navigation in `book/catalog.json`. Edit `book/definitions.json` and `scripts/references.mjs` for generated glossary/source pages. `npm run build` regenerates references, HTML, search data, Mermaid sources, and SVGs in `dist/`. Never use the partial `--preview` authoring mode for publication.

## OCaml examples

The official environment targets OCaml 4.14.1. Run the independent teaching examples:

```bash
ocaml examples/notebook_examples.ml
ocaml examples/textbook_exercises.ml
ocaml examples/textbook_functional.ml
ocaml examples/textbook_state.ml
ocaml examples/textbook_types.ml
ocaml examples/textbook_lambda.ml
```

They test recursion, lexical scope, a small evaluator, stores, type unification, and exception control flow. They do not implement or submit the full homework assignments. Some assignment policies are unstated in the public handouts; the corresponding guides identify them explicitly.

The `textbook_*.ml` files are original worked solutions to the **textbook tasks**, not the separately specified homework submissions. The type-system solution is monomorphic, including its Fun extension; let-polymorphism is explained separately. The lambda solution provides both the textbook's natural-number convention and a signed-pair extension. The GC solution collects only at global no-continuation points, as described in the book. These choices and their limits are explained in the reader.

## Publishing

The repository's `origin` uses GitHub SSH under `S0lluxx26`, matching the reference student-support project. The local Git configuration reuses that project's SSH identity; no private key is copied into this repository. Authentication configuration is local only.

Push to `main` to run `.github/workflows/pages.yml`. The workflow rebuilds diagrams, checks links and source-page references, runs the original examples with OCaml 4.14.1, and deploys `dist/` to GitHub Pages. Pages uses **GitHub Actions** as its source.

## Attribution and scope

Course textbooks, slides, homework specifications, and templates belong to their respective authors. This is an independent study companion, not an official course publication. Original source documents remain authoritative. Mermaid is used for graph rendering; markdown-it and highlight.js build the reading pages. No analytics, remote font services, or user accounts are required.
