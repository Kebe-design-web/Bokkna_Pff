export default function ParamsScreen() {
  return (
    <div>
      <div className="card">
        <div className="card-title"><i className="ti ti-user" /> Mon profil</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div className="avatar" style={{ width: 52, height: 52, fontSize: 18 }}>AM</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Amadou Mbaye</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>CNIE : 12345678901234</div>
            <span className="badge badge-green" style={{ marginTop: 4, display: "inline-block" }}>
              Identité vérifiée
            </span>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Langue d'interface</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="lang-btn active-lang">Français</button>
            <button className="lang-btn">Wolof</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><i className="ti ti-shield" /> Sécurité</div>
        <div className="info-bar" style={{ marginBottom: 10 }}>
          <i className="ti ti-lock" />
          <span>Chiffrement AES-256 actif — aucune intrusion détectée</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          Votre anonymat est garanti. Vos données ne sont jamais partagées.
        </div>
      </div>
    </div>
  );
}