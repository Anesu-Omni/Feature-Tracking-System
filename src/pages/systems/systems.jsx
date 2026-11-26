import Icon from "../../components/Icon/Icon";
import "./systems.css";

function Systems({ requests, systems, onViewSystemRequests }) {
  return (
    <section className="systems-grid">
      {systems.map((sys) => {
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
              onClick={() => onViewSystemRequests(sys)}
            >
              Filter System Requests
            </button>
          </div>
        );
      })}
    </section>
  );
}

export default Systems;
