import { getLocalDate } from "../utility/dateUtils";

const today = getLocalDate(new Date());

export const generateCompletions = (startDate) => {
  const data = [];
  let d = new Date(startDate);

  let current = getLocalDate(d);

  while (current <= today) {
    data.push({
      date: current,
      completed: Math.random() < 0.7
    });

    d.setDate(d.getDate() + 1);
    current = getLocalDate(d);
  }

  return data;
};

export const getWeeklyProgress = (task) => {
  const weeks = {};

  task.completions.forEach(({ date, completed }) => {
    const d = new Date(date);
    const sunday = new Date(d);
    sunday.setDate(d.getDate() - d.getDay());

    const key = getLocalDate(sunday);

    if (!weeks[key]) {
      weeks[key] = {
        weekStart: key,
        score: 0,
        total: 0
      };
    }

    weeks[key].score += completed ? 1 : 0;
    weeks[key].total += 1;
  });

  return Object.values(weeks)
    .map((week) => ({
      ...week,
      percentage: week.total === 0 ? 0 : Math.round((week.score / week.total) * 100)
    }))
    .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
};

export const getMonthlyProgress = (task) => {
  const months = {};

  task.completions.forEach(({ date, completed }) => {
    const d = new Date(date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (!months[key]) {
      months[key] = {
        month: key,
        score: 0,
        total: 0
      };
    }

    months[key].score += completed ? 1 : 0;
    months[key].total += 1;
  });

  return Object.values(months)
    .map((month) => ({
      ...month,
      percentage: month.total === 0 ? 0 : Math.round((month.score / month.total) * 100)
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
};

export const getYearlyProgress = (task) => {
  const years = {};

  task.completions.forEach(({ date, completed }) => {
    const d = new Date(date);
    const key = d.getFullYear();

    if (!years[key]) {
      years[key] = {
        year: key,
        score: 0,
        total: 0
      };
    }

    years[key].score += completed ? 1 : 0;
    years[key].total += 1;
  });

  return Object.values(years)
    .map((year) => ({
      ...year,
      percentage: year.total === 0 ? 0 : Math.round((year.score / year.total) * 100)
    }))
    .sort((a, b) => a.year - b.year);
};

export const getHeatmapHistory = (task, fillMissingDates) => {
  const filledTask = fillMissingDates(task);
  const map = {};

  filledTask.completions.forEach(({ date, completed }) => {
    map[date] = completed ? 1 : 0;
  });

  const start = new Date(getLocalDate(task.createdAt));
  const end = new Date(today);
  const data = [];

  let current = new Date(start);

  while (current <= end) {
    const dateStr = getLocalDate(current);

    data.push({
      date: dateStr,
      value: map[dateStr] || 0,
      day: current.getDay()
    });

    current.setDate(current.getDate() + 1);
  }

  return data;
};

export const groupByWeeks = (data) => {
  const weeks = [];
  let currentWeek = [];

  data.forEach((item) => {
    if (item.day === 0 && currentWeek.length) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(item);
  });

  if (currentWeek.length) {
    weeks.push(currentWeek);
  }

  return weeks;
};

export const getAllDates = (date) => {
  const data = [];
  const d = new Date(date);
  let currentDate = getLocalDate(d);

  while (currentDate <= today) {
    if (currentDate.split("-")[2] === "01") {
      data.push({
        date: currentDate,
        completed: Math.random() * 100 < 80,
        day: d.getDate()
      });
    } else {
      data.push({
        date: currentDate,
        completed: Math.random() * 100 < 80
      });
    }

    d.setDate(d.getDate() + 1);
    currentDate = getLocalDate(d);
  }

  return data;
};
