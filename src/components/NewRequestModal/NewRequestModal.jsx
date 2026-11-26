import { useState } from "react";
import Icon from "../Icon/Icon";
import "./NewRequestModal.css";

function NewRequestModal({
  isOpen,
  onClose,
  onAdd,
  systems,
  nextId,
  defaultRequester = "Eunice Chikondo",
}) {
  const [title, setTitle] = useState("");
  const [system, setSystem] = useState(systems[0] || "Payroll Management System");
  const [priority, setPriority] = useState("Medium");
  const [requester, setRequester] = useState(defaultRequester);

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
            <input type="text" value={requester} onChange={(e) => setRequester(e.target.value)} />
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

export default NewRequestModal;
