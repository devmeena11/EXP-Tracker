# Maintenance Reference

## When Adding New Analytics

- Put transformation logic in `utility/`, not inside components.
- Keep components render-focused.
- Reuse `getPeriodKey` and `getPeriodLabel` for time-based grouping so labels stay consistent.

## When Adding New Task Fields

- Update task creation in `Taskform.jsx`.
- Check whether the field should persist in local storage.
- Check whether it affects dashboard summaries or task insights.

## When Editing Chart Modes

- `LineChartCard.jsx` owns chart mode UI.
- The actual aggregation behavior comes from the supplied utility-backed `getDataForMode(mode)` function.
- If a new mode is added, update:
  - the chart utility that builds the data
  - the mode button list
  - any docs that describe analytics behavior

## When Editing Heatmaps

- Keep shape-building logic generic in `utility/heatmapUtils.js`.
- Apply coloring rules in the component layer unless the color rule is shared by multiple heatmaps.

## Legacy Code

- `bin/` contains legacy helpers and experiments.
- Legacy files are intentionally kept out of the active `pages/`, `components/`, and `utility/` flow.

## Current Practical Notes

- The app state is still fully local-storage driven.
- Build/test verification from project root still needs to be run outside this `src`-only access window.
