# Verification record

Source snapshot: 20 September 2026.

## Automated checks completed locally

- All 30 links discovered on the source page are accounted for: 29 unique PDFs and one OCaml file.
- 27 PDFs downloaded, totaling 1,030 PDF pages. File signatures, byte lengths, SHA-256 checksums, and page counts verified by `scripts/check_sources.py`.
- Two PDF links and the OCaml example link return HTTP 404; the manifest and source library report them.
- All 24 reading pages build successfully.
- All 30 Mermaid definitions render successfully to accessible SVG.
- Static checks cover 1,545 local/external link references, local target existence and anchors, 129 PDF page references within verified source page counts, unique HTML IDs, page metadata, and all 15 HW1 problem sections.
- 38 glossary definitions and 155 first-use definition links connect explanations to exact textbook or lecture PDF pages.

## Content verification

- Inspected the full four homework handouts, slide headings and relevant semantic/typing rules, and English textbook definition passages.
- Visually inspected rendered PDF pages for HW2 recursive rules and lecture 18's polymorphic rules to distinguish real source omissions from text extraction errors.
- Source discrepancies and underspecified homework policies are explicitly documented, particularly HW2's even/odd example and HW4's soundness/equality/polymorphism questions.
- Source citations refer to PDF page positions, including lecture 8's 39-page file despite its older footer numbering.

## Browser and runtime verification

Browser review and publication checks are recorded here as they complete. The publishing workflow must successfully run the OCaml examples using OCaml 4.14.1 before it deploys the book.
