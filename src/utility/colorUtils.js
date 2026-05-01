export const withAlpha = (hex, alpha = 1) => {
  if (!hex) {
    return `rgba(124, 140, 255, ${alpha})`;
  }

  let normalized = String(hex).replace("#", "");

  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (normalized.length !== 6) {
    return `rgba(124, 140, 255, ${alpha})`;
  }

  const numericValue = Number.parseInt(normalized, 16);
  if (Number.isNaN(numericValue)) {
    return `rgba(124, 140, 255, ${alpha})`;
  }

  const red = (numericValue >> 16) & 255;
  const green = (numericValue >> 8) & 255;
  const blue = numericValue & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};
