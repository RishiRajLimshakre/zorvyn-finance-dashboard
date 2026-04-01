import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";
import { EmptyState } from "../common/EmptyState";

export function TransactionsTable({ transactions, canManage, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="card table-card table-card--empty">
        <EmptyState
          title="No matching transactions"
          subtitle={
            canManage
              ? "Try adjusting search or filters, or add a new transaction."
              : "Try adjusting search or filters. Editing is disabled in viewer mode."
          }
        />
      </div>
    );
  }

  return (
    <div className="card table-card">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th className="align-right">Amount</th>
              {canManage && <th className="align-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td data-label="Date">{formatDate(tx.date)}</td>
                <td data-label="Description">{tx.description}</td>
                <td data-label="Category">{tx.category}</td>
                <td data-label="Type">
                  <span className={`badge ${tx.type}`}>{tx.type}</span>
                </td>
                <td data-label="Amount" className={`align-right ${tx.type}`}>
                  {formatCurrency(tx.amount)}
                </td>
                {canManage && (
                  <td data-label="Actions" className="align-right table-actions-cell">
                    <button className="table-action" type="button" onClick={() => onEdit(tx.id)} aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button
                      className="table-action danger"
                      type="button"
                      onClick={() => onDelete(tx.id)}
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
