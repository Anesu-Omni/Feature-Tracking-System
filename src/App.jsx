import { useState, useEffect, useMemo } from "react";
import "./App.css";

function Icon({ name }) {
  const paths = {
    activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    dashboard: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="5" rx="1" />
        <rect x="13" y="10" width="8" height="11" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </>
    ),
    reports: (
      <>
        <path d="M3 3v18h18" />
        <path d="M18 17V9M13 17V5M8 17v-3" />
      </>
    ),
    requests: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </>
    ),
    settings: (
      <>
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
        <path d="M2 14h4M10 8h4M18 16h4" />
      </>
    ),
    systems: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </>
    ),
    close: <path d="M18 6 6 18M6 6l12 12" />,
    menu: <path d="M3 12h18M3 6h18M3 18h18" />,
  };

  return (
    <svg
      className="app-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const getInitialRequests = () => {
  const now = new Date();
  const dateForMonth = (monthOffset, day) =>
    new Date(now.getFullYear(), now.getMonth() + monthOffset, day).toISOString();

  return [
    { id: "FR-001", title: "Add PDF payslip download", system: "Payroll Management System", priority: "High", status: "Completed", requester: "T. Moyo", createdAt: dateForMonth(0, 2) },
    { id: "FR-002", title: "Improve login functionality", system: "HR Management System", priority: "Medium", status: "Completed", requester: "R. Ndlovu", createdAt: dateForMonth(0, 4) },
    { id: "FR-003", title: "Add employee search feature", system: "HR Management System", priority: "Low", status: "Completed", requester: "K. Sibanda", createdAt: dateForMonth(0, 6) },
    { id: "FR-004", title: "Update payment processing", system: "Payroll Management System", priority: "High", status: "Completed", requester: "Eunice Chikondo", createdAt: dateForMonth(0, 8) },
    { id: "FR-005", title: "Add leave balance report", system: "HR Management System", priority: "Medium", status: "Completed", requester: "S. Chigumba", createdAt: dateForMonth(0, 10) },
    { id: "FR-006", title: "Automate payroll deductions", system: "Payroll Management System", priority: "High", status: "Completed", requester: "Eunice Chikondo", createdAt: dateForMonth(0, 12) },
    { id: "FR-007", title: "Improve onboarding checklist", system: "HR Management System", priority: "Low", status: "Completed", requester: "R. Ndlovu", createdAt: dateForMonth(0, 16) },
    { id: "FR-008", title: "Add audit history", system: "Payroll Management System", priority: "Medium", status: "Completed", requester: "T. Moyo", createdAt: dateForMonth(0, 19) },
    { id: "FR-009", title: "Add manager payroll approvals", system: "Payroll Management System", priority: "High", status: "In Progress", requester: "Eunice Chikondo", createdAt: dateForMonth(0, 21) },
    { id: "FR-010", title: "Create a team calendar", system: "HR Management System", priority: "Medium", status: "Pending", requester: "K. Sibanda", createdAt: dateForMonth(0, 23) },
    { id: "FR-011", title: "Add overtime rules", system: "Payroll Management System", priority: "Low", status: "Completed", requester: "T. Moyo", createdAt: dateForMonth(-1, 12) },
    { id: "FR-012", title: "Add employee profile fields", system: "HR Management System", priority: "Low", status: "In Progress", requester: "S. Chigumba", createdAt: dateForMonth(-1, 18) },
    { id: "FR-013", title: "Add overtime approval workflow", system: "Payroll Management System", priority: "Medium", status: "Completed", requester: "Eunice Chikondo", createdAt: dateForMonth(-2, 9) },
    { id: "FR-014", title: "Add team leave calendar", system: "HR Management System", priority: "High", status: "Pending", requester: "R. Ndlovu", createdAt: dateForMonth(-3, 14) },
  ];
};

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getRequestViewTitle(status, priority) {
  const filters = [];
  if (status !== "All") filters.push(status);
  if (priority !== "All") filters.push(`${priority} Priority`);
  return filters.length ? `${filters.join(" ")} Requests` : "All Requests";
}

