import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { seedTransactions } from "../data/seedTransactions";

export const initialUi = {
  role: "admin",
  theme: "dark",
  search: "",
  typeFilter: "all",
  categoryFilter: "all",
  sortBy: "date-desc",
  editingTransactionId: null,
  isFormOpen: false,
};

/** Ensures every ui field exists (handles partial rehydration or legacy storage). */
export function normalizeUi(ui) {
  if (!ui || typeof ui !== "object") {
    return { ...initialUi };
  }
  return {
    ...initialUi,
    ...ui,
    search: typeof ui.search === "string" ? ui.search : "",
    role: ui.role ?? initialUi.role,
    theme: ui.theme ?? initialUi.theme,
    typeFilter: ui.typeFilter ?? initialUi.typeFilter,
    categoryFilter: ui.categoryFilter ?? initialUi.categoryFilter,
    sortBy: ui.sortBy ?? initialUi.sortBy,
    editingTransactionId: ui.editingTransactionId ?? null,
    isFormOpen: Boolean(ui.isFormOpen),
  };
}

function isAdminUi(ui) {
  return normalizeUi(ui).role === "admin";
}

const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: [...seedTransactions].sort(byDateDesc),
      ui: { ...initialUi },

      setRole: (role) =>
        set((state) => {
          const nextRole = role === "viewer" ? "viewer" : "admin";
          const next = { ...normalizeUi(state.ui), role: nextRole };
          if (nextRole === "viewer") {
            next.isFormOpen = false;
            next.editingTransactionId = null;
          }
          return { ui: next };
        }),

      toggleTheme: () =>
        set((state) => {
          const u = normalizeUi(state.ui);
          return {
            ui: {
              ...u,
              theme: u.theme === "dark" ? "light" : "dark",
            },
          };
        }),

      setSearch: (search) =>
        set((state) => ({
          ui: { ...normalizeUi(state.ui), search: search ?? "" },
        })),

      setTypeFilter: (typeFilter) =>
        set((state) => ({
          ui: { ...normalizeUi(state.ui), typeFilter },
        })),

      setCategoryFilter: (categoryFilter) =>
        set((state) => ({
          ui: { ...normalizeUi(state.ui), categoryFilter },
        })),

      setSortBy: (sortBy) =>
        set((state) => ({
          ui: { ...normalizeUi(state.ui), sortBy },
        })),

      openCreateForm: () =>
        set((state) => {
          if (!isAdminUi(state.ui)) return state;
          return {
            ui: { ...normalizeUi(state.ui), isFormOpen: true, editingTransactionId: null },
          };
        }),

      openEditForm: (id) =>
        set((state) => {
          if (!isAdminUi(state.ui)) return state;
          return {
            ui: { ...normalizeUi(state.ui), isFormOpen: true, editingTransactionId: id },
          };
        }),

      closeForm: () =>
        set((state) => ({
          ui: { ...normalizeUi(state.ui), isFormOpen: false, editingTransactionId: null },
        })),

      addTransaction: (transaction) =>
        set((state) => {
          if (!isAdminUi(state.ui)) return state;
          return {
            transactions: [transaction, ...state.transactions].sort(byDateDesc),
          };
        }),

      updateTransaction: (id, updated) =>
        set((state) => {
          if (!isAdminUi(state.ui)) return state;
          return {
            transactions: state.transactions
              .map((tx) => (tx.id === id ? { ...tx, ...updated } : tx))
              .sort(byDateDesc),
          };
        }),

      deleteTransaction: (id) =>
        set((state) => {
          if (!isAdminUi(state.ui)) return state;
          return {
            transactions: state.transactions.filter((tx) => tx.id !== id),
          };
        }),

      getVisibleTransactions: () => {
        const { transactions } = get();
        const ui = normalizeUi(get().ui);
        const query = (ui?.search || "").trim().toLowerCase();

        const filtered = transactions.filter((tx) => {
          const searchMatches =
            query.length === 0 ||
            tx.description.toLowerCase().includes(query) ||
            tx.category.toLowerCase().includes(query);
          const typeMatches = ui.typeFilter === "all" || tx.type === ui.typeFilter;
          const categoryMatches = ui.categoryFilter === "all" || tx.category === ui.categoryFilter;

          return searchMatches && typeMatches && categoryMatches;
        });

        const sorted = [...filtered].sort((a, b) => {
          switch (ui.sortBy) {
            case "date-asc":
              return new Date(a.date) - new Date(b.date);
            case "amount-desc":
              return b.amount - a.amount;
            case "amount-asc":
              return a.amount - b.amount;
            case "category-asc":
              return a.category.localeCompare(b.category);
            case "date-desc":
            default:
              return new Date(b.date) - new Date(a.date);
          }
        });

        return sorted;
      },
    }),
    {
      name: "zorvyn-finance-dashboard-v4",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        ui: {
          role: state.ui.role,
          theme: state.ui.theme,
          search: state.ui.search,
          typeFilter: state.ui.typeFilter,
          categoryFilter: state.ui.categoryFilter,
          sortBy: state.ui.sortBy,
        },
      }),
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState;
        return {
          ...currentState,
          ...persistedState,
          transactions: Array.isArray(persistedState.transactions)
            ? persistedState.transactions
            : currentState.transactions,
          ui: normalizeUi({
            ...initialUi,
            ...currentState.ui,
            ...persistedState.ui,
          }),
        };
      },
    },
  ),
);
