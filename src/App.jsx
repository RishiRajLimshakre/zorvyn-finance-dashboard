import { useCallback, useEffect, useMemo } from "react";
import "./App.css";
import { Header } from "./components/layout/Header";
import { SummaryCards } from "./components/summary/SummaryCards";
import { BalanceTrendChart } from "./components/charts/BalanceTrendChart";
import { CategoryPieChart } from "./components/charts/CategoryPieChart";
import { TransactionsToolbar } from "./components/transactions/TransactionsToolbar";
import { TransactionsTable } from "./components/transactions/TransactionsTable";
import { TransactionFormModal } from "./components/transactions/TransactionFormModal";
import { InsightsPanel } from "./components/insights/InsightsPanel";
import { useAppUi } from "./hooks/useAppUi";
import { useFinanceStore } from "./store/useFinanceStore";

function App() {
  const transactions = useFinanceStore((state) => state.transactions);
  const { ui, rawUi } = useAppUi();
  const openEditForm = useFinanceStore((state) => state.openEditForm);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const handleEdit = useCallback(
    (id) => {
      if (ui.role !== "admin") return;
      openEditForm(id);
    },
    [openEditForm, ui.role],
  );

  const visibleTransactions = useMemo(() => {
    void transactions;
    void rawUi;
    return useFinanceStore.getState().getVisibleTransactions();
  }, [transactions, rawUi]);

  const categories = useMemo(
    () => [...new Set(transactions.map((tx) => tx.category))].sort(),
    [transactions],
  );

  const handleDelete = useCallback(
    (id) => {
      if (ui.role !== "admin") return;
      const tx = transactions.find((t) => t.id === id);
      const label = tx ? `"${tx.description}"` : "this transaction";
      if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
      deleteTransaction(id);
    },
    [deleteTransaction, transactions, ui.role],
  );

  useEffect(() => {
    const theme = ui.theme ?? "dark";
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0c1222" : "#f1f5f9");
  }, [ui.theme]);

  return (
    <main className="dashboard">
      <Header />
      <SummaryCards transactions={transactions} />

      <section className="charts-grid" aria-label="Charts">
        <BalanceTrendChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
      </section>

      <InsightsPanel transactions={transactions} />

      <section className="table-section" aria-label="Transactions">
        <div className="section-head section-head--table">
          <div>
            <h3>Transactions</h3>
            {ui.role === "viewer" && (
              <p className="section-sub role-hint">Viewer mode: search and filters only — editing is disabled.</p>
            )}
          </div>
          <span className="section-head__meta">{visibleTransactions.length} records</span>
        </div>
        <TransactionsToolbar categories={categories} />
        <TransactionsTable
          transactions={visibleTransactions}
          canManage={ui.role === "admin"}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      <TransactionFormModal />
    </main>
  );
}

export default App;
