import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#00c4a7", "#8b6fff", "#5bc9f2", "#ff8c4a", "#ef4444", "#22c55e"];

export function AnalyticsBarChart({
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
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
