import { useState, useMemo } from "react";
import Icon from "../Icon/Icon";
import "./RequestTable.css";

const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };

function RequestTable({ requests, onStatusChange, onDelete, showActions = true }) {
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      let comparison;
      if (sortConfig.key === "createdAt") {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortConfig.key === "priority") {
        comparison = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
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

  const sortArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? "↑" : "↓") : "";

  if (requests.length === 0) {
    return <p className="empty-requests">No feature requests match the current filters.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort("id")}>
              ID {sortArrow("id")}
            </th>
            <th className="sortable" onClick={() => handleSort("title")}>
              Request Title {sortArrow("title")}
            </th>
            <th>System</th>
            <th className="sortable" onClick={() => handleSort("priority")}>
              Priority {sortArrow("priority")}
            </th>
            <th>Status</th>
            <th className="sortable" onClick={() => handleSort("createdAt")}>
              Date {sortArrow("createdAt")}
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

export default RequestTable;
