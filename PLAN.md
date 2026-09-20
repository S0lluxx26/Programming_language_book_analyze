# COSE212 illustrated study book — execution plan

Source: <https://prl.korea.ac.kr/courses/cose212/2026/>.

## 1. Collect and verify the course sources
- Discover every distinct PDF linked on the course page, preserving the source directory structure in `sources/pdfs/`.
- Save a dated source-page snapshot and a manifest with URLs, byte counts, SHA-256 hashes, and PDF page counts.
- Download the linked OCaml example, inspect the official exercise repository, and extract PDF text locally for research.
- Check actual slide headings against the website labels; explicitly record discrepancies.

## 2. Design the learning sequence
- Follow the course's three parts: foundations; language features and interpreters; types and advanced concepts.
- For each chapter, connect a precise definition, a mental model, a flowchart, a worked trace, OCaml representation, common mistakes, and self-check questions.
- Map every published homework exercise to relevant definitions, source PDF pages, book chapters, a reasoning strategy, and useful boundary tests.
- Distinguish official specifications from companion explanations and original practice examples.

## 3. Build a readable book
- Create a static, responsive book with a persistent table of contents, full-text search, previous/next navigation, source links, and print styles.
- Use an ink-blue and white editorial design with readable mathematics, OCaml code, and accessible diagrams.
- Add interactive evaluation/type-inference traces where they make the reasoning easier to follow.
- Keep the source PDFs available locally; link to official originals in the public book and publish original companion text and examples.
- Include a glossary, notation reference, concept-to-homework matrix, environment guide, and a suggested study path.

## 4. Verify
- Check download completeness against the current course page, PDF signatures, parsing, hashes, and manifest integrity.
- Validate every generated page, internal link, diagram, source citation/page reference, and search index.
- Execute meaningful OCaml examples using the course's OCaml version when an interpreter is available; otherwise state the exact validation limitation.
- Review the book in a browser at desktop and mobile widths; test search, navigation, trace controls, and print layout.

## 5. Publish through the requested GitHub SSH setup
- Use the SSH identity and GitHub account from `Daughter_project_student_support/Project_web_student_support` without modifying that repository.
- Create a separate `Programming_language_book_analyze` repository under the same owner, commit the book sources and publishing setup, and push over SSH.
- Enable GitHub Pages, wait for successful deployment, and verify the public book URL.
- Document reproducible download, build, verification, and publication commands in `README.md`.

## Execution log
- 2026-09-20: Workspace is empty. Reference remote is `git@github.com:S0lluxx26/Project_web_student_support.git` and has a dedicated SSH identity.
- 2026-09-20: Course page is reachable directly; discovered 29 unique PDF links (the `lec11.pdf` link appears under two different labels).
- 2026-09-20: Downloaded and verified all 27 available PDFs (1,030 pages). Two PDF links and the linked OCaml example return 404; recorded these in the manifest.
- 2026-09-20: Authored all 24 reading pages, including 15 concept chapters, four homework guides, and the full problem map.
- 2026-09-20: Incorporated the user's follow-up: replaced card/row diagrams with 30 Mermaid graphs and linked 38 definitions to verified textbook/slide pages (155 first-use links).
- 2026-09-20: Build, Mermaid rendering, local links, anchors, metadata, homework coverage, and PDF page-bound checks pass. Browser QA and publication are in progress.
- 2026-09-20: Browser QA completed for desktop/mobile layouts, definition links, search, and all four traces. Expanded the final set to 34 Mermaid graphs, including sharing, inheritance, subtyping, and a typing derivation.
- 2026-09-20: Created `S0lluxx26/Programming_language_book_analyze`, pushed through the reference SSH identity, and enabled GitHub Pages. CI builds, OCaml 4.14.1 examples, and Pages deployments succeeded. Automatic verification and publication run on subsequent pushes to main.
- 2026-09-20: Final navigation review confirmed a direct concept-map link lands on HW1 P15. Graph dimensions are reserved to prevent image-loading shifts; the mobile contents menu hides offscreen links from keyboard navigation.

## Result

The source collection, original study book, definition references, homework maps, Mermaid diagrams, validation, SSH repository, and GitHub Pages configuration are complete. The only unavailable requested source files are the two original PDF URLs returning 404, explicitly listed in the manifest and book. No replacement is misrepresented as a downloaded 2026 original.

## Textbook reader and worked-problem expansion

User follow-up: follow the PDF's actual chapters and sections, highlight/link definitions, and solve the textbook's own problems using Mermaid thinking flows.

1. **Inventory:** inspect all 292 pages through the extracted text, confirm the table of contents, and visually check ambiguous pages. Record all 48 numbered sections, 12 exercises in §2.4, and implementation tasks in Chapters 4–9. Do not mistake hidden figure text for a visible extra exercise.
2. **Reading structure:** add a complete textbook contents page and nine chapter pages in source order. Keep original section numbers, exact PDF-page links, contextual definitions, worked traces, and chapter transitions. Retain the existing concept chapters and separate homework atlas.
3. **Problem solutions:** explain every §2.4 exercise, all five subparts of Problem 10 in both fold directions, both scope variants, Fun, both state models, the four memory/GC tasks, type equations and the Fun extension, and lambda reduction/translation. Supply reproducible OCaml files.
4. **Reading interaction:** show a definition in place when clicked, with its source page, full glossary entry, and worked explanation. Preserve normal links without JavaScript and with modifier clicks. Make worked solutions expandable.
5. **Verification:** enforce chapter/section/problem coverage and all internal anchors, render every Mermaid graph, execute all OCaml solutions in the course's 4.14.1 environment, and review desktop/mobile reading, definition dialogs, and solution disclosures.
6. **Publication:** push through the existing SSH configuration, wait for successful CI and Pages deployment, and verify the public reader.

Implementation complete: 11 new reading pages, 37 new diagrams, five executable solution files, and four additional definition entries. The 35-page build and 2,819 link checks pass. Desktop/mobile reading, definition dialogs, solution disclosures, and search have been reviewed. The first expansion deployment passed 183 OCaml checks on 4.14.1; final review added two dynamic-scope regression checks. Every subsequent publication is gated on the complete solution suite. The public reader is at `/textbook.html`.
