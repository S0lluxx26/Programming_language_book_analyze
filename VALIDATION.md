# Verification record

Source snapshot: 20 September 2026.

## Automated checks completed locally

- All 30 links discovered on the source page are accounted for: 29 unique PDFs and one OCaml file.
- 27 PDFs downloaded, totaling 1,030 PDF pages. File signatures, byte lengths, SHA-256 checksums, and page counts verified by `scripts/check_sources.py`.
- Two PDF links and the OCaml example link return HTTP 404; the manifest and source library report them.
- All 58 reading pages build successfully, including the source-aligned textbook reader.
- All 106 Mermaid definitions render successfully to accessible, independently parseable SVG with explicit intrinsic dimensions.
- Static checks cover 6,269 local/external link references, local target existence and anchors, 424 PDF page references within verified source page counts, unique HTML IDs, page metadata, and all 15 HW1 problem sections.
- 42 glossary definitions and 310 automatically generated definition links connect explanations to exact textbook or lecture PDF pages. Manually authored definition links also open the reading panel.
- `book/textbook-structure.json` records all 9 textbook chapters, 48 numbered sections, and 12 §2.4 problems. Checks require every section heading/source page and every numbered problem's Mermaid graph and worked solution.

## Content verification

- Inspected the full four homework handouts, slide headings and relevant semantic/typing rules, and English textbook definition passages.
- Visually inspected rendered PDF pages for HW2 recursive rules and lecture 18's polymorphic rules to distinguish real source omissions from text extraction errors.
- Source discrepancies and underspecified homework policies are explicitly documented, particularly HW2's even/odd example and HW4's soundness/equality/polymorphism questions.
- Source citations refer to PDF page positions, including lecture 8's 39-page file despite its older footer numbering.
- Inspected the English textbook contents, exercise set, and chapter implementation specifications. Visually checked pp. 127, 220, 276, and 292. Hidden text near Figure 4.2 mentions an exercise that is not visibly present; the reader correctly treats the visible material as a scope example.
- Explained the Chapter 7 evaluator-signature discrepancy, homogeneous-list/scalar-equality policy in the monomorphic Fun checker, and the natural-number/normal-order limits of the textbook's lambda encoding. An optional signed-number translation is separately identified.

## Browser and runtime verification

- Reviewed desktop and 390-pixel mobile reading layouts. Mobile document width remains within the viewport; tables use contained horizontal scrolling.
- Verified Mermaid images load, including the closure flowchart and class diagram. Fixed SVG serialization and intrinsic sizing discovered during the review.
- Tested search results, mobile contents controls, closure definition navigation, and the textbook page-link targets.
- Exercised all four interactive traces to their final states; closure reset returns to step one. Verified results: closure 13, store 6, exception 11, inference `(int → γ) → int → γ`.
- Fixed sidebar scrolling so it no longer overrides chapter-fragment navigation. Reserved diagram dimensions prevent image loading from shifting deep links; visually verified the concept-map link lands at HW1 P15. Search excerpts exclude Mermaid source syntax and decode HTML entities.
- Browser console inspection found no warnings or errors on the reviewed pages.
- Print stylesheet is included; native print-dialog output has not been visually reviewed.
- GitHub Actions successfully ran 25 companion checks plus one exception-control-flow check with compiler 4.14.1 and deployed the book. Publication is gated on a successful build, static validation, and these OCaml checks.

## Textbook reader verification

- Reviewed the section-numbered chapter layout, reading toolbar, source links, and expandable problem solutions on desktop.
- Opened and closed the Closure definition panel without leaving the chapter. Verified its exact PDF-page link and full-glossary fallback.
- At 390 × 844, verified chapter navigation, Beta reduction and Capture-avoiding substitution dialogs, keyboard activation, and no document-level horizontal overflow (document width 375 px). Diagrams retain a readable minimum width and scroll inside their own container.
- Verified the §2.4 solution disclosure reveals highlighted OCaml code; all twelve problem diagrams loaded successfully. Searching “Peano” returns the textbook exercise page and related concept/homework pages.
- CI run 35493232185 successfully executed all five original textbook solution files on OCaml 4.14.1: 114 exercise checks, 16 functional-language checks, 18 state/GC checks, 19 type-system checks, and 16 lambda checks (183 total).
- Final review added two regression checks distinguishing static self-binding from a caller-rebound recursive name under dynamic scope. The suite now has 185 checks; the publishing workflow reruns all five files and blocks deployment on any failure.
- Temporary mobile viewport settings were reset after review. New solution links offer direct `.ml` downloads.

## Official starter alignment and numbered reasoning

- Reviewed all 18 OCaml starter files at professor repository commit b0c917f0e648907ef0460522ff8f3e686b64d2fb. These contain TODOs, not official completed solutions; pinned links and SHA-256 hashes are recorded in the source manifest.
- Added 37 numbered thinking routes: 15 HW1 problems, 10 major HW2–HW4 reasoning sections, and all 12 textbook section 2.4 exercises. Automated checks enforce route coverage, rendered step titles, and pinned starter links.
- Corrected HW2 argument order and no-module guidance, HW3 namespace lookup behavior, and documented template/handout differences without treating starter TODOs as specifications.
- Reviewed the tree-membership panel on desktop and numbered panels at 390-pixel mobile width. All 15 HW1 panels and all diagram images loaded; document width remained 375 pixels with no page overflow.

