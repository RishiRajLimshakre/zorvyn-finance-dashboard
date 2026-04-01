import { useEffect, useMemo, useState } from "react";
import { useAppUi } from "../../hooks/useAppUi";
import { useFinanceStore } from "../../store/useFinanceStore";

const emptyForm = {
  date: "",
  description: "",
  category: "",
  type: "expense",
  amount: "",
};

export function TransactionFormModal() {
  const { ui } = useAppUi();
  const { isFormOpen, editingTransactionId } = ui;
  const transactions = useFinanceStore((state) => state.transactions);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const closeForm = useFinanceStore((state) => state.closeForm);

  const editingTransaction = useMemo(
    () => (editingTransactionId ? transactions.find((tx) => tx.id === editingTransactionId) : undefined),
    [transactions, editingTransactionId],
  );

  useEffect(() => {
    if (ui.role === "viewer" && isFormOpen) closeForm();
  }, [ui.role, isFormOpen, closeForm]);

  useEffect(() => {
    if (isFormOpen && editingTransactionId && !editingTransaction) closeForm();
  }, [isFormOpen, editingTransactionId, editingTransaction, closeForm]);

  useEffect(() => {
    if (!isFormOpen || ui.role !== "admin") return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeForm();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isFormOpen, ui.role, closeForm]);

  const initialForm = useMemo(() => {
    if (!isFormOpen) return emptyForm;
    if (editingTransaction) {
      return {
        date: editingTransaction.date,
        description: editingTransaction.description,
        category: editingTransaction.category,
        type: editingTransaction.type,
        amount: String(editingTransaction.amount),
      };
    }
    return {
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    };
  }, [isFormOpen, editingTransaction]);

  if (!isFormOpen || ui.role !== "admin") return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-form-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeForm();
      }}
    >
      <TransactionForm
        key={editingTransactionId || "new"}
        initialForm={initialForm}
        isEditing={Boolean(editingTransaction)}
        onCancel={closeForm}
        onSave={(form) => {
          const payload = {
            ...form,
            amount: Number(form.amount),
          };
          if (
            !payload.date ||
            !payload.description ||
            !payload.category ||
            Number.isNaN(payload.amount) ||
            payload.amount <= 0
          ) {
            return;
          }
          if (editingTransaction) {
            updateTransaction(editingTransaction.id, payload);
          } else {
            addTransaction({ id: crypto.randomUUID(), ...payload });
          }
          closeForm();
        }}
      />
    </div>
  );
}

function TransactionForm({ initialForm, isEditing, onCancel, onSave }) {
  const [form, setForm] = useState(initialForm);

  const onSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <form className="modal card" onSubmit={onSubmit} onClick={(e) => e.stopPropagation()}>
      <h3 id="transaction-form-title">{isEditing ? "Edit transaction" : "Add transaction"}</h3>
      <label className="form-field">
        <span className="form-field__label">Date</span>
        <input type="date" value={form.date} onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))} />
      </label>
      <label className="form-field">
        <span className="form-field__label">Description</span>
        <input
          type="text"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="e.g. Coffee shop"
          autoComplete="off"
        />
      </label>
      <label className="form-field">
        <span className="form-field__label">Category</span>
        <input
          type="text"
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          placeholder="e.g. Food"
          autoComplete="off"
        />
      </label>
      <div className="two-cols">
        <label className="form-field">
          <span className="form-field__label">Type</span>
          <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="form-field">
          <span className="form-field__label">Amount (USD)</span>
          <input
            type="number"
            min="1"
            step="1"
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
          />
        </label>
      </div>
      <div className="modal-actions">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary-button" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}