function RequestTable({ requests, onStatusChange, onDelete, showActions = true }) {
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const sortedRequests = useMemo(() => {
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    return [...requests].sort((a, b) => {
      let comparison;
      if (sortConfig.key === "createdAt") {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortConfig.key === "priority") {
        comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
      } else {
        comparison = a[sortConfig.key].localeCompare(b[sortConfig.key]);
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [requests, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  if (requests.length === 0) {
    return <p className="empty-requests">No feature requests match the current filters.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort("id")}>
              ID {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="sortable" onClick={() => handleSort("title")}>
              Request Title {sortConfig.key === "title" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th>System</th>
            <th className="sortable" onClick={() => handleSort("priority")}>
              Priority {sortConfig.key === "priority" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th>Status</th>
            <th className="sortable" onClick={() => handleSort("createdAt")}>
              Date {sortConfig.key === "createdAt" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedRequests.map((request) => (
            <tr key={request.id}>
              <td className="mono-id">{request.id}</td>
              <td>
                <div className="title-cell">
                  <strong>{request.title}</strong>
                  {request.requester && <small>Requested by {request.requester}</small>}
                </div>
              </td>
              <td>{request.system}</td>
              <td>
                <span className={`priority ${request.priority.toLowerCase()}`}>
                  {request.priority}
                </span>
              </td>
              <td>
                <select
                  aria-label={`Change status for ${request.id}`}
                  className={`status-select ${request.status.toLowerCase().replace(" ", "-")}`}
                  value={request.status}
                  onChange={(e) => onStatusChange(request.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                {new Date(request.createdAt).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              {showActions && (
                <td>
                  <button
                    type="button"
                    className="icon-btn danger"
                    title="Delete request"
                    aria-label={`Delete ${request.id}`}
                    onClick={() => onDelete(request.id)}
                  >
                    <Icon name="trash" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewRequestModal({ isOpen, onClose, onAdd, systems, nextId }) {
  const [title, setTitle] = useState("");
  const [system, setSystem] = useState(systems[0] || "Payroll Management System");
  const [priority, setPriority] = useState("Medium");
  const [requester, setRequester] = useState("Eunice Chikondo");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      id: nextId,
      title: title.trim(),
      system,
      priority,
      status: "Pending",
      requester: requester.trim() || "System Admin",
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="modal-title">New Feature Request</h2>
            <p>Log a new enhancement request ({nextId})</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="filter-field">
            <span>Request Title *</span>
            <input
              type="text"
              required
              placeholder="e.g., Export monthly tax summary to CSV"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <div className="modal-row">
            <label className="filter-field">
              <span>Target System</span>
              <select value={system} onChange={(e) => setSystem(e.target.value)}>
                {systems.map((sys) => (
                  <option key={sys} value={sys}>
                    {sys}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span>Priority Level</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
          </div>

          <label className="filter-field">
            <span>Requested By</span>
            <input
              type="text"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="view-all secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="view-all">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("fts_requests_v3");
    return saved ? JSON.parse(saved) : getInitialRequests();
  });

  const [selectedPriority, setSelectedPriority] = useState("All");
  const [screen, setScreen] = useState("dashboard");
  const [monthFilter, setMonthFilter] = useState(() => getMonthKey(new Date()));
  const [systemFilter, setSystemFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [requestView, setRequestView] = useState({
    title: "All Requests",
    status: "All",
    priority: "All",
  });

  useEffect(() => {
    localStorage.setItem("fts_requests_v3", JSON.stringify(requests));
  }, [requests]);

  const now = new Date();
  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(now);

  const availableSystems = [
    "Payroll Management System",
    "HR Management System",
    "Inventory & Asset Tracker",
    "Customer Support Portal",
  ];

  const nextRequestId = useMemo(() => {
    const maxNum = requests.reduce((max, r) => {
      const num = parseInt(r.id.replace("FR-", ""), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `FR-${String(maxNum + 1).padStart(3, "0")}`;
  }, [requests]);

  const handleAddRequest = (newReq) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  const handleStatusChange = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const handleDeleteRequest = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleResetDemoData = () => {
    const fresh = getInitialRequests();
    setRequests(fresh);
    localStorage.setItem("fts_requests_v3", JSON.stringify(fresh));
  };

  const exportToCSV = (rows) => {
    const headers = ["ID", "Title", "System", "Priority", "Status", "Requester", "Created Date"];
    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.id,
          `"${r.title.replace(/"/g, '""')}"`,
          `"${r.system}"`,
          r.priority,
          r.status,
          `"${r.requester || ""}"`,
          new Date(r.createdAt).toISOString().split("T")[0],
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `FTS_Report_${getMonthKey(now)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const availableMonths = [...new Set(requests.map((r) => getMonthKey(new Date(r.createdAt))))]
    .sort((a, b) => b.localeCompare(a))
    .map((key) => {
      const [year, month] = key.split("-").map(Number);
      return {
        value: key,
        label: new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
          new Date(year, month - 1, 1)
        ),
      };
    });

  const selectedMonth = availableMonths.find((m) => m.value === monthFilter);
  const periodLabel = monthFilter === "all" ? "all months" : selectedMonth?.label ?? monthLabel;

  const currentMonthRequests = requests.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const requestCounts = currentMonthRequests.reduce(
    (counts, r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
      return counts;
    },
    { Pending: 0, "In Progress": 0, Completed: 0 }
  );

  const completionRate = currentMonthRequests.length
    ? Math.round((requestCounts.Completed / currentMonthRequests.length) * 100)
    : 0;

  const stats = [
    { title: "Requests this month", count: currentMonthRequests.length, view: { title: "All Requests" }, icon: "file", color: "blue" },
    { title: "Pending", count: requestCounts.Pending, view: { title: "Pending Requests", status: "Pending" }, icon: "clock", color: "orange" },
    { title: "In Progress", count: requestCounts["In Progress"], view: { title: "In Progress Requests", status: "In Progress" }, icon: "activity", color: "purple" },
    { title: "Completed", count: requestCounts.Completed, subtext: `${completionRate}% rate`, view: { title: "Completed Requests", status: "Completed" }, icon: "check", color: "green" },
  ];

  const priorityColors = { High: "#d9383a", Medium: "#2f75bd", Low: "#4a82b8" };
  const progressData = ["High", "Medium", "Low"].map((priority) => {
    const count = currentMonthRequests.filter((r) => r.priority === priority).length;
    return {
      priority,
      requests: count,
      percentage: currentMonthRequests.length ? (count / currentMonthRequests.length) * 100 : 0,
      color: priorityColors[priority],
    };
  });

  const recentRequests = [...currentMonthRequests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const filteredRequests = requests.filter((r) => {
    const matchesMonth = monthFilter === "all" || getMonthKey(new Date(r.createdAt)) === monthFilter;
    const matchesSystem = systemFilter === "All" || r.system === systemFilter;
    const matchesStatus = requestView.status === "All" || r.status === requestView.status;
    const matchesPriority = requestView.priority === "All" || r.priority === requestView.priority;
    const matchesSearch =
      !searchQuery.trim() ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.system.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMonth && matchesSystem && matchesStatus && matchesPriority && matchesSearch;
  });

  const filteredProgress = progressData.filter(
    (item) => selectedPriority === "All" || item.priority === selectedPriority
  );

  const pendingAlerts = requests.filter((r) => r.status !== "Completed");

  const openRequests = (view = {}) => {
    setRequestView({ title: "All Requests", status: "All", priority: "All", ...view });
    setMonthFilter(getMonthKey(now));
    setSystemFilter("All");
    setSearchQuery("");
    setScreen("requests");
    setIsDrawerOpen(false);
  };

  const navigateTo = (targetScreen) => {
    setScreen(targetScreen);
    setIsDrawerOpen(false);
  };

  const updateRequestFilter = (key, value) => {
    setRequestView((current) => {
      const updated = { ...current, [key]: value };
      return { ...updated, title: getRequestViewTitle(updated.status, updated.priority) };
    });
  };

  return (
    <div className="dashboard">
      {/* Side Drawer Backdrop */}
      {isDrawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Side Drawer */}
      <aside
        className={`sidebar ${isDrawerOpen ? "mobile-open" : ""}`}
        aria-label="Main Navigation"
      >
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
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            <Icon name="close" />
          </button>
        </div>

        

        <nav>
          {[
            { id: "dashboard", label: "Dashboard", icon: "dashboard", action: () => navigateTo("dashboard") },
            { id: "requests", label: "Feature Requests", icon: "requests", action: () => openRequests() },
            { id: "systems", label: "Systems", icon: "systems", action: () => navigateTo("systems") },
            { id: "users", label: "Users", icon: "users", action: () => navigateTo("users") },
            { id: "reports", label: "Reports", icon: "reports", action: () => navigateTo("reports") },
            { id: "settings", label: "Settings", icon: "settings", action: () => navigateTo("settings") },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={screen === item.id ? "active" : ""}
              aria-current={screen === item.id ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                item.action();
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

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button
              type="button"
              className="drawer-toggle-btn"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              aria-label="Open navigation menu"
              aria-expanded={isDrawerOpen}
            >
              <Icon name="menu" />
            </button>

            <div>
              <h1>
                {screen === "dashboard" && "Dashboard"}
                {screen === "requests" && requestView.title}
                {screen === "systems" && "Monitored Systems"}
                {screen === "users" && "Team & Requesters"}
                {screen === "reports" && "Analytics & Reports"}
                {screen === "settings" && "System Settings"}
              </h1>
              <p>
                {screen === "dashboard" && `Welcome back, Eunice Chikondo. Here is your ${monthLabel} overview.`}
                {screen === "requests" && `Showing ${filteredRequests.length} requests for ${periodLabel}${systemFilter === "All" ? "." : ` in ${systemFilter}.`}`}
                {screen === "systems" && "Overview of active enterprise systems and open feature backlogs."}
                {screen === "users" && "Active contributors and system administrators."}
                {screen === "reports" && "Exportable completion metrics and system distribution."}
                {screen === "settings" && "Manage local dashboard preferences and sample data."}
              </p>
            </div>
          </div>

          <div className="header-right">
            <button
              type="button"
              className="view-all btn-with-icon"
              onClick={() => setIsModalOpen(true)}
            >
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
                            openRequests({ status: item.status });
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

        {/* DASHBOARD VIEW */}
        {screen === "dashboard" && (
          <>
            <section className="stats-grid">
              {stats.map((stat) => (
                <button
                  className="stat-card"
                  key={stat.title}
                  type="button"
                  onClick={() => openRequests(stat.view)}
                >
                  <div className={`stat-icon ${stat.color}`}>
                    <Icon name={stat.icon} />
                  </div>
                  <div>
                    <p>{stat.title}</p>
                    <div className="stat-value-row">
                      <h2>{stat.count}</h2>
                      {stat.subtext && <span className="stat-pill">{stat.subtext}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </section>

            <section className="content-card progress-section">
              <div className="section-header">
                <div>
                  <h2>Requests by Priority</h2>
                  <p>{monthLabel} requests grouped by priority</p>
                </div>

                <div className="filter-container">
                  <label htmlFor="priorityFilter">Filter by Priority:</label>
                  <select
                    id="priorityFilter"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="progress-list">
                {filteredProgress.map((item) => (
                  <button
                    className="progress-item progress-link"
                    key={item.priority}
                    type="button"
                    onClick={() =>
                      openRequests({
                        title: `${item.priority} Priority Requests`,
                        priority: item.priority,
                      })
                    }
                  >
                    <div className="progress-info">
                      <strong>{item.priority} Priority</strong>
                      <span>
                        {item.requests} requests ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              <div className="progress-total">
                Total requests this month: <strong>{currentMonthRequests.length}</strong> • Completion rate: <strong>{completionRate}%</strong>
              </div>
            </section>

            <section className="content-card requests-section">
              <div className="section-header">
                <div>
                  <h2>Recent Feature Requests</h2>
                  <p>Latest requests submitted in {monthLabel} (update status directly below)</p>
                </div>

                <button className="view-all" type="button" onClick={() => openRequests()}>
                  View All Requests
                </button>
              </div>

              <RequestTable
                requests={recentRequests}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteRequest}
              />
            </section>
          </>
        )}

        {/* ALL REQUESTS VIEW */}
        {screen === "requests" && (
          <section className="content-card all-requests-section">
            <div className="section-header">
              <div>
                <h2>{requestView.title}</h2>
                <p>
                  Showing {filteredRequests.length} requests for {periodLabel}
                  {systemFilter === "All" ? "" : ` in ${systemFilter}`}
                </p>
              </div>
              <div className="request-actions">
                <button
                  className="view-all secondary btn-with-icon"
                  type="button"
                  onClick={() => exportToCSV(filteredRequests)}
                >
                  <Icon name="download" /> Export CSV
                </button>
                <button
                  className="view-all"
                  type="button"
                  onClick={() => navigateTo("dashboard")}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            <div className="request-filters five-col">
              <label className="filter-field" htmlFor="searchFilter">
                <span>Search</span>
                <div className="search-input-wrap">
                  <Icon name="search" />
                  <input
                    id="searchFilter"
                    type="search"
                    placeholder="ID or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>

              <label className="filter-field" htmlFor="monthFilter">
                <span>Month</span>
                <select
                  id="monthFilter"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                >
                  <option value="all">All months</option>
                  {availableMonths.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filter-field" htmlFor="systemFilter">
                <span>System</span>
                <select
                  id="systemFilter"
                  value={systemFilter}
                  onChange={(e) => setSystemFilter(e.target.value)}
                >
                  <option value="All">All systems</option>
                  {availableSystems.map((system) => (
                    <option key={system} value={system}>
                      {system}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filter-field" htmlFor="statusFilter">
                <span>Status</span>
                <select
                  id="statusFilter"
                  value={requestView.status}
                  onChange={(e) => updateRequestFilter("status", e.target.value)}
                >
                  <option value="All">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>

              <label className="filter-field" htmlFor="priorityFilterRequests">
                <span>Priority</span>
                <select
                  id="priorityFilterRequests"
                  value={requestView.priority}
                  onChange={(e) => updateRequestFilter("priority", e.target.value)}
                >
                  <option value="All">All priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>
            </div>

            <RequestTable
              requests={filteredRequests}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteRequest}
            />
          </section>
        )}

        {/* SYSTEMS VIEW */}
        {screen === "systems" && (
          <section className="systems-grid">
            {availableSystems.map((sys) => {
              const sysReqs = requests.filter((r) => r.system === sys);
              const openCount = sysReqs.filter((r) => r.status !== "Completed").length;
              return (
                <div className="content-card system-card" key={sys}>
                  <div className="system-card-top">
                    <div className="stat-icon blue"><Icon name="systems" /></div>
                    <span className="status completed">Operational</span>
                  </div>
                  <h3>{sys}</h3>
                  <p className="sys-meta">
                    Total Requests: <strong>{sysReqs.length}</strong> • Open Backlog: <strong>{openCount}</strong>
                  </p>
                  <button
                    type="button"
                    className="view-all secondary"
                    onClick={() => {
                      setSystemFilter(sys);
                      setMonthFilter("all");
                      navigateTo("requests");
                    }}
                  >
                    Filter System Requests
                  </button>
                </div>
              );
            })}
          </section>
        )}

        {/* USERS VIEW */}
        {screen === "users" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>System Stakeholders</h2>
                <p>Users submitting and managing feature requests</p>
              </div>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Submitted Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Eunice Chikondo", role: "System Admin", dept: "IT & Systems" },
                    { name: "T. Moyo", role: "Payroll Lead", dept: "Finance" },
                    { name: "R. Ndlovu", role: "HR Specialist", dept: "Human Resources" },
                    { name: "K. Sibanda", role: "HR Coordinator", dept: "Human Resources" },
                    { name: "S. Chigumba", role: "Operations Analyst", dept: "Operations" },
                  ].map((user) => (
                    <tr key={user.name}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.role}</td>
                      <td>{user.dept}</td>
                      <td>{requests.filter((r) => r.requester?.includes(user.name.split(" ")[1])).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* REPORTS VIEW */}
        {screen === "reports" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>Feature Delivery Summary</h2>
                <p>All-time breakdown across {requests.length} tracked requests</p>
              </div>
              <button
                type="button"
                className="view-all btn-with-icon"
                onClick={() => exportToCSV(requests)}
              >
                <Icon name="download" /> Download Full CSV Report
              </button>
            </div>
            <div className="progress-list">
              {availableSystems.map((sys) => {
                const count = requests.filter((r) => r.system === sys).length;
                const pct = requests.length ? (count / requests.length) * 100 : 0;
                return (
                  <div className="progress-item" key={sys}>
                    <div className="progress-info">
                      <strong>{sys}</strong>
                      <span>{count} total requests ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SETTINGS VIEW */}
        {screen === "settings" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>Data & Storage Settings</h2>
                <p>Changes are automatically saved in your browser's local storage.</p>
              </div>
            </div>
            <button type="button" className="view-all secondary" onClick={handleResetDemoData}>
              Reset to Default Sample Data
            </button>
          </section>
        )}
      </main>

      <NewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddRequest}
        systems={availableSystems}
        nextId={nextRequestId}
      />
    </div>
  );
}

export default App;