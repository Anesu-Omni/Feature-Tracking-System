
import { useState } from "react";
import "./App.css";

function Icon({ name }) {
  const paths = {
    activity: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    dashboard: <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="5" rx="1" /><rect x="13" y="10" width="8" height="11" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    reports: <><path d="M3 3v18h18" /><path d="M18 17V9M13 17V5M8 17v-3" /></>,
    requests: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    settings: <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" /><path d="M2 14h4M10 8h4M18 16h4" /></>,
    systems: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
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

function RequestTable({ requests }) {
  if (requests.length === 0) {
    return <p className="empty-requests">No requests match this status this month.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Request Title</th>
            <th>System</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.title}</td>
              <td>{request.system}</td>
              <td>
                <span className={`priority ${request.priority.toLowerCase()}`}>
                  {request.priority}
                </span>
              </td>
              <td>
                <span className={`status ${request.status.toLowerCase().replace(" ", "-")}`}>
                  {request.status}
                </span>
              </td>
              <td>
                {request.createdAt.toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getRequestViewTitle(status, priority) {
  const filters = [];
  if (status !== "All") filters.push(status);
  if (priority !== "All") filters.push(`${priority} Priority`);
  return filters.length ? `${filters.join(" ")} Requests` : "All Requests";
}

function App() {
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [screen, setScreen] = useState("dashboard");
  const [monthFilter, setMonthFilter] = useState(() => getMonthKey(new Date()));
  const [systemFilter, setSystemFilter] = useState("All");
  const [requestView, setRequestView] = useState({
    title: "All Requests",
    status: "All",
    priority: "All",
  });

  const now = new Date();
  const dateForMonth = (monthOffset, day) =>
    new Date(now.getFullYear(), now.getMonth() + monthOffset, day);
  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(now);

  const requests = [
    { id: "FR-001", title: "Add PDF payslip download", system: "Payroll Management System", priority: "High", status: "Completed", createdAt: dateForMonth(0, 2) },
    { id: "FR-002", title: "Improve login functionality", system: "HR Management System", priority: "Medium", status: "Completed", createdAt: dateForMonth(0, 4) },
    { id: "FR-003", title: "Add employee search feature", system: "HR Management System", priority: "Low", status: "Completed", createdAt: dateForMonth(0, 6) },
    { id: "FR-004", title: "Update payment processing", system: "Payroll Management System", priority: "High", status: "Completed", createdAt: dateForMonth(0, 8) },
    { id: "FR-005", title: "Add leave balance report", system: "HR Management System", priority: "Medium", status: "Completed", createdAt: dateForMonth(0, 10) },
    { id: "FR-006", title: "Automate payroll deductions", system: "Payroll Management System", priority: "High", status: "Completed", createdAt: dateForMonth(0, 12) },
    { id: "FR-007", title: "Improve onboarding checklist", system: "HR Management System", priority: "Low", status: "Completed", createdAt: dateForMonth(0, 16) },
    { id: "FR-008", title: "Add audit history", system: "Payroll Management System", priority: "Medium", status: "Completed", createdAt: dateForMonth(0, 19) },
    { id: "FR-009", title: "Add manager payroll approvals", system: "Payroll Management System", priority: "High", status: "In Progress", createdAt: dateForMonth(0, 21) },
    { id: "FR-010", title: "Create a team calendar", system: "HR Management System", priority: "Medium", status: "Pending", createdAt: dateForMonth(0, 23) },
    { id: "FR-011", title: "Add overtime rules", system: "Payroll Management System", priority: "Low", status: "Completed", createdAt: dateForMonth(-1, 12) },
    { id: "FR-012", title: "Add employee profile fields", system: "HR Management System", priority: "Low", status: "In Progress", createdAt: dateForMonth(-1, 18) },
    { id: "FR-013", title: "Add overtime approval workflow", system: "Payroll Management System", priority: "Medium", status: "Completed", createdAt: dateForMonth(-2, 9) },
    { id: "FR-014", title: "Add team leave calendar", system: "HR Management System", priority: "High", status: "Pending", createdAt: dateForMonth(-3, 14) },
  ];

  const availableMonths = [...new Set(requests.map((request) => getMonthKey(request.createdAt)))]
    .sort((a, b) => b.localeCompare(a))
    .map((key) => {
      const [year, month] = key.split("-").map(Number);
      return {
        value: key,
        label: new Intl.DateTimeFormat("en", {
          month: "long",
          year: "numeric",
        }).format(new Date(year, month - 1, 1)),
      };
    });
  const selectedMonth = availableMonths.find((month) => month.value === monthFilter);
  const periodLabel = monthFilter === "all" ? "all months" : selectedMonth?.label ?? monthLabel;
  const availableSystems = [...new Set(requests.map((request) => request.system))].sort();

  const currentMonthRequests = requests.filter(
    (request) =>
      request.createdAt.getMonth() === now.getMonth() &&
      request.createdAt.getFullYear() === now.getFullYear(),
  );
  const requestCounts = currentMonthRequests.reduce(
    (counts, request) => {
      counts[request.status] += 1;
      return counts;
    },
    { Pending: 0, "In Progress": 0, Completed: 0 },
  );
  const stats = [
    { title: "Requests this month", count: currentMonthRequests.length, view: { title: "All Requests" }, icon: "file", color: "blue" },
    { title: "Pending", count: requestCounts.Pending, view: { title: "Pending Requests", status: "Pending" }, icon: "clock", color: "orange" },
    { title: "In Progress", count: requestCounts["In Progress"], view: { title: "In Progress Requests", status: "In Progress" }, icon: "activity", color: "purple" },
    { title: "Completed", count: requestCounts.Completed, view: { title: "Completed Requests", status: "Completed" }, icon: "check", color: "green" },
  ];

  const priorityColors = { High: "#174b84", Medium: "#3478b9", Low: "#3679b7" };
  const progressData = ["High", "Medium", "Low"].map((priority) => {
    const count = currentMonthRequests.filter(
      (request) => request.priority === priority,
    ).length;

    return {
      priority,
      requests: count,
      percentage: currentMonthRequests.length
        ? (count / currentMonthRequests.length) * 100
        : 0,
      color: priorityColors[priority],
    };
  });

  const recentRequests = [...currentMonthRequests]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);
  const filteredRequests = requests
    .filter(
      (request) =>
        (monthFilter === "all" || getMonthKey(request.createdAt) === monthFilter) &&
        (systemFilter === "All" || request.system === systemFilter) &&
        (requestView.status === "All" || request.status === requestView.status) &&
        (requestView.priority === "All" || request.priority === requestView.priority),
    )
    .sort((a, b) => b.createdAt - a.createdAt);
  const isAllRequestsView =
    requestView.status === "All" &&
    requestView.priority === "All" &&
    systemFilter === "All" &&
    monthFilter === getMonthKey(now);

  // Filter progress by priority
  const filteredProgress = progressData.filter((item) => {
    return (
      selectedPriority === "All" ||
      item.priority === selectedPriority
    );
  });

  const openRequests = (view = {}) => {
    setRequestView({
      title: "All Requests",
      status: "All",
      priority: "All",
      ...view,
    });
    setMonthFilter(getMonthKey(now));
    setSystemFilter("All");
    setScreen("requests");
  };
  const updateRequestFilter = (key, value) => {
    setRequestView((current) => {
      const updated = { ...current, [key]: value };
      return {
        ...updated,
        title: getRequestViewTitle(updated.status, updated.priority),
      };
    });
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span>FTS</span> Feature Tracking System
        </div>

        <p className="menu-heading">MAIN MENU</p>

        <nav>
          <a
            href="#dashboard"
            className={screen === "dashboard" ? "active" : ""}
            aria-current={screen === "dashboard" ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              setScreen("dashboard");
            }}
          >
            <Icon name="dashboard" /> Dashboard
          </a>
          <a
            href="#requests"
            className={screen !== "dashboard" ? "active" : ""}
            aria-current={screen !== "dashboard" ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              openRequests();
            }}
          >
            <Icon name="requests" /> Feature Requests
          </a>
          <a href="#"><Icon name="systems" /> Systems</a>
          <a href="#"><Icon name="users" /> Users</a>
          <a href="#"><Icon name="reports" /> Reports</a>
          <a href="#"><Icon name="settings" /> Settings</a>
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">HV</div>
          <div>
            <strong>Hellington Vunganayi</strong>
            <small>System Admin</small>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Top Header */}
        <header className="top-header">
          <div>
            <h1>{screen === "dashboard" ? "Dashboard" : requestView.title}</h1>
            <p>
              {screen === "dashboard"
                ? `Welcome back, Hellington Vunganayi. Here is your ${monthLabel} overview.`
                : `Showing ${filteredRequests.length} requests for ${periodLabel}${systemFilter === "All" ? "." : ` in ${systemFilter}.`}`}
            </p>
          </div>

          <div className="header-right">
            <svg
              className="notification"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Notifications"
            >
              <path
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="profile">
              <div className="avatar">HV</div>
              <span>Hellington Vunganayi</span>
            </div>
          </div>
        </header>

        {screen === "dashboard" ? (
          <>
        {/* Statistics Cards */}
        <section className="stats-grid">
          {stats.map((stat) => (
            <button
              className="stat-card"
              key={stat.title}
              type="button"
              onClick={() => openRequests(stat.view)}
              aria-label={`View ${stat.count} ${stat.title.toLowerCase()} for ${monthLabel}`}
            >
              <div className={`stat-icon ${stat.color}`}>
                <Icon name={stat.icon} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h2>{stat.count}</h2>
              </div>
            </button>
          ))}
        </section>

        {/* Current-month request distribution */}
        <section className="content-card progress-section">

          <div className="section-header">
            <div>
              <h2>Requests by Priority</h2>
              <p>{monthLabel} requests grouped by priority</p>
            </div>

            <div className="filter-container">
              <label htmlFor="priorityFilter">
                Filter by Priority:
              </label>

              <select
                id="priorityFilter"
                value={selectedPriority}
                onChange={(e) =>
                  setSelectedPriority(e.target.value)
                }
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
                aria-label={`View ${item.requests} ${item.priority.toLowerCase()} priority requests`}
              >

                <div className="progress-info">
                  <strong>{item.priority} Priority</strong>

                  <span>
                    {item.requests} requests (
                    {item.percentage.toFixed(1)}%)
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>

              </button>
            ))}
          </div>

          <div className="progress-total">
            Total requests this month: <strong>{currentMonthRequests.length}</strong>
          </div>
        </section>

        {/* Recent requests this month */}
        <section className="content-card requests-section">

          <div className="section-header">
            <div>
              <h2>Recent Feature Requests</h2>
              <p>Latest requests submitted in {monthLabel}</p>
            </div>

            <button className="view-all" type="button" onClick={() => openRequests()}>
              View All Requests
            </button>
          </div>

          <RequestTable requests={recentRequests} />

        </section>

          </>
        ) : (
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
                {!isAllRequestsView && (
                  <button
                    className="view-all secondary"
                    type="button"
                    onClick={() => openRequests()}
                  >
                    All Requests
                  </button>
                )}
                <button
                  className="view-all"
                  type="button"
                  onClick={() => setScreen("dashboard")}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
            <div className="request-filters">
              <label className="filter-field" htmlFor="monthFilter">
                <span>Month</span>
                <select
                  id="monthFilter"
                  value={monthFilter}
                  onChange={(event) => setMonthFilter(event.target.value)}
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
                  onChange={(event) => setSystemFilter(event.target.value)}
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
                  onChange={(event) => updateRequestFilter("status", event.target.value)}
                >
                  <option value="All">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
              <label className="filter-field" htmlFor="priorityFilterRequests">
                <span>Priority</span>
                <select
                  id="priorityFilterRequests"
                  value={requestView.priority}
                  onChange={(event) => updateRequestFilter("priority", event.target.value)}
                >
                  <option value="All">All priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>
            </div>
            <RequestTable requests={filteredRequests} />
          </section>
        )}

      </main>
    </div>
  );
}

export default App;