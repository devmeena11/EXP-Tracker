import { thisWeekHandler } from "../utility/dateUtils.js";

export const colors = [
  "#FF3B3B",
  "#FF6B00",
  "#FFD600",
  "#00FF87",
  "#00E5FF",
  "#2979FF",
  "#7C4DFF",
  "#D500F9",
  "#FF4081",
  "#F50057",
  "#00BFA5",
  "#1DE9B6",
  "#76FF03",
  "#C6FF00",
  "#FF1744",
  "#651FFF"
];

export const weeklist = thisWeekHandler(Date.now());

export const weekDays = [
  { name: "Sunday", value: 0, color: "#FF3B3B" },
  { name: "Monday", value: 1, color: "#FF6B00" },
  { name: "Tuesday", value: 2, color: "#FFD600" },
  { name: "Wednesday", value: 3, color: "#00FF87" },
  { name: "Thursday", value: 4, color: "#00E5FF" },
  { name: "Friday", value: 5, color: "#2979FF" },
  { name: "Saturday", value: 6, color: "#D500F9" }
];
