import { useState } from "react";
import Icon from "../../components/Icon/Icon";
import RequestTable from "../../components/RequestTable/RequestTable";
import { formatMonthLabel } from "../../utils/requestHelpers";
import "./dashboard.css";

const PRIORITY_COLORS = { High: "#d9383a", Medium: "#2f75bd", Low: "#4a82b8" };

function Dashboard({
  requests,
  permissions,
  onOpenRequests,
  onStatusChange,
  onAssignDeveloper,
  onDelete,
}) {
  const [selectedPriority, setSelectedPriority] = useState("All");

  const now = new Date();
  const monthLabel = formatMonthLabel(now);

  const currentMonthRequests = requests.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const requestCounts = requests.reduce(
    (counts, r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
      return counts;
    },
    { Pending: 0, "In Progress": 0, Completed: 0 }
  );

  const completionRate = requests.length
    ? Math.round((requestCounts.Completed / requests.length) * 100)
    : 0;
  const currentMonthCompleted = currentMonthRequests.filter(
    (request) => request.status === "Completed",
  ).length;
  const currentMonthCompletionRate = currentMonthRequests.length
    ? Math.round((currentMonthCompleted / currentMonthRequests.length) * 100)
    : 0;

  const stats = [
    { title: "Total Features", count: requests.length, view: { title: "All Feature Requests", monthFilter: "all" }, icon: "file", color: "blue" },
    { title: "Pending", count: requestCounts.Pending, view: { title: "Pending Requests", status: "Pending", monthFilter: "all" }, icon: "clock", color: "orange" },
    { title: "In Progress", count: requestCounts["In Progress"], view: { title: "In Progress Requests", status: "In Progress", monthFilter: "all" }, icon: "activity", color: "purple" },
    { title: "Completed", count: requestCounts.Completed, subtext: `${completionRate}% rate`, view: { title: "Completed Requests", status: "Completed", monthFilter: "all" }, icon: "check", color: "green" },
  ];

  const progressData = ["High", "Medium", "Low"].map((priority) => {
    const count = currentMonthRequests.filter((r) => r.priority === priority).length;
    return {
      priority,
      requests: count,
      percentage: currentMonthRequests.length ? (count / currentMonthRequests.length) * 100 : 0,
      color: PRIORITY_COLORS[priority],
    };
  });

  const filteredProgress = progressData.filter(
    (item) => selectedPriority === "All" || item.priority === selectedPriority
  );

  const recentRequests = [...currentMonthRequests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <section className="stats-grid">
        {stats.map((stat) => (
          <button
            className="stat-card"
            key={stat.title}
            type="button"
            onClick={() => onOpenRequests(stat.view)}
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
                onOpenRequests({
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
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </button>
          ))}
        </div>

        <div className="progress-total">
          Total requests this month: <strong>{currentMonthRequests.length}</strong> • Completion rate: <strong>{currentMonthCompletionRate}%</strong>
        </div>
      </section>

      <section className="content-card requests-section">
        <div className="section-header">
          <div>
            <h2>Recent Feature Requests</h2>
            <p>Latest requests submitted in {monthLabel} (update status directly below)</p>
          </div>

          <button className="view-all" type="button" onClick={() => onOpenRequests()}>
            View All Requests
          </button>
        </div>

        <RequestTable
          requests={recentRequests}
          permissions={permissions}
          onStatusChange={onStatusChange}
          onAssignDeveloper={onAssignDeveloper}
          onDelete={onDelete}
        />
      </section>
    </>
  );
}

export default Dashboard;
