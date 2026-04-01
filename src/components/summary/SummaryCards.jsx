import { Landmark, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import { EmptyState } from "../common/EmptyState";

function getPeriodLabel(transactions) {
  if (transactions.length === 0) return "No data";
  const dates = transactions.map((t) => t.date).sort();
  const start = new Date(dates[0]);
  const end = new Date(dates[dates.length - 1]);
  const opts = { month: "short", day: "numeric", year: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function SummaryCards({ transactions }) {
  if (transactions.length === 0) {
    return (
      <section className="summary-section">
        <p className="summary-period">
          <span className="summary-period__label">Reporting period</span>
          No data
        </p>
        <div className="card summary-card summary-card--empty">
          <EmptyState
            title="No transactions yet"
            subtitle="Switch to Admin and add your first transaction, or reset filters if everything is hidden."
            className="empty-state--compact"
          />
        </div>
      </section>
    );
  }

  const income = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = transactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
  const totalBalance = income - expenses;
  const netSavingsPct = income === 0 ? 0 : ((income - expenses) / income) * 100;
  const periodLabel = getPeriodLabel(transactions);
  const txCount = transactions.length;

  const items = [
    {
      label: "Net balance",
      hint: "Income minus expenses (all time)",
      value: formatCurrency(totalBalance),
      icon: Landmark,
      tone: "neutral",
    },
    {
      label: "Total income",
      hint: `${txCount} transactions in range`,
      value: formatCurrency(income),
      icon: TrendingUp,
      tone: "success",
    },
    {
      label: "Total expenses",
      hint: income > 0 ? `${((expenses / income) * 100).toFixed(0)}% of total income` : "No income recorded",
      value: formatCurrency(expenses),
      icon: TrendingDown,
      tone: "danger",
    },
    {
      label: "Savings rate",
      hint: "Net divided by income",
      value: `${netSavingsPct.toFixed(1)}%`,
      icon: PiggyBank,
      tone: "neutral",
    },
  ];

  return (
    <section className="summary-section">
      <p className="summary-period">
        <span className="summary-period__label">Reporting period</span>
        {periodLabel}
      </p>
      <div className="summary-grid">
        {items.map((item) => (
          <article key={item.label} className="card summary-card">
            <div className={`icon-wrap ${item.tone}`}>
              <item.icon size={18} aria-hidden />
            </div>
            <p className="summary-card__label">{item.label}</p>
            <h2 className="summary-card__value">{item.value}</h2>
            <p className="summary-card__hint">{item.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
