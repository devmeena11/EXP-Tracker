# Pages and Components

## Pages

### `Home.jsx`

- Shows the top summary header and task list.
- Applies filters and sort order to the dashboard view.
- Renders aggregate analytics for the currently visible tasks:
  - line chart
  - intensity heatmap
- Handles:
  - delete confirmation
  - mark-today-done behavior
  - opening the task form

### `TaskPage.jsx`

- Shows one task's detailed analytics.
- Displays summary cards plus:
  - line chart with daily/weekly/monthly/yearly modes
  - binary heatmap
  - bar chart with pagination and aggregation modes

## Components

### `Topbar.jsx`

- Dashboard hero/header
- Filter buttons and sort select
- Weekly date strip

### `Task.jsx`

- One task card in the dashboard list
- Summary metadata, quick actions, and last-7-days strip

### `CheckBox.jsx`

- Toggles completion for a specific day
- Visual states:
  - done
  - pending
  - missed
  - not tracked

### `Taskform.jsx`

- Creates a new task
- Uses local storage to remember the last selected accent color

### `LineChartCard.jsx`

- Reusable line chart shell
- Owns the selected time mode
- Uses the provided `getDataForMode(mode)` function to render:
  - daily
  - weekly
  - monthly
  - yearly

### `HeatMap.jsx`

- Task-specific binary heatmap
- Uses shared heatmap shaping logic but task-specific colors

### `DashboardHeatMap.jsx`

- Dashboard-level intensity heatmap
- Uses the same shape logic with intensity-based coloring

### `BarChartContainer.jsx` and `ConsistencyBarChart.jsx`

- Bar-chart controls and rendering for task consistency summaries
