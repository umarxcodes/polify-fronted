import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AnalyticsAreaChart({
  data = [],
  xKey = "name",
  yKey = "value",
  color = "#3b82f6",
  height = 300,
  dark = true,
}) {
  if (!data.length) return null;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={dark ? "#243047" : "#e5e7eb"}
          />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: dark ? "#94a3b8" : "#6b7280" }}
            stroke={dark ? "#243047" : "#e5e7eb"}
          />
          <YAxis
            tick={{ fontSize: 12, fill: dark ? "#94a3b8" : "#6b7280" }}
            stroke={dark ? "#243047" : "#e5e7eb"}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: `1px solid ${dark ? "#243047" : "#e5e7eb"}`,
              backgroundColor: dark ? "#111827" : "#ffffff",
              color: dark ? "#fff" : "#111827",
            }}
          />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            fill={`url(#gradient-${color})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
