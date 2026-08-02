import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function AnalyticsLineChart({
  data = [],
  lines = [],
  height = 300,
  dark = true,
}) {
  if (!data.length) return null;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={dark ? "#243047" : "#e5e7eb"}
          />
          <XAxis
            dataKey="name"
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
          {lines.length > 1 && <Legend />}
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color || "#3b82f6"}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name={line.name || line.dataKey}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
