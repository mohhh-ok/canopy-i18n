# AI Translation Example

Minimal example of `canopy-i18n/unstable_ai`:

1. Write messages in the source locale only and let AI fill in the rest (`completeEntries`)
2. Translate dynamic text (e.g. user input) at runtime with caching (`translate`)

## Run

```bash
bun install
bun run build # build packages/canopy-i18n once at the repo root

OPENAI_API_KEY=sk-... bun run start
# or translate your own text
OPENAI_API_KEY=sk-... bun run start "好きな文章をどうぞ"
```
