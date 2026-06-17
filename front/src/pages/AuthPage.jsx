import { useState } from "react";
import "../styles/AuthPage.css";

const STEPS = { CNIE: 1, OTP: 2, SUCCESS: 3 };

export default function AuthPage({ onSuccess, onRegister }) {
  const [step, setStep] = useState(STEPS.CNIE);
  const [cnie, setCnie] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);

  const handleOtp = (val, idx) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 3) {
      document.getElementById(`otp-${idx + 1}`).focus();
    }
  };

  const handleCnieSubmit = () => {
    if (cnie.length < 8) { setError(true); return; }
    setError(false);
    setStep(STEPS.OTP);
  };

  const handleOtpSubmit = () => {
    setStep(STEPS.SUCCESS);
  };

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Header */}
        <div className="auth-header">
          <div className="logo-flag">
            <div className="flag-green" />
            <div className="flag-yellow">
              <span className="flag-star">★</span>
            </div>
            <div className="flag-red" />
          </div>
          <div className="brand">
            <div className="brand-name">BOKKNA</div>
            <div className="brand-sub">Plateforme de vote sécurisée</div>
          </div>
        </div>

        <div className="auth-body">
          {/* Barre de progression */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* ÉTAPE 1 : CNIE */}
          {step === STEPS.CNIE && (
            <div className="step">
              <div className="step-title">Authentification</div>
              <div className="step-sub">Entrez votre numéro de CNIE pour continuer</div>
              <label htmlFor="cnie">Numéro CNIE</label>
              <input
                id="cnie"
                type="text"
                placeholder="12345678901234"
                maxLength={14}
                value={cnie}
                onChange={(e) => setCnie(e.target.value)}
                className={error ? "input-error" : ""}
              />
              {error && <div className="error-msg">Numéro CNIE invalide</div>}
              <button className="btn-primary" onClick={handleCnieSubmit}>
                Recevoir code OTP
              </button>
              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">ou</span>
                <div className="divider-line" />
              </div>
              <button className="btn-outline" onClick={onRegister}>S'inscrire</button>
              <div className="lang-section">
                <div className="lang-label">Langue / Làkk</div>
                <div className="lang-row">
                  <button className="lang-btn">Français</button>
                  <button className="lang-btn">Wolof</button>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : OTP */}
          {step === STEPS.OTP && (
            <div className="step">
              <button className="back-btn" onClick={() => setStep(STEPS.CNIE)}>
                <i className="ti ti-arrow-left" /> Retour
              </button>
              <div className="step-title">Code OTP</div>
              <div className="step-sub">Code reçu par SMS au numéro lié à votre CNIE</div>
              <div className="otp-hint">Saisissez les 4 chiffres reçus par SMS</div>
              <div className="otp-row">
                {otp.map((val, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    className={`otp-box ${val ? "filled" : ""}`}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtp(e.target.value, idx)}
                  />
                ))}
              </div>
              <div className="resend-text">
                Vous n'avez pas reçu le code ?{" "}
                <span className="resend-link">Renvoyer</span>
              </div>
              <button className="btn-primary" onClick={handleOtpSubmit}>
                Valider
              </button>
              <button className="btn-red" onClick={() => setStep(STEPS.CNIE)}>
                Annuler
              </button>
            </div>
          )}

          {/* ÉTAPE 3 : SUCCÈS */}
          {step === STEPS.SUCCESS && (
            <div className="step">
              <div className="success-icon">✅</div>
              <div className="step-title" style={{ textAlign: "center" }}>
                Authentification réussie
              </div>
              <div className="success-msg">
                Bienvenue, <strong>Amadou M.</strong>
              </div>
              <div className="success-info">
                <i className="ti ti-shield-check" /> Identité vérifiée avec succès
              </div>
              <button className="btn-primary" onClick={onSuccess}>
                Accéder au tableau de bord
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}