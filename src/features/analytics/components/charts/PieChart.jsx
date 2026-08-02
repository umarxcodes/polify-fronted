import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#00c4a7", "#8b6fff", "#5bc9f2", "#ff8c4a", "#ef4444", "#22c55e", "#f59e0b", "#6366f1"];

export function AnalyticsPieChart({
  data = [],
  nameKey = "name",
  valueKey = "value",
  height = 300,
  dark = true,
  showLegend = true,
}) {
  if (!data.length) return null;

  const total = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: `1px solid ${dark ? "#243047" : "#e5e7eb"}`,
              backgroundColor: dark ? "#111827" : "#ffffff",
              color: dark ? "#fff" : "#111827",
            }}
            formatter={(value) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, ""]}
          />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AnalyticsDonutChart({
  data = [],
  nameKey = "name",
  valueKey = "value",
  height = 300,
  dark = true,
  showLegend = true,
}) {
  if (!data.length) return null;

  const total = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: `1px solid ${dark ? "#243047" : "#e5e7eb"}`,
              backgroundColor: dark ? "#111827" : "#ffffff",
              color: dark ? "#fff" : "#111827",
            }}
            formatter={(value) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, ""]}
          />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
