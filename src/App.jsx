
import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedPriority, setSelectedPriority] = useState("All");

  // Dashboard statistics
  const stats = [
    {
      title: "Total Requests",
      count: 128,
      icon: "📋",
      color: "blue",
    },
    {
      title: "Pending",
      count: 24,
      icon: "⏳",
      color: "orange",
    },
    {
      title: "In Progress",
      count: 36,
      icon: "⚙️",
      color: "purple",
    },
    {
      title: "Completed",
      count: 68,
      icon: "✓",
      color: "green",
    },
  ];

  // Requests currently being implemented, grouped by priority
  const progressData = [
    {
      priority: "High",
      requests: 12,
      percentage: 33.33,
      color: "#e74c3c",
    },
    {
      priority: "Medium",
      requests: 16,
      percentage: 44.44,
      color: "#f39c12",
    },
    {
      priority: "Low",
      requests: 8,
      percentage: 22.23,
      color: "#3498db",
    },
  ];

  // Sample recent requests
  const recentRequests = [
    {
      id: "FR-001",
      title: "Add PDF payslip download",
      system: "Payroll Management System",
      priority: "High",
      status: "In Progress",
    },
    {
      id: "FR-002",
      title: "Improve login functionality",
      system: "HR Management System",
      priority: "Medium",
      status: "Pending",
    },
    {
      id: "FR-003",
      title: "Add employee search feature",
      system: "HR Management System",
      priority: "Low",
      status: "Completed",
    },
    {
      id: "FR-004",
      title: "Update payment processing",
      system: "Payroll Management System",
      priority: "High",
      status: "In Progress",
    },
  ];

  // Filter progress by priority
  const filteredProgress = progressData.filter((item) => {
    return (
      selectedPriority === "All" ||
      item.priority === selectedPriority
    );
  });

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span>◆</span> FeatureTrack
        </div>

        <p className="menu-heading">MAIN MENU</p>

        <nav>
          <a href="#" className="active">▦ Dashboard</a>
          <a href="#">☷ Feature Requests</a>
          <a href="#">▣ Systems</a>
          <a href="#">♙ Users</a>
          <a href="#">▤ Reports</a>
          <a href="#">⚙ Settings</a>
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <small>System Admin</small>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Top Header */}
        <header className="top-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Administrator!</p>
          </div>

          <div className="header-right">
            <span className="notification">🔔</span>
            <div className="profile">
              <div className="avatar">D</div>
              <span>DEV</span>
            </div>
          </div>
        </header>

        {/* Statistics Cards */}
        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className={`stat-icon ${stat.color}`}>
                {stat.icon}
              </div>

              <div>
                <p>{stat.title}</p>
                <h2>{stat.count}</h2>
              </div>
            </div>
          ))}
        </section>

        {/* Request Progress */}
        <section className="content-card progress-section">

          <div className="section-header">
            <div>
              <h2>Request Progress</h2>
              <p>In-progress requests grouped by priority</p>
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
              <div className="progress-item" key={item.priority}>

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

              </div>
            ))}
          </div>

          <div className="progress-total">
            Total in-progress requests: <strong>36</strong>
          </div>
        </section>

        {/* Recent Requests Table */}
        <section className="content-card requests-section">

          <div className="section-header">
            <div>
              <h2>Recent Feature Requests</h2>
              <p>Overview of recently submitted requests</p>
            </div>

            <button className="view-all">
              View All
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Request Title</th>
                  <th>System</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.title}</td>
                    <td>{request.system}</td>

                    <td>
                      <span
                        className={`priority ${request.priority.toLowerCase()}`}
                      >
                        {request.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status ${request.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

      </main>
    </div>
  );
}

export default App;
