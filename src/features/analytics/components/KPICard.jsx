import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ value, duration = 1.5, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * numericValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function KPICard({
  icon: Icon,
  label,
  value,
  change,
  delay = 0,
  prefix = "",
  suffix = "",
  color = "primary",
  dark = true,
}) {
  const colorClasses = {
    primary: "from-primary-500/20 to-primary-600/10 text-primary-400",
    success: "from-success-500/20 to-success-600/10 text-success-400",
    warning: "from-warning-500/20 to-warning-600/10 text-warning-400",
    danger: "from-danger-500/20 to-danger-600/10 text-danger-400",
    info: "from-info-500/20 to-info-600/10 text-info-400",
  };

  const changeColor = change?.startsWith("+")
    ? "bg-success-500/15 text-success-400"
    : "bg-danger-500/15 text-danger-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl p-6
          ${dark ? "bg-surface-800/80 border border-surface-700/50" : "bg-white border border-surface-200"}
          backdrop-blur-sm
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`
                w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center
                ${colorClasses[color] || colorClasses.primary}
              `}
            >
              <Icon size={22} strokeWidth={2} />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  dark ? "text-surface-400" : "text-surface-500"
                }`}
              >
                {label}
              </p>
              <p
                className={`text-2xl font-bold mt-0.5 ${
                  dark ? "text-white" : "text-surface-900"
                }`}
              >
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              </p>
            </div>
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${changeColor}`}
            >
              {change?.startsWith("+") ? "↑" : "↓"} {change}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function MiniChart({ data, color = "#3b82f6", height = 40 }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.count || d.value || 0));
  const min = Math.min(...data.map((d) => d.count || d.value || 0));
  const range = max - min || 1;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d.count || d.value || 0) - min) / range * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function ProgressBar({ value, max = 100, color = "primary", dark = true }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorMap = {
    primary: "bg-primary-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
    danger: "bg-danger-500",
  };

  return (
    <div className="w-full">
      <div
        className={`
          h-2 rounded-full overflow-hidden
          ${dark ? "bg-surface-700" : "bg-surface-200"}
        `}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorMap[color] || colorMap.primary}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p
        className={`text-xs mt-1 font-medium ${
          dark ? "text-surface-400" : "text-surface-500"
        }`}
      >
        {percentage.toFixed(1)}%
      </p>
    </div>
  );
}
