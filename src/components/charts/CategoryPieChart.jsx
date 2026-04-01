import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { formatCurrency } from "../../utils/format";
import { tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "../../utils/chartTheme";
import { EmptyState } from "../common/EmptyState";
import { useMatchMedia } from "../../hooks/useMatchMedia";

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#eab308",
  "#ec4899",
  "#64748b",
  "#14b8a6",
  "#a855f7",
];

function getCategoryData(transactions) {
  const expenseTx = transactions.filter((tx) => tx.type === "expense");
  const grouped = expenseTx.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function CategoryPieChart({ transactions }) {
  const data = getCategoryData(transactions);
  const totalExpenses = data.reduce((s, d) => s + d.value, 0);
  const compact = useMatchMedia("(max-width: 640px)");
  const chartHeight = compact ? 280 : 320;
  const innerR = compact ? 40 : 52;
  const outerR = compact ? 62 : 78;

  return (
    <article className="card chart-card">
      <div className="section-head section-head--chart">
        <div>
          <h3>Spending by category</h3>
          <p className="section-sub">Share of total expenses</p>
        </div>
        <span className="chart-badge">Pie</span>
      </div>
      {data.length === 0 ? (
        <EmptyState
          className="empty-state--in-card"
          title="No category data yet"
          subtitle="Add expense transactions to populate this chart."
        />
      ) : (
        <div className="chart-wrap chart-wrap--pie" style={{ height: chartHeight, minHeight: chartHeight }}>
          <ResponsiveContainer width="100%" height={chartHeight} debounce={50}>
            <PieChart margin={{ top: 0, right: 4, left: 4, bottom: 0 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy={compact ? "44%" : "42%"}
                innerRadius={innerR}
                outerRadius={outerR}
                paddingAngle={2}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                formatter={(value, _name, props) => [
                  `${formatCurrency(value)} (${totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(0) : 0}%)`,
                  props.payload.name,
                ]}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: compact ? "10px" : "11px",
                  paddingTop: "6px",
                  width: "100%",
                  maxHeight: compact ? "72px" : "88px",
                  overflowY: "auto",
                }}
                formatter={(value) => <span className="pie-legend-label">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
