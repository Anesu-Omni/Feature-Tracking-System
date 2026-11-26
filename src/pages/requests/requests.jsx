import Icon from "../../components/Icon/Icon";
import RequestTable from "../../components/RequestTable/RequestTable";
import { exportToCSV } from "../../utils/requestHelpers";
import "./requests.css";

function Requests({
  requests,
  permissions,
  requestView,
  periodLabel,
  systems,
  availableMonths,
  searchQuery,
  onSearchChange,
  monthFilter,
  onMonthChange,
  systemFilter,
  onSystemChange,
  onFilterChange,
  onBack,
  onStatusChange,
  onAssignDeveloper,
  onDelete,
}) {
  return (
    <section className="content-card all-requests-section">
      <div className="section-header">
        <div>
          <h2>{requestView.title}</h2>
          <p>
            Showing {requests.length} requests for {periodLabel}
            {systemFilter === "All" ? "" : ` in ${systemFilter}`}
          </p>
        </div>
        <div className="request-actions">
          <button
            className="view-all secondary btn-with-icon"
            type="button"
            onClick={() => exportToCSV(requests)}
          >
            <Icon name="download" /> Export CSV
          </button>
          <button className="view-all" type="button" onClick={onBack}>
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
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </label>

        <label className="filter-field" htmlFor="monthFilter">
          <span>Month</span>
          <select id="monthFilter" value={monthFilter} onChange={(e) => onMonthChange(e.target.value)}>
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
          <select id="systemFilter" value={systemFilter} onChange={(e) => onSystemChange(e.target.value)}>
            <option value="All">All systems</option>
            {systems.map((system) => (
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
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="In Testing">In Testing</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <label className="filter-field" htmlFor="priorityFilterRequests">
          <span>Priority</span>
          <select
            id="priorityFilterRequests"
            value={requestView.priority}
            onChange={(e) => onFilterChange("priority", e.target.value)}
          >
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
      </div>

      <RequestTable
        requests={requests}
        permissions={permissions}
        onStatusChange={onStatusChange}
        onAssignDeveloper={onAssignDeveloper}
        onDelete={onDelete}
      />
    </section>
  );
}

export default Requests;
