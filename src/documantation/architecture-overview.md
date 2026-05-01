# Architecture Overview

## Entry Flow

- `main.jsx` mounts the React app inside `BrowserRouter`.
- `App.jsx` loads `tasklist` from local storage, normalizes/fills task data, and wires routes.
- The app has two main routes:
  - `/`: dashboard and task list
  - `/task/:id`: task details and analytics

## State Flow

- `App.jsx` owns `tasklist` state.
- `Home.jsx` receives the full list and derives:
  - filtered/sorted visible tasks
  - dashboard summary metrics
  - dashboard analytics
- `TaskPage.jsx` resolves a single task from route state or route params.

## Folder Responsibilities

- `assets/`: static config-like values such as color lists and weekday data
- `components/`: reusable UI pieces and chart cards
- `pages/`: route-level views
- `styles/`: global theme and utility classes
- `utility/`: non-visual logic for dates, storage, task normalization, analytics, and heatmap shaping
- `bin/`: legacy/non-active code kept for reference

## Main Rendering Pattern

- Components render from already-prepared data.
- Utility modules own transformation and aggregation logic.
- Charts and heatmaps consume normalized arrays instead of mutating task data inside components.
