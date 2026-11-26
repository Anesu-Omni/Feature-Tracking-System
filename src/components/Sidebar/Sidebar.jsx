import Icon from "../Icon/Icon";
import "./Sidebar.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "requests", label: "Feature Requests", icon: "requests" },
  { id: "systems", label: "Systems", icon: "systems" },
  { id: "users", label: "Users", icon: "users" },
  { id: "reports", label: "Reports", icon: "reports" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// Same permission mapping as before, just data-driven
const PERMISSION_KEYS = {
  requests: "canViewRequests",
  systems: "canViewSystems",
  users: "canViewUsers",
  reports: "canViewReports",
  settings: "canViewSettings",
};

// Decorative tracking board: [column label, ticket count, progress widths]
const BOARD = [
  { label: "Open", mod: "open", tickets: [70, 45] },
  { label: "Building", mod: "progress", tickets: [62, 85, 40] },
  { label: "Shipped", mod: "done", tickets: [100, 100] },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Sidebar({
  activeScreen,
  isOpen,
  onClose,
  onNavigate,
  user,
  roleLabel,
  permissions = {},
  onLogout,
}) {
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    const key = PERMISSION_KEYS[item.id];
    return key ? permissions[key] ?? true : true;
  });

  return (
    <>
      {isOpen && (
        <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fts-side ${isOpen ? "mobile-open" : ""}`}
        aria-label="Main Navigation"
      >
        {/* ---------- Animated background layers ---------- */}
        <div className="fts-side__backdrop" aria-hidden="true">
          <span className="fts-side__glow fts-side__glow--a" />
          <span className="fts-side__glow fts-side__glow--b" />

          <svg className="fts-side__rings" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="190" />
            <circle cx="200" cy="200" r="140" className="is-dashed" />
            <circle cx="200" cy="200" r="90" />
            <circle cx="390" cy="200" r="5" className="fts-side__ring-node" />
            <circle cx="101" cy="339" r="4" className="fts-side__ring-node" />
            <circle cx="200" cy="110" r="3.5" className="fts-side__ring-node" />
          </svg>

          <div className="fts-side__board">
            {BOARD.map((col) => (
              <div
                key={col.label}
                className={`fts-side__column fts-side__column--${col.mod}`}
              >
                <div className="fts-side__column-head">
                  <span className="fts-side__column-dot" />
                  {col.label}
                  <span className="fts-side__column-count">
                    {col.tickets.length}
                  </span>
                </div>
                {col.tickets.map((progress, i) => (
                  <div className="fts-side__ticket" key={i}>
                    <span className="fts-side__ticket-title" />
                    <span className="fts-side__ticket-line" />
                    <div className="fts-side__ticket-meta">
                      <span className="fts-side__ticket-avatar" />
                      <span className="fts-side__ticket-bar">
                        <span style={{ width: `${progress}%` }} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Content ---------- */}
        <div className="fts-side__inner">
          <header className="fts-side__header">
            <div className="fts-side__logo">
              <span className="fts-side__logo-mark">FTS</span>
              <div className="fts-side__logo-text">
                <strong>Feature Tracking</strong>
                <span>System</span>
              </div>
            </div>
            <button
              type="button"
              className="fts-side__close"
              onClick={onClose}
              aria-label="Close navigation menu"
            >
              <Icon name="close" />
            </button>
          </header>

          <nav className="fts-side__nav">
            {visibleNavItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`fts-side__link ${isActive ? "is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                  }}
                >
                  <span className="fts-side__link-icon">
                    <Icon name={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <footer className="fts-side__footer">
            <div className="fts-side__avatar">{getInitials(user?.fullName)}</div>
            <div className="fts-side__user">
              <strong>{user?.fullName}</strong>
              <small>{roleLabel || user?.role}</small>
            </div>
            {onLogout && (
              <button
                type="button"
                className="fts-side__logout"
                onClick={onLogout}
              >
                Sign Out
              </button>
            )}
          </footer>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;