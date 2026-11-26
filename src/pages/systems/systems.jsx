import Icon from "../../components/Icon/Icon";
import "./systems.css";

function Systems({ requests, systems, onViewSystemRequests }) {
  return (
    <section className="systems-grid">
      {systems.map((sys) => {
        const sysReqs = requests.filter((r) => r.system === sys);
        const completedCount = sysReqs.filter((r) => r.status === "Completed").length;
        const openCount = sysReqs.filter((r) => r.status !== "Completed").length;
        const completionPercentage = sysReqs.length
          ? Math.round((completedCount / sysReqs.length) * 100)
          : 0;
        return (
          <div className="content-card system-card" key={sys}>
            <div className="system-card-top">
              <div className="stat-icon blue"><Icon name="systems" /></div>
              <span className={`status ${completionPercentage === 100 && sysReqs.length ? "completed" : "in-progress"}`}>
                {sysReqs.length ? `${completedCount}/${sysReqs.length} implemented` : "No features"}
              </span>
            </div>
            <h3>{sys}</h3>
            <p className="sys-meta">
              Total Features: <strong>{sysReqs.length}</strong> • Incomplete: <strong>{openCount}</strong>
            </p>
            <div className="system-progress-label">
              <span>Implementation progress</span>
              <strong>{completionPercentage}%</strong>
            </div>
            <div
              aria-label={`${sys} feature implementation progress`}
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow={completionPercentage}
              className="system-progress-track"
              role="progressbar"
            >
              <div
                className="system-progress-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
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
