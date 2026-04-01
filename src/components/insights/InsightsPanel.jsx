import { useMemo } from "react";
import {
  PiggyBank,
  PieChart as PieChartIcon,
  TrendingDown,
  Receipt,
  CalendarDays,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "../../utils/format";
import { EmptyState } from "../common/EmptyState";

function buildInsights(transactions) {
  if (transactions.length === 0) return [];

  const income = transactions.filter((tx) => tx.type === "income");
  const expenses = transactions.filter((tx) => tx.type === "expense");

  const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const savingsRate = totalIncome === 0 ? 0 : ((totalIncome - totalExpenses) / totalIncome) * 100;

  const byCategory = expenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const topCategory = sorted[0];
  const secondCategory = sorted[1];

  const largestExpense = expenses.reduce(
    (best, tx) => (!best || tx.amount > best.amount ? tx : best),
    null,
  );

  const dates = [...new Set(transactions.map((t) => t.date))].sort();
  const daySpan = dates.length > 0 ? Math.max(1, (new Date(dates[dates.length - 1]) - new Date(dates[0])) / 86400000 + 1) : 1;
  const avgDailySpend = totalExpenses / daySpan;

  const recurring = expenses.filter((tx) =>
    /rent|insurance|subscription|gym|childcare|utilities|401/i.test(tx.description),
  );
  const recurringTotal = recurring.reduce((s, tx) => s + tx.amount, 0);
  const recurringShare = totalExpenses > 0 ? (recurringTotal / totalExpenses) * 100 : 0;

  const rows = [
    {
      icon: PiggyBank,
      title: "Savings rate",
      body: `You are saving about ${savingsRate.toFixed(1)}% of income after expenses in this dataset.`,
    },
    {
      icon: PieChartIcon,
      title: "Top spending",
      body: topCategory
        ? `${topCategory[0]} leads expenses at ${formatCurrency(topCategory[1])}` +
          (secondCategory ? `, followed by ${secondCategory[0]} (${formatCurrency(secondCategory[1])}).` : ".")
        : "No expense categories recorded.",
    },
    {
      icon: Receipt,
      title: "Largest single expense",
      body: largestExpense
        ? `${largestExpense.description} — ${formatCurrency(largestExpense.amount)} (${largestExpense.category}).`
        : "No individual expenses yet.",
    },
    {
      icon: CalendarDays,
      title: "Spending pace",
      body: `Roughly ${formatCurrency(avgDailySpend)} per day on average across ${Math.round(daySpan)} days with activity.`,
    },
    {
      icon: TrendingDown,
      title: "Recurring vs discretionary",
      body:
        recurringTotal > 0
          ? `About ${recurringShare.toFixed(0)}% of expenses look recurring (rent, subscriptions, insurance, etc.).`
          : "Tag more recurring bills to improve this split.",
    },
  ];

  if (totalExpenses > totalIncome) {
    rows.push({
      icon: AlertCircle,
      title: "Cash flow",
      body: "Expenses exceed income in this period — review large categories or timing of income.",
    });
  }

  return rows;
}

export function InsightsPanel({ transactions }) {
  const insights = useMemo(() => buildInsights(transactions), [transactions]);

  return (
    <article className="card insights-card">
      <div className="section-head">
        <div>
          <h3>Insights</h3>
          <p className="section-sub">Patterns from your current ledger</p>
        </div>
      </div>
      {insights.length === 0 ? (
        <EmptyState
          className="empty-state--in-card empty-state--compact"
          icon={Sparkles}
          title="No insights yet"
          subtitle="Add income and expense transactions to see savings rate, top categories, and spending patterns."
        />
      ) : (
        <ul className="insights-grid">
          {insights.map((row) => {
            const InsightIcon = row.icon;
            return (
              <li key={row.title} className="insight-item">
                <div className="insight-item__icon" aria-hidden>
                  <InsightIcon size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="insight-item__title">{row.title}</p>
                  <p className="insight-item__body">{row.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
