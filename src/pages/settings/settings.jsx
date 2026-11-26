import "./settings.css";

function Settings({ onResetData }) {
  return (
    <section className="content-card settings-section">
      <div className="section-header">
        <div>
          <h2>Data & Storage Settings</h2>
          <p>Changes are automatically saved in your browser's local storage.</p>
        </div>
      </div>
      <button type="button" className="view-all secondary" onClick={onResetData}>
        Reset to Default Sample Data
      </button>
    </section>
  );
}

export default Settings;
