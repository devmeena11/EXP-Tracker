import { useMemo, useState } from "react";
import { FiBarChart2, FiChevronLeft, FiChevronRight, FiTrendingUp } from "react-icons/fi";
import ConsistencyBarChart from "./ConsistencyBarChart";
import { getBarChartData } from "../utility/chartUtils";
import { withAlpha } from "../utility/colorUtils";

const getWindowLabel = (total, offset) => {
  if (total <= 6) {
    return `${total} periods`;
  }

  const maxOffset = Math.floor((total - 1) / 6);
  const safeOffset = Math.min(offset, maxOffset);
  const start = Math.max(1, total - safeOffset * 6 - 5);
  const end = Math.min(total, total - safeOffset * 6);
  return `${start}-${end} of ${total}`;
};

const BarChartContainer = ({ task }) => {
  const [mode, setMode] = useState("weekly");
  const [offset, setOffset] = useState(0);

  const fullData = useMemo(() => {
    return getBarChartData(task.completions, mode, 0);
  }, [task, mode]);

  const chartData = useMemo(() => {
    return getBarChartData(task.completions, mode, offset);
  }, [task, mode, offset]);

  const total = fullData.length;
  const maxOffset = Math.max(0, Math.floor((total - 1) / 6));
  const bestPeriod = fullData.reduce((best, current) => (
    !best || current.value > best.value ? current : best
  ), null);

  return (
    <div className="panel min-w-0 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="section-title">Consistency chart</h2>
          <p className="section-subtitle">Follow your rhythm weekly, monthly, or yearly.</p>
        </div>

        <div
          className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm"
          style={{
            borderColor: withAlpha(task.color, 0.24),
            backgroundColor: withAlpha(task.color, 0.1),
            color: task.color
          }}
        >
          <FiTrendingUp />
          Accent-driven stats
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {["weekly", "monthly", "yearly"].map((value) => (
            <button
              key={value}
              className={`btn ${mode === value ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                setMode(value);
                setOffset(0);
              }}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="stat-pill">
            <FiBarChart2 />
            Showing {getWindowLabel(total, offset)}
          </span>
          {bestPeriod ? (
            <span className="stat-pill">
              Peak: {bestPeriod.label} ({bestPeriod.value})
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <button
          disabled={offset >= maxOffset}
          onClick={() => setOffset((prev) => Math.min(prev + 1, maxOffset))}
          className="btn btn-secondary h-11 w-11 rounded-full p-0"
          title="Show older periods"
        >
          <FiChevronLeft />
        </button>

        <div className="min-w-0 flex-1">
          <ConsistencyBarChart data={chartData} color={task.color} />
        </div>

        <button
          disabled={offset === 0}
          onClick={() => setOffset((prev) => Math.max(prev - 1, 0))}
          className="btn btn-secondary h-11 w-11 rounded-full p-0"
          title="Show newer periods"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default BarChartContainer;
