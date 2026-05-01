import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from "recharts";
import { withAlpha } from "../utility/colorUtils";

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className="rounded-2xl border px-4 py-3 text-sm"
      style={{
        backgroundColor: "#171a1f",
        borderColor: "rgba(255,255,255,0.08)",
        color: "#f3f4f6",
        boxShadow: "0 18px 40px rgba(0,0,0,0.35)"
      }}
    >
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-[var(--text-secondary)]">
        Completions: <span className="text-[var(--text-primary)]">{payload[0].value}</span>
      </p>
    </div>
  );
};

const ConsistencyBarChart = ({ data, color }) => {
  const safeColor = color || "#7c8cff";
  const average = data.length
    ? Math.round((data.reduce((total, item) => total + item.value, 0) / data.length) * 10) / 10
    : 0;

  return (
    <div
      className="h-80 min-w-0 w-full rounded-[1.25rem] border p-3"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        backgroundColor: "rgba(255,255,255,0.03)"
      }}
    >
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 8 }}>
          <defs>
            <linearGradient id="consistencyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={withAlpha(safeColor, 0.95)} />
              <stop offset="100%" stopColor={withAlpha(safeColor, 0.45)} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" stroke="#98a2b3" tickLine={false} axisLine={false} />
          <YAxis stroke="#98a2b3" allowDecimals={false} tickLine={false} axisLine={false} width={32} />

          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />

          {data.length ? (
            <ReferenceLine
              y={average}
              stroke="rgba(255,255,255,0.16)"
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
            />
          ) : null}

          <Bar
            dataKey="value"
            fill="url(#consistencyFill)"
            radius={[10, 10, 4, 4]}
            maxBarSize={46}
            animationDuration={350}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsistencyBarChart;
