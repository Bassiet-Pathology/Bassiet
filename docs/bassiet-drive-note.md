# Bassiet and the Drive layout (17/11/2026, v16)

status.json carries `"drive": { "byTag": true, "method": "folder-id", "note": "…" }`.

The claude.ai Google Drive connector cannot read, query or write `appProperties`, so artifact apps cannot look up `citrusApp` tags. Bassiet instead (app-core.js `CT.driveFolder`, `CT.DRIVE`):
- own folder: cached Drive id (seed: the old My Apps/hub/bassiet id). Ids survive Citrus's moves and renames. If a write fails, it searches `Step 1 - Bassiet`, then `My Apps/hub/bassiet`, oldest first, and caches the id in db `reads/drive`.
- Yuzu inbox: cached id, then `Flashcards - Yuzu/collection & media/collection/inbox`, `collection & media/collection/inbox`, `My Apps/Yuzu/collection/inbox`, matched by parent chain.
- never creates, renames or moves a folder.
Citrus sees the flag after the owner taps "Send to Citrus" once.
