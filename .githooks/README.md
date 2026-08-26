# Git hooks

This folder is versioned (unlike `.git/hooks/`) so every contributor gets the same hooks.

## Enable once per clone

```bash
git config core.hooksPath .githooks
```

## What's here

- `pre-commit` — enforces rule 12 in `.github/instructions/qa-framework.instructions.md`:
  staged `.md` files that read as Spanish prose must contain accented characters
  (á/é/í/ó/ú/ñ/ü). English artifacts (this repo's own docs, CHANGELOGs, framework-fix
  reports) score 0 Spanish markers and are skipped automatically.

Source: a `FRAMEWORK-FIXES-qa-framework-v4.md` finding reviewed earlier in this project's setup
(no longer present in the repo), adapted to use `grep`/`wc` instead of
`ripgrep` so it runs on a bare Git Bash install with no extra tools.
