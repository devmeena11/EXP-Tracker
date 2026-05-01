# Storage and Styling

## Local Storage

Two storage keys are used in active app flow:

- `tasklist`: full persisted task list
- `color`: last selected accent color in the task form

Storage behavior is routed through `utility/storageUtils.js` so malformed stored values do not crash the app.

## Styling System

Global theme tokens live in `styles/App.css`.

Main design tokens:

- `--background`
- `--surface`
- `--surface-hover`
- `--border`
- `--text-primary`
- `--text-secondary`
- `--danger`
- `--accent`

Reusable styling helpers:

- `.panel`
- `.panel-hover`
- `.btn`
- `.btn-primary`
- `.btn-secondary`
- `.btn-danger`
- `.input-field`
- `.input-area`
- `.input-select`
- `.stat-pill`
- `.metric-card`

## Accent Color Rules

- Task colors are used as accents only.
- Charts, pills, status cells, and small dots can use task color.
- Large surfaces and body text should not be globally tinted by task color.
