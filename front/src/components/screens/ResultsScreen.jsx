const results = [
  { name: "Diallo Kouyaté", percent: 43, color: "#2d7a4f" },
  { name: "Aminata Fall", percent: 31, color: "#c0392b" },
  { name: "Moussa Ndiaye", percent: 26, color: "#d4a017" },
];

export default function ResultsScreen() {
  return (
    <div>
      <div className="card">
        <div className="card-title">
          <i className="ti ti-chart-bar" /> Résultats en temps réel
          <span className="badge badge-green" style={{ marginLeft: "auto" }}>14 238 votes</span>
        </div>
        {results.map((r, idx) => (
          <div key={idx} className="result-bar-wrap">
            <div className="result-label">
              <span>{r.name}</span>
              <span style={{ fontWeight: 600, color: r.color }}>{r.percent}%</span>
            </div>
            <div className="result-bar">
              <div className="result-fill" style={{ width: `${r.percent}%`, background: r.color }} />
            </div>
          </div>
        ))}
        <div className="result-note">Résultats officiels après clôture du scrutin</div>
      </div>

      <div className="card">
        <div className="card-title"><i className="ti ti-clock" /> Statistiques</div>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-num" style={{ color: "#2d7a4f" }}>12 842</div>
            <div className="stat-label">Votes valides</div>
          </div>
          <div className="stat-box">
            <div className="stat-num" style={{ color: "#c0392b" }}>1 396</div>
            <div className="stat-label">Votes invalides</div>
          </div>
        </div>
      </div>
    </div>
  );
}