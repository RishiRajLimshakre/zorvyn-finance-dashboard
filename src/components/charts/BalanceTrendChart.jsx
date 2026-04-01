import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatCurrency, formatChartAxisDate } from "../../utils/format";
import { tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "../../utils/chartTheme";
import { EmptyState } from "../common/EmptyState";
import { useMatchMedia } from "../../hooks/useMatchMedia";

/** One point per calendar day: cumulative net cash flow (income minus expenses). */
function getDailyCumulativeSeries(transactions) {
  const dayNet = {};
  for (const tx of transactions) {
    const d = tx.date;
    dayNet[d] = (dayNet[d] || 0) + (tx.type === "income" ? tx.amount : -tx.amount);
  }
  const dates = Object.keys(dayNet).sort((a, b) => new Date(a) - new Date(b));
  let running = 0;
  return dates.map((date) => {
    running += dayNet[date];
    return { date, balance: running };
  });
}

export function BalanceTrendChart({ transactions }) {
  const data = getDailyCumulativeSeries(transactions);
  const compact = useMatchMedia("(max-width: 640px)");
  const chartHeight = compact ? 260 : 300;
  const margin = compact
    ? { top: 4, right: 4, left: -12, bottom: 4 }
    : { top: 8, right: 12, left: 4, bottom: 4 };

  return (
    <article className="card chart-card">
      <div className="section-head section-head--chart">
        <div>
          <h3>Cumulative net cash flow</h3>
          <p className="section-sub">Daily balance after income and expenses</p>
        </div>
        <span className="chart-badge">Line</span>
      </div>
      {data.length === 0 ? (
        <EmptyState
          className="empty-state--in-card"
          title="No trend data yet"
          subtitle="Add transactions to visualize your balance over time."
        />
      ) : (
        <div className="chart-wrap" style={{ height: chartHeight, minHeight: chartHeight }}>
          <ResponsiveContainer width="100%" height={chartHeight} debounce={50}>
            <LineChart data={data} margin={margin}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-text)", fontSize: compact ? 10 : 11 }}
                tickFormatter={formatChartAxisDate}
                minTickGap={compact ? 20 : 28}
                interval="preserveStartEnd"
              />
              <YAxis
                width={compact ? 44 : 52}
                tick={{ fill: "var(--muted-text)", fontSize: compact ? 10 : 11 }}
                tickFormatter={(v) =>
                  new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(v)
                }
              />
              <Tooltip
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => formatChartAxisDate(label)}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Balance"
                stroke="var(--accent-color)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
