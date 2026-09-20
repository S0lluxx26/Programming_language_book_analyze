"""One-time migration of the first draft's card diagrams into editable Mermaid."""
from pathlib import Path
import re
import textwrap

def label(text):
    return '<br/>'.join(textwrap.wrap(text.strip().replace('"', "'"), 42))

def convert(match):
    kind, body = match.groups()
    lines = body.strip().splitlines()
    result = ['```mermaid', 'flowchart TD']
    if kind == 'flow':
        result += ['  accTitle: A step-by-step reasoning flow', '  accDescr: Each arrow passes the result of one reasoning step to the next.']
        for i, line in enumerate(lines):
            title, _, description = line.partition('|')
            result.append(f'  N{i}["{label(title)}<br/>{label(description)}"]')
            if i:
                result.append(f'  N{i-1} --> N{i}')
    else:
        result += [f'  accTitle: {lines[0]}', '  accDescr: Select the branch that matches the current case.', f'  Q{{"{label(lines[0])}"}}']
        for i, line in enumerate(lines[1:]):
            title, _, description = line.partition('|')
            result.append(f'  Q -->|"{label(title)}"| N{i}["{label(description)}"]')
    return '\n'.join(result + ['```'])

for file in Path('book').glob('*.md'):
    source=file.read_text(encoding='utf-8')
    source=re.sub(r'```(flow|decision)\n(.*?)```',convert,source,flags=re.S)
    if file.name == '05-closures.md':
        diagram = '''```mermaid
flowchart TD
  accTitle: Closure creation and lexical application
  accDescr: The caller supplies the argument while the closure supplies the environment for the body.
  A["Caller environment<br/>x = 90"] -->|"evaluate argument 3"| D["Argument value: 3"]
  A -->|"lookup f"| B["Closure<br/>parameter y; body x + y"]
  B -->|"captures at creation"| C["Saved environment<br/>x = 10"]
  C --> E["Body environment<br/>y = 3, x = 10"]
  D --> E
  E --> F["10 + 3 = 13"]
```'''
        source=re.sub(r'<figure><svg.*?</figure>',lambda _: diagram,source,flags=re.S)
    if file.name == '07-state.md':
        diagram = '''```mermaid
flowchart LR
  accTitle: A variable lookup has two stages
  accDescr: The environment maps x to location zero, and memory maps that location to a value. Assignment changes memory only.
  X["Name x"] -->|"environment lookup"| L["Location 0"]
  L -->|"memory before"| V["Value 4"]
  L -->|"memory after x := 6"| W["Value 6"]
```'''
        source=re.sub(r'<figure><svg.*?</figure>',lambda _: diagram,source,flags=re.S)
    file.write_text(source,encoding='utf-8')
