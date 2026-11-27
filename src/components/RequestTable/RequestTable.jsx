import { useState, useMemo, useId } from "react";
import Icon from "../Icon/Icon";
import "./RequestTable.css";

const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };

function RequestDetailsDialog({ request, onClose }) {
  const titleId = useId();
  const createdAt = new Date(request.createdAt);

  return (
    <div className="request-detail-backdrop" onClick={onClose}>
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="request-detail-dialog"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
        role="dialog"
      >
        <header className="request-detail-header">
          <div>
            <p className="request-detail-id">{request.id}</p>
            <h2 id={titleId}>{request.title}</h2>
          </div>
          <button
            aria-label="Close feature details"
            autoFocus
            className="icon-btn"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </header>

        <dl className="request-detail-grid">
          <div>
            <dt>System</dt>
            <dd>{request.system}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{request.status}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>{request.priority}</dd>
          </div>
          <div>
            <dt>Requested by</dt>
            <dd>{request.requester || "Not specified"}</dd>
          </div>
          <div>
            <dt>Assigned developer</dt>
            <dd>{request.assignedDeveloper || "Unassigned"}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>
              {Number.isNaN(createdAt.getTime())
                ? "Unknown"
                : createdAt.toLocaleString()}
            </dd>
          </div>
        </dl>

        <section className="request-detail-description">
          <h3>Description</h3>
          <p>
            {request.description || "No description was provided for this request."}
          </p>
        </section>

        <div className="request-detail-actions">
          <button className="view-all" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

function RequestTable({
  requests,
  onDelete,
  permissions = {},
  showActions = true,
}) {
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const canDeleteRequest = permissions.canDeleteRequest ?? true;
  const selectedRequest = requests.find((request) => request.id === selectedRequestId);

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      let comparison;
      if (sortConfig.key === "createdAt") {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortConfig.key === "priority") {
        comparison = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      } else {
        comparison = String(a[sortConfig.key] || "").localeCompare(
          String(b[sortConfig.key] || ""),
        );
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
    <>
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
            <th>Assigned Dev</th>
            <th className="sortable" onClick={() => handleSort("priority")}>
              Priority {sortArrow("priority")}
            </th>
            <th>Status</th>
            <th className="sortable" onClick={() => handleSort("createdAt")}>
              Date {sortArrow("createdAt")}
            </th>
            {showActions && canDeleteRequest && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedRequests.map((request) => (
            <tr key={request.id}>
              <td className="mono-id">{request.id}</td>
              <td>
                <div className="title-cell">
                  <button
                    className="request-title-link"
                    onClick={() => setSelectedRequestId(request.id)}
                    type="button"
                  >
                    {request.title}
                  </button>
                  {request.requester && <small>Requested by {request.requester}</small>}
                </div>
              </td>
              <td>{request.system}</td>
              <td>
                <span className="assigned-dev-label">
                  {request.assignedDeveloper || "Unassigned"}
                </span>
              </td>
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
                {new Date(request.createdAt).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              {showActions && canDeleteRequest && (
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
    {selectedRequest && (
      <RequestDetailsDialog
        onClose={() => setSelectedRequestId(null)}
        request={selectedRequest}
      />
    )}
    </>
  );
}

export default RequestTable;
