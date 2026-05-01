# Utilities and Analytics

## Utility Modules

### `utility/dateUtils.js`

- Safe date normalization
- Local-date formatting
- Week-list generation
- Period keys and labels for chart aggregation

### `utility/colorUtils.js`

- Hex-to-RGBA conversion through `withAlpha`
- Shared accent transparency handling

### `utility/storageUtils.js`

- JSON local storage reads/writes
- Plain string local storage reads/writes
- Safe fallbacks on parse or storage errors

### `utility/taskUtils.js`

- Task completion normalization
- Missing-date filling
- Average calculations
- Insight calculations such as:
  - current streak
  - longest streak
  - last completed date
  - today status

### `utility/chartUtils.js`

- Shared series aggregation by mode
- Task line-chart data generation
- Dashboard intensity data generation
- Bar-chart pagination data generation

### `utility/heatmapUtils.js`

- Converts flat date/value arrays into month/week/day blocks
- Supports both:
  - binary task heatmaps
  - intensity dashboard heatmaps

## Analytics Rules

### Line Charts

- `daily`: raw day-level values
- `weekly`: total completions per week
- `monthly`: total completions per month
- `yearly`: total completions per year

### Bar Chart

- Uses total completions by selected period
- Shows paginated windows when the history is longer than six buckets

### Heatmaps

- Task heatmap uses binary values
- Dashboard heatmap uses intensity values where higher totals deepen the accent color

## Error Handling Strategy

- Utility modules catch malformed input and return safe fallbacks.
- Chart-producing utilities prefer `[]` over throwing.
- Storage utilities prefer fallback values over parse failures.
