Review the current conversation and update `CLAUDE.md` to reflect any new knowledge gained about this project.

## What to look for

Scan the conversation for anything that reveals how this project should be worked on:

- **Corrections** — you made an assumption that the user corrected (e.g. wrong tool, wrong pattern, wrong path)
- **Preferences** — how the user wants things done ("always use X", "never do Y")
- **Conventions** — naming rules, file structure choices, coding patterns confirmed or introduced
- **Tech/tooling facts** — versions, dependencies, config quirks specific to this environment
- **Architectural decisions** — why a certain approach was chosen
- **Workflow steps** — commands, sequences, or processes the user expects

## How to update

1. Read the current `CLAUDE.md`
2. For each piece of new knowledge identified, check if it's already documented
3. If it exists but is wrong or incomplete, update it in place
4. If it's missing, add it to the most relevant existing section
5. Only create a new section if nothing existing fits
6. Keep entries concise — bullet points over prose, CLAUDE.md is loaded every session so it should stay lean
7. Do not duplicate, restate, or rephrase content that's already correct

## What NOT to add

- The specific task worked on during this session
- Temporary state or in-progress decisions
- Anything you're not confident is a stable project convention
- Content already covered accurately

## After editing

Briefly tell the user what was changed and why (one or two sentences max).
