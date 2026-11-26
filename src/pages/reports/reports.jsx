import Icon from "../../components/Icon/Icon";
import { exportToCSV } from "../../utils/requestHelpers";
import "./reports.css";

function Reports({ requests, systems }) {
  return (
    <section className="content-card reports-section">
      <div className="section-header">
        <div>
          <h2>Feature Delivery Summary</h2>
          <p>All-time breakdown across {requests.length} tracked requests</p>
        </div>
        <button type="button" className="view-all btn-with-icon" onClick={() => exportToCSV(requests)}>
          <Icon name="download" /> Download Full CSV Report
        </button>
      </div>
      <div className="progress-list">
        {systems.map((sys) => {
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
  );
}

export default Reports;
