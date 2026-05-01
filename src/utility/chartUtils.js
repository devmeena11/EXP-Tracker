import { formatShortDate, getLocalDate, getPeriodKey, getPeriodLabel } from "./dateUtils";
import { fillMissingDates, getNormalizedCompletions } from "./taskUtils";

const buildSeries = (entries = [], mode = "daily") => {
  try {
    if (mode === "daily") {
      return entries.map((entry) => ({
        date: entry.date,
        label: formatShortDate(entry.date),
        value: entry.value
      }));
    }

    const grouped = entries.reduce((map, entry) => {
      const key = getPeriodKey(entry.date, mode);
      map.set(key, (map.get(key) || 0) + entry.value);
      return map;
    }, new Map());

    return [...grouped.entries()].map(([key, value]) => ({
      date: key,
      label: getPeriodLabel(key, mode),
      value
    }));
  } catch {
    return [];
  }
};

// Weekly/monthly/yearly line data intentionally rolls raw daily values into period totals.
export const getTaskLineData = (task, mode = "daily") => {
  try {
    const completions = fillMissingDates(task).completions || [];
    const entries = completions
      .sort((left, right) => left.date.localeCompare(right.date))
      .map((completion) => ({
        date: completion.date,
        value: completion.completed ? 1 : 0
      }));

    return buildSeries(entries, mode);
  } catch {
    return [];
  }
};

export const getDailyIntensityData = (tasks, mode = "daily") => {
  try {
    if (!Array.isArray(tasks) || !tasks.length) {
      return [];
    }

    const tasksWithDates = tasks.map((task) => fillMissingDates(task));
    const earliestDate = tasksWithDates
      .map((task) => getLocalDate(task?.createdAt || new Date()))
      .sort((left, right) => left.localeCompare(right))[0];

    const totalsByDate = new Map();
    const current = new Date(earliestDate);

    while (getLocalDate(current) <= getLocalDate(new Date())) {
      totalsByDate.set(getLocalDate(current), 0);
      current.setDate(current.getDate() + 1);
    }

    tasksWithDates.forEach((task) => {
      const completions = getNormalizedCompletions(task);
      completions.forEach((completion) => {
        if (!totalsByDate.has(completion.date)) {
          totalsByDate.set(completion.date, 0);
        }

        if (completion.completed) {
          totalsByDate.set(completion.date, totalsByDate.get(completion.date) + 1);
        }
      });
    });

    const entries = [...totalsByDate.entries()].map(([date, value]) => ({ date, value }));
    return buildSeries(entries, mode);
  } catch {
    return [];
  }
};

export const getBarChartData = (completionData, mode = "weekly", offset = 0) => {
  try {
    const entries = getNormalizedCompletions({ completions: completionData }).map((completion) => ({
      date: completion.date,
      value: completion.completed ? 1 : 0
    }));

    const aggregated = buildSeries(entries, mode);
    const total = aggregated.length;

    if (total <= 6) {
      return aggregated;
    }

    const maxOffset = Math.floor((total - 1) / 6);
    const safeOffset = Math.min(offset, maxOffset);
    const start = total - (safeOffset + 1) * 6;
    const end = total - safeOffset * 6;

    return aggregated.slice(Math.max(0, start), end);
  } catch {
    return [];
  }
};
