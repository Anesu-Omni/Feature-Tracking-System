import { useState } from "react";
import Icon from "../Icon/Icon";
import "./Header.css";

function Header({ title, subtitle, isDrawerOpen, onToggleDrawer, onNewRequest, pendingAlerts, onAlertClick }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="drawer-toggle-btn"
          onClick={onToggleDrawer}
          aria-label="Open navigation menu"
          aria-expanded={isDrawerOpen}
        >
          <Icon name="menu" />
        </button>

        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        <button type="button" className="view-all btn-with-icon" onClick={onNewRequest}>
          <Icon name="plus" /> New Request
        </button>

        <div className="notification-wrapper">
          <button
            type="button"
            className="notif-btn"
            aria-label="Notifications"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <svg className="notification" viewBox="0 0 24 24">
              <path
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {pendingAlerts.length > 0 && <span className="notif-badge">{pendingAlerts.length}</span>}
          </button>

          {showNotifications && (
            <div className="notif-popover">
              <div className="notif-header">
                <strong>Active Queue ({pendingAlerts.length})</strong>
                <button type="button" onClick={() => setShowNotifications(false)}>Close</button>
              </div>
              {pendingAlerts.length === 0 ? (
                <p className="notif-empty">All caught up! No pending requests.</p>
              ) : (
                <ul>
                  {pendingAlerts.slice(0, 4).map((item) => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setShowNotifications(false);
                        onAlertClick(item);
                      }}
                    >
                      <strong>{item.id}: {item.title}</strong>
                      <span>{item.system} • {item.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="profile">
          <div className="avatar">EC</div>
          <span>Eunice Chikondo</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
