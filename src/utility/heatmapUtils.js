import { withAlpha } from "./colorUtils";
import { getLocalDate } from "./dateUtils";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getSafeDate = (value, fallback = new Date()) => {
  const parsed = value instanceof Date ? new Date(value) : new Date(value ?? fallback);
  return Number.isNaN(parsed.getTime()) ? new Date(fallback) : parsed;
};

const formatMonthLabel = (dateString) => {
  const safeDate = getSafeDate(dateString);
  return `${MONTH_NAMES[safeDate.getMonth()]} ${safeDate.getFullYear()}`;
};

const toHeatmapEntry = (entry) => {
  const date = entry?.date ? getLocalDate(entry.date) : null;

  if (!date) {
    return null;
  }

  return {
    date,
    value: Number.isFinite(entry?.value) ? entry.value : 0,
    isToday: date === getLocalDate(new Date())
  };
};

const padWeek = (week) => {
  const padded = [...week];

  while (padded.length < 7) {
    padded.push({ date: null, value: -1, isToday: false });
  }

  return padded;
};

const toMonthWeeks = (entries) => {
  if (!entries.length) {
    return [];
  }

  const weeks = [];
  let currentWeek = [];
  const firstDay = getSafeDate(entries[0].date).getDay();

  for (let index = 0; index < firstDay; index += 1) {
    currentWeek.push({ date: null, value: -1, isToday: false });
  }

  entries.forEach((entry) => {
    currentWeek.push(entry);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length) {
    weeks.push(padWeek(currentWeek));
  }

  return weeks;
};

// Build stable month blocks so both task and dashboard heatmaps share the same calendar structure.
export const shapeHeatmapData = (entries) => {
  try {
    if (!Array.isArray(entries) || !entries.length) {
      return [];
    }

    const normalized = entries
      .map(toHeatmapEntry)
      .filter(Boolean)
      .sort((left, right) => left.date.localeCompare(right.date));

    if (!normalized.length) {
      return [];
    }

    const months = [];
    let currentMonthKey = normalized[0].date.slice(0, 7);
    let monthEntries = [];

    normalized.forEach((entry) => {
      const entryMonthKey = entry.date.slice(0, 7);

      if (entryMonthKey !== currentMonthKey) {
        months.push({
          key: currentMonthKey,
          label: formatMonthLabel(`${currentMonthKey}-01`),
          weeks: toMonthWeeks(monthEntries),
          days: monthEntries
        });
        currentMonthKey = entryMonthKey;
        monthEntries = [];
      }

      monthEntries.push(entry);
    });

    months.push({
      key: currentMonthKey,
      label: formatMonthLabel(`${currentMonthKey}-01`),
      weeks: toMonthWeeks(monthEntries),
      days: monthEntries
    });

    return months;
  } catch {
    return [];
  }
};

const getRangeEntries = (startValue, endValue, getValue) => {
  const start = getSafeDate(startValue);
  const end = getSafeDate(endValue);

  if (start > end) {
    return [];
  }

  const entries = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const date = getLocalDate(cursor);

    entries.push({
      date,
      value: getValue(date)
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return entries;
};

export const getTaskHeatmapData = (task) => {
  try {
    const completions = Array.isArray(task?.completions) ? task.completions : [];
    const completionMap = new Map();

    completions.forEach((completion) => {
      if (!completion?.date) {
        return;
      }

      completionMap.set(getLocalDate(completion.date), completion.completed ? 1 : 0);
    });

    const createdAt = task?.createdAt
      ? getLocalDate(task.createdAt)
      : (completionMap.size ? [...completionMap.keys()].sort()[0] : getLocalDate(new Date()));

    const today = getLocalDate(new Date());
    return getRangeEntries(createdAt, today, (date) => completionMap.get(date) ?? 0);
  } catch {
    return [];
  }
};

export const getBinaryHeatmapData = (task) => shapeHeatmapData(getTaskHeatmapData(task));

export const getHeatmapOverview = (entries) => {
  try {
    if (!Array.isArray(entries) || !entries.length) {
      return {
        startDate: null,
        endDate: null,
        activeDays: 0,
        totalValue: 0,
        peakValue: 0
      };
    }

    const valid = entries.filter((entry) => entry?.date);
    const totalValue = valid.reduce((sum, entry) => sum + (Number.isFinite(entry.value) ? entry.value : 0), 0);
    const activeDays = valid.filter((entry) => (entry.value ?? 0) > 0).length;
    const peakValue = valid.reduce((peak, entry) => Math.max(peak, Number.isFinite(entry.value) ? entry.value : 0), 0);

    return {
      startDate: valid[0]?.date || null,
      endDate: valid[valid.length - 1]?.date || null,
      activeDays,
      totalValue,
      peakValue
    };
  } catch {
    return {
      startDate: null,
      endDate: null,
      activeDays: 0,
      totalValue: 0,
      peakValue: 0
    };
  }
};

export const getIntensityHeatmapColor = (value, accentColor, maxValue) => {
  if (value === -1) return "transparent";
  if (value === 0) return "rgba(255,255,255,0.08)";

  const intensity = maxValue > 0 ? value / maxValue : 0;
  return withAlpha(accentColor, Math.max(0.24, intensity * 0.92));
};
