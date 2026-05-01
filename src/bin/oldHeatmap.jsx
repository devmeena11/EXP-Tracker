import { getAllDates, getHeatmapHistory, groupByWeeks } from "./legacyFunctions";

const Heatmap = ({ task }) => {
  let newTask = task
  newTask.completions = getAllDates("2025-01-01")
  const data = getHeatmapHistory(newTask, () => newTask);
  console.log(data)
  const weeks = groupByWeeks(data);
  console.log(weeks)

  const getColor = (value) => {
  if (value === 0) return "#1e293b"; // dark
  if (value === 1) return newTask.color; // your theme
};

  return (
    <div className="flex gap-1">
      {weeks.map((week, i) => (
        <div key={i} className="flex flex-col gap-1">
          {week.map((day, j) => (
            <div key={j} title={day.date} style={{ width: 12, height: 12, backgroundColor: getColor(day.value), borderRadius: 2 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
export default Heatmap;
