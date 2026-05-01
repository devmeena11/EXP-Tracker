import { getLocalDate } from "./dateUtils";

const today = getLocalDate(new Date());

const normalizeCompletions = (task) => {
  try {
    const completions = Array.isArray(task?.completions) ? task.completions : [];

    return completions
      .map((completion) => ({
        date: getLocalDate(completion?.date ?? today),
        completed: Boolean(completion?.completed)
      }))
      .sort((left, right) => left.date.localeCompare(right.date));
  } catch {
    return [];
  }
};

const getCreatedDate = (task, completions) => {
  if (task?.createdAt) {
    return getLocalDate(task.createdAt);
  }

  return completions[0]?.date || today;
};

export const fillMissingDates = (task) => {
  try {
    const completions = normalizeCompletions(task);
    if (!completions.length) {
      return {
        ...task,
        completions: []
      };
    }

    const current = new Date(completions[completions.length - 1].date);
    const missing = [];

    while (true) {
      current.setDate(current.getDate() + 1);
      const formatted = getLocalDate(current);

      if (formatted > today) {
        break;
      }

      missing.push({
        date: formatted,
        completed: false
      });
    }

    return {
      ...task,
      completions: [...completions, ...missing]
    };
  } catch {
    return {
      ...task,
      completions: []
    };
  }
};

export const getTaskAverages = (task) => {
  const completions = normalizeCompletions(task);
  const createdAt = getCreatedDate(task, completions);

  const calculateAverage = (filterFn) => {
    const valid = completions.filter((completion) => (
      completion.date >= createdAt &&
      completion.date <= today &&
      filterFn(completion.date)
    ));

    const total = valid.length;
    const done = valid.filter((value) => value.completed).length;

    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  return {
    week: calculateAverage((dateString) => {
      const diff = (new Date(today) - new Date(dateString)) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff < 7;
    }),
    month: calculateAverage((dateString) => {
      const safeDate = new Date(dateString);
      const currentDate = new Date(today);
      return safeDate.getMonth() === currentDate.getMonth() && safeDate.getFullYear() === currentDate.getFullYear();
    }),
    year: calculateAverage((dateString) => new Date(dateString).getFullYear() === new Date(today).getFullYear()),
    total: calculateAverage(() => true)
  };
};

export const getTaskInsights = (task) => {
  const completions = normalizeCompletions(task).filter((completion) => completion.date <= today);

  let runningStreak = 0;
  let longestComputedStreak = 0;

  completions.forEach((completion) => {
    if (completion.completed) {
      runningStreak += 1;
      longestComputedStreak = Math.max(longestComputedStreak, runningStreak);
      return;
    }

    runningStreak = 0;
  });

  let currentStreak = 0;
  for (let index = completions.length - 1; index >= 0; index -= 1) {
    if (!completions[index].completed) {
      break;
    }
    currentStreak += 1;
  }

  const lastCompletedDate = [...completions].reverse().find((completion) => completion.completed)?.date || null;
  const todayCompletion = completions.find((completion) => completion.date === today);
  const averages = getTaskAverages(task);

  return {
    currentStreak,
    longestStreak: Math.max(task?.longestStreak || 0, longestComputedStreak),
    lastCompletedDate,
    completedToday: Boolean(todayCompletion?.completed),
    needsAttentionToday: todayCompletion ? !todayCompletion.completed : true,
    weeklyRate: averages.week,
    totalRate: averages.total
  };
};

export const getNormalizedCompletions = normalizeCompletions;
