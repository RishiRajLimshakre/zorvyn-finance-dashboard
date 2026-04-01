import { Inbox } from "lucide-react";

export function EmptyState({ title, subtitle, icon, className = "" }) {
  const Graphic = icon ?? Inbox;
  return (
    <div className={`empty-state ${className}`.trim()} role="status">
      <div className="empty-state__icon" aria-hidden>
        <Graphic size={28} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__text">{subtitle}</p>
    </div>
  );
}
