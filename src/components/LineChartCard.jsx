import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { withAlpha } from "../utility/colorUtils";

const defaultModes = ["daily", "weekly", "monthly", "yearly"];

const LineChartCard = ({ title, subtitle, getDataForMode, color, valueLabel, valueFormatter, defaultMode = "daily" }) => {
  const [mode, setMode] = useState(defaultMode);

  const data = useMemo(() => {
    try {
      return typeof getDataForMode === "function" ? getDataForMode(mode) : [];
    } catch {
      return [];
    }
  }, [getDataForMode, mode]);

  const formatter = (value) => (valueFormatter ? valueFormatter(value, mode) : value);

  return (
    <div className="panel p-5 md:p-6 min-w-0">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {defaultModes.map((item) => (
            <button
              key={item}
              className={`btn ${mode === item ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setMode(item)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div
        className="h-72 w-full rounded-[1.25rem] border p-3"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          backgroundColor: "rgba(255,255,255,0.03)"
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <XAxis dataKey="label" stroke="#98a2b3" minTickGap={28} />
            <YAxis stroke="#98a2b3" allowDecimals={false} />
            <Tooltip
              formatter={(value) => [formatter(value), valueLabel || "Value"]}
              contentStyle={{
                backgroundColor: "#171a1f",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: 16
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color || "#7c8cff"}
              strokeWidth={3}
              dot={{ r: 2, strokeWidth: 0, fill: color || "#7c8cff" }}
              activeDot={{
                r: 5,
                strokeWidth: 0,
                fill: color || "#7c8cff",
                style: { filter: `drop-shadow(0 0 6px ${withAlpha(color || "#7c8cff", 0.45)})` }
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartCard;
