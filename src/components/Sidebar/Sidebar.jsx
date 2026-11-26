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

function Sidebar({ activeScreen, isOpen, onClose, onNavigate }) {
  return (
    <>
      {isOpen && <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`} aria-label="Main Navigation">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-badge">FTS</span>
            <div className="logo-text">
              <strong>Feature Tracking</strong>
              <span>System</span>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeScreen === item.id ? "active" : ""}
              aria-current={activeScreen === item.id ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id);
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">EC</div>
          <div className="footer-user-info">
            <strong>Eunice Chikondo</strong>
            <small>System Admin</small>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
