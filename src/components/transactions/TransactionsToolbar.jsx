import { Search } from "lucide-react";
import { useAppUi } from "../../hooks/useAppUi";
import { useFinanceStore } from "../../store/useFinanceStore";

export function TransactionsToolbar({ categories }) {
  const { ui } = useAppUi();
  const { search, typeFilter, categoryFilter, sortBy, role } = ui;
  const setSearch = useFinanceStore((state) => state.setSearch);
  const setTypeFilter = useFinanceStore((state) => state.setTypeFilter);
  const setCategoryFilter = useFinanceStore((state) => state.setCategoryFilter);
  const setSortBy = useFinanceStore((state) => state.setSortBy);
  const openCreateForm = useFinanceStore((state) => state.openCreateForm);

  return (
    <div className="toolbar">
      <label className="search-input">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by description or category"
          type="text"
        />
      </label>

      <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option value={category} key={category}>
            {category}
          </option>
        ))}
      </select>

      <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="amount-desc">Amount high to low</option>
        <option value="amount-asc">Amount low to high</option>
        <option value="category-asc">Category A-Z</option>
      </select>

      {role === "admin" && (
        <button className="primary-button" type="button" onClick={openCreateForm}>
          Add transaction
        </button>
      )}
    </div>
  );
}
