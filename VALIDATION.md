# Verification record

Source snapshot: 20 September 2026.

## Automated checks completed locally

- All 30 links discovered on the source page are accounted for: 29 unique PDFs and one OCaml file.
- 27 PDFs downloaded, totaling 1,030 PDF pages. File signatures, byte lengths, SHA-256 checksums, and page counts verified by `scripts/check_sources.py`.
- Two PDF links and the OCaml example link return HTTP 404; the manifest and source library report them.
- All 24 reading pages build successfully.
- All 34 Mermaid definitions render successfully to accessible, independently parseable SVG with explicit intrinsic dimensions.
- Static checks cover 1,557 local/external link references, local target existence and anchors, 129 PDF page references within verified source page counts, unique HTML IDs, page metadata, and all 15 HW1 problem sections.
- 38 glossary definitions and 155 first-use definition links connect explanations to exact textbook or lecture PDF pages.

## Content verification

- Inspected the full four homework handouts, slide headings and relevant semantic/typing rules, and English textbook definition passages.
- Visually inspected rendered PDF pages for HW2 recursive rules and lecture 18's polymorphic rules to distinguish real source omissions from text extraction errors.
- Source discrepancies and underspecified homework policies are explicitly documented, particularly HW2's even/odd example and HW4's soundness/equality/polymorphism questions.
- Source citations refer to PDF page positions, including lecture 8's 39-page file despite its older footer numbering.

## Browser and runtime verification

- Reviewed desktop and 390-pixel mobile reading layouts. Mobile document width remains within the viewport; tables use contained horizontal scrolling.
- Verified Mermaid images load, including the closure flowchart and class diagram. Fixed SVG serialization and intrinsic sizing discovered during the review.
- Tested search results, mobile contents controls, closure definition navigation, and the textbook page-link targets.
- Exercised all four interactive traces to their final states; closure reset returns to step one. Verified results: closure 13, store 6, exception 11, inference `(int → γ) → int → γ`.
- Fixed sidebar scrolling so it no longer overrides chapter-fragment navigation. Search excerpts exclude Mermaid source syntax and decode HTML entities.
- Browser console inspection found no warnings or errors on the reviewed pages.
- Print stylesheet is included; native print-dialog output has not been visually reviewed.
- GitHub Actions successfully ran the OCaml teaching examples with compiler 4.14.1 and deployed the initial book. Final layout fixes and expanded graphs are included in the subsequent publication update.
