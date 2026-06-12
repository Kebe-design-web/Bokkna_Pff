import { useState } from "react";

const candidates = [
  { initials: "DK", name: "Diallo Kouyaté", party: "Parti Vert National", color: "#2d7a4f" },
  { initials: "AF", name: "Aminata Fall", party: "Coalition Citoyenne", color: "#c0392b" },
  { initials: "MN", name: "Moussa Ndiaye", party: "Alliance Républicaine", color: "#d4a017" },
];

export default function VoteScreen({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [voted, setVoted] = useState(false);

  const handleVote = () => {
    if (selected === null) return alert("Veuillez choisir un candidat");
    setShowModal(true);
  };

  const confirmVote = () => {
    setShowModal(false);
    setVoted(true);
  };

  if (voted) return (
    <div className="vote-success">
      <div className="success-circle">🗳️</div>
      <div className="success-title">Vote enregistré !</div>
      <div className="success-sub">Votre vote a été chiffré et enregistré de façon anonyme.</div>
      <div className="success-receipt">
        <i className="ti ti-shield-check" /> Reçu : <strong>#B9E04F</strong> · 10:47
      </div>
      <button className="btn-primary" onClick={() => onNavigate("results")}>
        Voir les résultats
      </button>
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      <div className="election-header">
        <div>
          <div className="el-title">Présidentielle 2026</div>
          <div className="el-sub">Choisissez votre candidat</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <i className="ti ti-users" /> Candidats
        </div>
        {candidates.map((c, idx) => (
          <div
            key={idx}
            className="candidate-row"
            onClick={() => setSelected(idx)}
          >
            <div className="cand-avatar" style={{ background: c.color }}>
              {c.initials}
            </div>
            <div className="cand-info">
              <div className="cand-name">{c.name}</div>
              <div className="cand-party">{c.party}</div>
            </div>
            <div className={`radio-circle ${selected === idx ? "selected" : ""}`} />
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={handleVote}>
        Voter <i className="ti ti-arrow-right" />
      </button>

      {/* Modal confirmation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-q">Confirmez votre vote</div>
            <div className="modal-sub">Êtes-vous sûr de votre choix ?</div>
            <div className="modal-cand">
              <div className="cand-avatar" style={{ background: candidates[selected].color }}>
                {candidates[selected].initials}
              </div>
              <div>
                <div className="cand-name">{candidates[selected].name}</div>
                <div className="cand-party">{candidates[selected].party}</div>
              </div>
            </div>
            <div className="modal-btns">
              <button className="btn-confirm" onClick={confirmVote}>Confirmer</button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}