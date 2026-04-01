import { Moon, Sun, ShieldUser, Eye } from "lucide-react";
import { useAppUi } from "../../hooks/useAppUi";
import { useFinanceStore } from "../../store/useFinanceStore";

export function Header() {
  const { ui } = useAppUi();
  const { role, theme } = ui;
  const setRole = useFinanceStore((state) => state.setRole);
  const toggleTheme = useFinanceStore((state) => state.toggleTheme);

  return (
    <header className="dashboard-header card">
      <div>
        <p className="eyebrow">Finance overview</p>
        <h1>Zorvyn Dashboard</h1>
      </div>

      <div className="header-actions">
        <div className="pill-group" role="group" aria-label="Access role">
          <button
            className={`pill ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
            type="button"
            aria-pressed={role === "admin"}
          >
            <ShieldUser size={16} aria-hidden /> Admin
          </button>
          <button
            className={`pill ${role === "viewer" ? "active" : ""}`}
            onClick={() => setRole("viewer")}
            type="button"
            aria-pressed={role === "viewer"}
          >
            <Eye size={16} aria-hidden /> Viewer
          </button>
        </div>

        <button
          className="icon-button"
          onClick={toggleTheme}
          type="button"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
        </button>
      </div>
    </header>
  );
}
