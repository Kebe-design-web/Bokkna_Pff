export default function HomeScreen({ onNavigate }) {
  return (
    <div>
      <div className="election-header">
        <div>
          <div className="el-title">Présidentielle 2026</div>
          <div className="el-sub">Election en cours · 02h 15min restantes</div>
        </div>
        <div className="el-badge">EN COURS</div>
      </div>

      <div className="info-bar">
        <i className="ti ti-shield-check" />
        <span>Vous n'avez <strong>pas encore voté</strong> — votre anonymat est garanti</span>
      </div>

      <div className="action-grid">
        <div className="action-card" onClick={() => onNavigate("vote")}>
          <div className="action-icon"><i className="ti ti-checkbox" /></div>
          <div>
            <div className="action-label">Voter</div>
            <div className="action-sub">Présidentielle 2026</div>
          </div>
        </div>

        <div className="action-card" onClick={() => onNavigate("results")}>
          <div className="action-icon"><i className="ti ti-chart-bar" /></div>
          <div>
            <div className="action-label">Résultats</div>
            <div className="action-sub">Temps réel</div>
          </div>
        </div>

        <div className="action-card" onClick={() => onNavigate("params")}>
          <div className="action-icon"><i className="ti ti-settings" /></div>
          <div>
            <div className="action-label">Paramètres</div>
            <div className="action-sub">Mon compte</div>
          </div>
        </div>

        <div className="action-card">
          <div className="action-icon"><i className="ti ti-help" /></div>
          <div>
            <div className="action-label">Aide</div>
            <div className="action-sub">Support</div>
          </div>
        </div>

        <div className="action-card" onClick={() => onNavigate("admin")}>
          <div className="action-icon" style={{background:'#fef9e0', color:'#d69e2e'}}>
            <i className="ti ti-shield-lock" />
          </div>
          <div>
            <div className="action-label">Admin</div>
            <div className="action-sub">Tableau de bord</div>
          </div>
        </div>

      </div>
    </div>
  );
}