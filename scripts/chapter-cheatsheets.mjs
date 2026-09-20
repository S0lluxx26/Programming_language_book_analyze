import fs from 'node:fs';
export const chapterSheets = JSON.parse(fs.readFileSync('book/chapter-cheatsheets.json', 'utf8'));
const definitions = JSON.parse(fs.readFileSync('book/definitions.json', 'utf8'));
const structure = JSON.parse(fs.readFileSync('book/textbook-structure.json', 'utf8'));
export function chapterCheatSheet(chapter) {
  const sheet = chapterSheets.find(s => s.chapter === chapter);
  if (!sheet) throw Error('Missing chapter cheat sheet: ' + chapter);
  const page = structure.sections.find(s => s.section.startsWith(chapter + '.')).page;
  const terms = sheet.terms.map(([term, meaning]) => {
    const definition = definitions.find(d => d.term.toLowerCase() === term.toLowerCase());
    return '| ' + (definition ? '[' + term + '](glossary.html#' + definition.id + ')' : term) + ' | ' + meaning + ' |';
  }).join('\n');
  return '\n## Chapter cheat sheet\n\n**The main idea:** ' + sheet.meaning + '\n\n' +
    '| Key term | Concise meaning |\n|---|---|\n' + terms + '\n\n' +
    '**Rule to remember:** ' + sheet.formula + '\n\n' +
    '**Small example:** ' + sheet.example + '\n\n' +
    '**How to solve problems:**\n\n' + sheet.steps.map((s, i) => (i + 1) + '. ' + s).join('\n') + '\n\n' +
    '**Common trap:** ' + sheet.trap + '\n\n' +
    '[Read the chapter in the original PDF](https://prl.korea.ac.kr/courses/cose212/2026/pl-book-eng.pdf#page=' + page + ') · [Continue to the detailed sections](#before-you-begin)\n\n';
}