## Lecture cheat sheets and syntax aids

- Reviewed the downloaded text and slide-page outlines for lectures 0–20, and rechecked constraint generation, generalization, and override rules. Visually rechecked the lecture 18 typing-rule slide; its existing parameter-symbol discrepancy remains documented.
- Added 21 original lecture summaries with source-page links, textbook connections, focus points, a formula, syntax links, a numbered Mermaid route, a worked trace, homework scope, and a revealable self-check. Topics not assigned in HW1–HW4 are explicitly identified as extensions.
- Added 23 syntax-reference entries and nine paired code walkthroughs. All complete examples are generated from the displayed code and executed by CI; evaluator/inference fragments are labeled as requiring surrounding helpers.
- Static checks enforce lecture numbering, required sheet sections, graphs, source-page bounds, all syntax anchors, and a matching explanation for every code line.
- Reviewed desktop paired-column code and 390-pixel mobile stacked code with no document overflow. Tested navigation from Chapter 6 syntax to the store reference and its in-place definition dialog. Verified the lecture 18 mobile sheet and loaded Mermaid image.

## Floating section syntax panel

- Added 26 concise reference cards to all 58 reading pages, with section tracking, full-library search, expandable examples, source links, and inline-token activation. Added a fold entry to the full syntax reference (24 groups total).
- Verified the Chapter 2 problem page follows the active section, distinguishes cons from append, and opens fold_right in place without navigation. Search for ↦ returns its mapping explanation.
- Reviewed the sticky desktop rail with no overlap of article text, and the collapsed/open panel at 390-pixel mobile width with no document overflow. Hidden panel controls are removed from keyboard navigation through the native hidden attribute.
- Static validation checks all quick-reference IDs, required user examples, and source targets. Single-letter uppercase notation is matched case-sensitively so a range bound m does not trigger memory M.

## Section clarity review

- Inventoried 493 H2–H4 headings across 58 reading pages, recording before/after structural evidence and a recommendation for each. This screening is distinguished from editorial judgment in reports/CONTENT_REVIEW.md.
- Added 48 individually authored prediction checkpoints covering every numbered textbook section, with collapsed reasoning, a common trap, and a prerequisite link. Automated validation enforces exact section coverage and rendered uniqueness.
- Added nine chapter transitions and focused comparisons for lexical scope, reference models, and type analysis, plus a complete inference trace. Corrected study-route numbering and the conservative-GC description.
- Verified Chapter 8 disclosure by mouse and keyboard, desktop layout, and mobile layout at 390 × 844. Document width and scroll width were both 375 px.

## Dark mode

- Added a keyboard-accessible theme toggle to every page. Initial appearance follows the system preference; explicit choices persist across reloads and chapter navigation, with cross-tab synchronization and storage-error fallback.
- Reviewed dark typography, reference rail, Mermaid diagrams and source code, and the mobile toolbar. Verified light-mode reload persistence and dark-mode navigation persistence using keyboard and mouse. Mobile document width remains 375 px at a 390 × 844 viewport; no console warnings/errors were reported.
- Theme colors are screen-only, preserving the existing light print stylesheet and unmodified downloadable SVGs.
- Build and static validation passed for all 58 pages, 106 diagrams, and 6,457 links.

## Textbook chapter cheat sheets

- Added nine concise chapter summaries with definitions, main meaning, a key rule, a worked micro-example, four solving steps, and a common trap. Existing glossary linking and the section-aware syntax rail also apply to these summaries.
- Added direct links from the textbook contents. Static validation enforces all nine chapter sheets and required content, and checks their source and navigation links.
- Reviewed Chapter 4 on desktop and at 390 × 844 in dark mode; document width and scroll width both measured 375 px.

## Integrated lecture/textbook reading

- Consolidated 21 lecture summaries into selected highlights and expandable practice at matching textbook sections. Four topics are explicitly marked as lecture extensions. Chapter 5 links to the relevant earlier practice instead of duplicating it.
- Removed 22 separate lecture entries from the catalog, sidebar, pagination, and search. All 22 old URLs redirect to the map or a precise integrated lecture anchor; internal links use the destinations directly.
- Added chapter reading routes, collapsible lecture indexes, and the complete lecture-to-chapter map. Relabeled supporting guides as Extra explanations and the workbench as OCaml setup. Decisions are documented in LECTURE_MERGE_REVIEW.md.
- Checked the Lecture 2 redirect, nested answer, and keyboard disclosure. Checked Chapter 8 index-to-extension navigation and retained homework-scope caveats. Reviewed dark desktop and light mobile layouts; at 390 × 844, content width and scroll width both measured 375 px.
- Static validation covers 36 canonical pages, 21 integrated destinations, 22 redirects, 106 diagrams, 9 cheat sheets, and 48 checkpoints. Existing OCaml checks remain in the deployment workflow.

## Collapsible chapter cheat sheets

- All nine chapter cheat sheets are native details disclosures, closed on ordinary chapter visits. The entire labeled heading is clickable and keyboard operable.
- Direct cheat-sheet links reveal the content, including initial fragment navigation and repeated clicks. The syntax panel continues to recognize the cheat-sheet section. Printing temporarily opens the sheet and restores its previous state afterward; print-dialog output was not visually reviewed in this change.
- Verified closed default, mouse expansion, Enter-key collapse, link activation, fragment reload, and dark mobile presentation. At 390 × 844, document and scroll widths both measured 375 px.
