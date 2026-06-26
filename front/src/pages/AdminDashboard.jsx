import { useState } from "react";
import "../styles/AdminDashboard.css";

const SCREENS = {
  dashboard: "Tableau de bord",
  results: "Résultats",
  audit: "Audit et Sécurité",
  reports: "Rapports",
  params: "Paramètres",
};

const results = [
  { name: "Abdou Diallo", percent: 43, color: "#2d7a4f" },
  { name: "Amadou Fall", percent: 31, color: "#e8c832" },
  { name: "Moussa Ndiaye", percent: 26, color: "#c0392b" },
];

const voteHistory = [
  { id: "#A7F29", time: "10:42" },
  { id: "#C3D81", time: "10:36" },
  { id: "#B9E04", time: "10:31" },
];

export default function AdminDashboard({ onLogout }) {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sb-logo">
  <div style={{ width: 42, height: 28, borderRadius: 4, overflow: "hidden", display: "flex", flexShrink: 0 }}>
    <div style={{ flex: 1, background: "#00853F" }} />
    <div style={{ flex: 1, background: "#FDEF42", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#00853F", fontSize: 12, lineHeight: 1 }}>★</span>
    </div>
    <div style={{ flex: 1, background: "#E31B23" }} />
  </div>
  <div>
    <div className="admin-brand">Plateforme</div>
    <div className="admin-brand-sub">de vote citoyen</div>
  </div>
</div>

        <nav className="admin-sb-nav">
          {[
            { id: "dashboard", icon: "ti-layout-dashboard", label: "Tableau de bord" },
            { id: "results", icon: "ti-chart-bar", label: "Résultats" },
            { id: "audit", icon: "ti-shield-check", label: "Audit et Sécurité" },
            { id: "reports", icon: "ti-file-description", label: "Rapports" },
            { id: "params", icon: "ti-settings", label: "Paramètres" },
            { id: "help", icon: "ti-help", label: "Aide et Support" },
          ].map((item) => (
            <div
              key={item.id}
              className={`admin-nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              <i className={`ti ${item.icon}`} />
              {item.label}
            </div>
          ))}
        </nav>

        <div className="admin-sb-footer">
          <div className="anon-badge">
            <i className="ti ti-shield" />
            <div>
              <div className="anon-title">Votre anonymat est sécurisé</div>
              <div className="anon-sub">Merci pour votre participation citoyenne</div>
            </div>
          </div>
          <div className="admin-nav-item logout" onClick={onLogout}>
            <i className="ti ti-logout" /> Déconnexion
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <i className="ti ti-menu-2 admin-menu-icon" />
            <div className="admin-tb-title">{SCREENS[active] || "Tableau de bord"}</div>
          </div>
          <div className="admin-topbar-right">
            <div className="notif-btn">
              <i className="ti ti-bell" />
              <span className="notif-dot" />
            </div>
            <div className="admin-user">
              <div className="admin-avatar">
                <i className="ti ti-user" />
              </div>
              <span className="admin-user-name">Citoyen anonyme</span>
              <i className="ti ti-chevron-down" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          <div className="admin-grid">

            {/* Colonne gauche : Résultats */}
            <div className="admin-col-left">
              <div className="admin-card">
                <div className="admin-card-title">Résultats</div>
                <div className="admin-card-sub">En temps réel — 14 238 votes</div>

                {results.map((r, idx) => (
                  <div key={idx} className="result-item">
                    <div className="result-row">
                      <span className="result-name">{r.name}</span>
                      <span className="result-percent" style={{ color: r.color }}>
                        {r.percent}%
                      </span>
                    </div>
                    <div className="result-track">
                      <div
                        className="result-fill"
                        style={{ width: `${r.percent}%`, background: r.color }}
                      />
                    </div>
                  </div>
                ))}

                <div className="results-note">
                  <div className="results-note-icon">📊</div>
                  <div>Résultats officiels après cloture du scrutin</div>
                </div>
              </div>

              {/* Stats bas */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-icon blue"><i className="ti ti-users" /></div>
                  <div className="stat-num">14 238</div>
                  <div className="stat-label">Total des votes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green"><i className="ti ti-circle-check" /></div>
                  <div className="stat-num">12 842</div>
                  <div className="stat-label">Votes valides</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon red"><i className="ti ti-circle-minus" /></div>
                  <div className="stat-num">1 396</div>
                  <div className="stat-label">Votes invalides</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange"><i className="ti ti-clock" /></div>
                  <div className="stat-num">02:15:47</div>
                  <div className="stat-label">Temps restant</div>
                </div>
              </div>
            </div>

            {/* Colonne droite : Audit */}
            <div className="admin-col-right">
              <div className="admin-card">
                <div className="admin-card-title">Audit et Sécurité</div>

                <div className="audit-section-title">Historique des votes (anonyme)</div>
                {voteHistory.map((v, idx) => (
                  <div key={idx} className="vote-history-row">
                    <div className="vote-dot green-dot" />
                    <span className="vote-id">vote enregistré {v.id}</span>
                    <span className="vote-time">{v.time}</span>
                  </div>
                ))}

                <div className="audit-section-title" style={{ marginTop: 20 }}>
                  Journaux de sécurité
                </div>
                <div className="security-row">
                  <div className="vote-dot green-dot" />
                  <span>chiffrement actif AES-256</span>
                </div>
                <div className="security-row">
                  <div className="vote-dot green-dot" />
                  <span>Aucune intrusion détectée</span>
                </div>

                <div className="system-badge">
                  <div className="system-badge-icon">
                    <i className="ti ti-shield-check" />
                  </div>
                  <div>
                    <div className="system-badge-title">Système vérifié et opérationnel</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}