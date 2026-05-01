# EXP Tracker

A calm, analytics-focused habit tracker built with React and Vite. EXP Tracker helps you create simple daily tasks, track completion over time, and review your progress with lightweight charts and heatmaps.

## Live Demo

[https://exp-tracker-v1.netlify.app](https://exp-tracker-v1.netlify.app)

## Features

- Create tasks with a name, description, optional daily prompt, and accent color
- Track the last 7 days directly from the dashboard with quick completion toggles
- Filter tasks by `All`, `Active today`, and `Completed today`
- Sort tasks by recently updated or name
- View dashboard analytics with:
  - daily intensity line chart
  - daily intensity heatmap
- Open a task detail page with:
  - multi-range line chart (`daily`, `weekly`, `monthly`, `yearly`)
  - consistency bar chart
  - completion heatmap
- Persist task data locally in the browser using `localStorage`
- Soft-dark UI designed to stay simple and easy on the eyes

## Screenshots

Add screenshots here for:

- Dashboard overview
- Task card list
- Task detail page analytics
- Task creation form

## Tech Stack

- React
- Vite
- React Router
- Recharts
- React Icons
- Tailwind-style utility classes with custom app styling
- Browser `localStorage` for persistence

## Local Setup

From the project root:

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
EXP Tracker/
|- public/
|- src/
|  |- assets/
|  |- bin/
|  |- components/
|  |- documantation/
|  |- pages/
|  |- styles/
|  |- utility/
|  |- App.jsx
|  |- main.jsx
|- package.json
|- vite.config.js
```

## Analytics Overview

### Dashboard

The dashboard is built around a quick daily workflow:

- summary cards for tracked tasks, completed tasks today, and average weekly score
- filter and sort controls
- weekly completion strip on each task card
- aggregate line chart showing visible task intensity over time
- aggregate heatmap showing how busy each day was

### Task Detail Page

Each task has its own analytics view with:

- current and best streak metrics
- weekly, monthly, yearly, and total score summaries
- completion line chart with range switching
- bar chart for consistency patterns
- calendar-style heatmap for completion history

## Data Persistence

EXP Tracker currently stores task data in the browser with `localStorage`. That means:

- data is saved between refreshes on the same browser
- no backend setup is required for local use
- clearing browser storage will remove saved task history

## Documentation

Detailed source-side project notes live in:

- `src/documantation/README.md`
- `src/documantation/architecture-overview.md`
- `src/documantation/pages-and-components.md`
- `src/documantation/utilities-and-analytics.md`
- `src/documantation/storage-and-styling.md`
- `src/documantation/maintenance-reference.md`

## Roadmap Ideas

- better mobile chart interactions
- export or backup task history
- richer task editing flows
- optional reminders or notifications
- deeper streak and trend insights
- screenshot assets for the README

## Status

This project is actively evolving as a UI/UX-focused habit tracking app with a strong emphasis on simple daily tracking and readable analytics.
