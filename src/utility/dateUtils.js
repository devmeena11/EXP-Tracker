const toSafeDate = (value, fallback = new Date()) => {
  const parsed = value instanceof Date ? new Date(value) : new Date(value ?? fallback);
  return Number.isNaN(parsed.getTime()) ? new Date(fallback) : parsed;
};

export const getLocalDate = (date) => {
  const safeDate = toSafeDate(date);
  safeDate.setMinutes(safeDate.getMinutes() - safeDate.getTimezoneOffset());
  return safeDate.toISOString().split("T")[0];
};

export const formatShortDate = (dateString) => {
  const safeDate = toSafeDate(dateString);
  return safeDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
};

export const thisWeekHandler = (referenceDate = new Date()) => {
  const anchor = toSafeDate(referenceDate);
  const dates = [];

  for (let index = 0; index < 7; index += 1) {
    const day = new Date(anchor);
    day.setDate(anchor.getDate() - index);

    dates.push({
      dateString: getLocalDate(day),
      date: day.getDate(),
      dayNum: day.getDay(),
      month: day.getMonth()
    });
  }

  return dates;
};

export const getPeriodKey = (dateString, mode = "daily") => {
  const safeDate = toSafeDate(dateString);

  switch (mode) {
    case "weekly": {
      const startOfWeek = new Date(safeDate);
      startOfWeek.setDate(safeDate.getDate() - safeDate.getDay());
      return getLocalDate(startOfWeek);
    }
    case "monthly":
      return `${safeDate.getFullYear()}-${String(safeDate.getMonth() + 1).padStart(2, "0")}`;
    case "yearly":
      return String(safeDate.getFullYear());
    case "daily":
    default:
      return getLocalDate(safeDate);
  }
};

export const getPeriodLabel = (key, mode = "daily") => {
  switch (mode) {
    case "weekly":
      return formatShortDate(key);
    case "monthly":
      return toSafeDate(`${key}-01`).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit"
      });
    case "yearly":
      return key;
    case "daily":
    default:
      return formatShortDate(key);
  }
};
