import { useState } from "react";
import "../styles/AuthPage.css";
import RegisterPage from "./RegisterPage";

const STEPS = { CNIE: 1, OTP: 2, SUCCESS: 3 };

const TRANSLATIONS = {
  fr: {
    brandSub: "Plateforme de vote sécurisée",
    stepTitle1: "Authentification",
    stepSub1: "Entrez votre numéro de CNIE pour continuer",
    cnieLabel: "Numéro CNIE",
    cniePlaceholder: "12345678901234",
    cnieError: "Numéro CNIE invalide",
    btnOtp: "Recevoir code OTP",
    or: "ou",
    btnRegister: "S'inscrire",
    langLabel: "Langue / Làkk",
    stepTitle2: "Code OTP",
    stepSub2: "Code reçu par SMS au numéro lié à votre CNIE",
    otpHint: "Saisissez les 4 chiffres reçus par SMS",
    back: "Retour",
    resend: "Vous n'avez pas reçu le code ?",
    resendLink: "Renvoyer",
    btnValidate: "Valider",
    btnCancel: "Annuler",
    successTitle: "Authentification réussie",
    successMsg: "Bienvenue,",
    successInfo: "Identité vérifiée avec succès",
    btnDashboard: "Accéder au tableau de bord",
  },
  wo: {
    brandSub: "Kër bi ci vote bu yëgël",
    stepTitle1: "Seetlu",
    stepSub1: "Bind sa nimero CNIE ngir jëf",
    cnieLabel: "Nimero CNIE",
    cniePlaceholder: "12345678901234",
    cnieError: "Nimero CNIE bi baaxul",
    btnOtp: "Yónneel kóod OTP",
    or: "walla",
    btnRegister: "Bindal sa tur",
    langLabel: "Langue / Làkk",
    stepTitle2: "Kóod OTP",
    stepSub2: "Kóod bi ngay dëkkal ci SMS bi",
    otpHint: "Bindal juróom fukk ak juróom ñaar ci SMS bi",
    back: "Dellu",
    resend: "Kóod bi amul ?",
    resendLink: "Yónneel ci kanam",
    btnValidate: "Dalal",
    btnCancel: "Anuul",
    successTitle: "Seetlu ak ngor",
    successMsg: "Dalal ak jamm,",
    successInfo: "Seetlu ak ngor ci kanam",
    btnDashboard: "Dem ci tableau de bord",
  },
};

export default function AuthPage({ onSuccess }) {
  const [step, setStep] = useState(STEPS.CNIE);
  const [cnie, setCnie] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [lang, setLang] = useState("fr");
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) return <RegisterPage onBack={() => setShowRegister(false)} />;

  const t = TRANSLATIONS[lang];

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

        {/* ── HEADER AVEC DRAPEAU ── */}
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
            <div className="brand-sub">{t.brandSub}</div>
          </div>
        </div>

        <div className="auth-body">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* ── ÉTAPE 1 : CNIE ── */}
          {step === STEPS.CNIE && (
            <div className="step">
              <div className="step-title">{t.stepTitle1}</div>
              <div className="step-sub">{t.stepSub1}</div>
              <label htmlFor="cnie">{t.cnieLabel}</label>
              <input
                id="cnie"
                type="text"
                placeholder={t.cniePlaceholder}
                maxLength={14}
                value={cnie}
                onChange={(e) => setCnie(e.target.value)}
                className={error ? "input-error" : ""}
              />
              {error && <div className="error-msg">{t.cnieError}</div>}
              <button className="btn-primary" onClick={handleCnieSubmit}>
                {t.btnOtp}
              </button>
              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">{t.or}</span>
                <div className="divider-line" />
              </div>
              <button className="btn-outline" onClick={() => setShowRegister(true)}>
                {t.btnRegister}
              </button>
              <div className="lang-section">
                <div className="lang-label">{t.langLabel}</div>
                <div className="lang-row">
                  <button
                    className={`lang-btn ${lang === "fr" ? "lang-active" : ""}`}
                    onClick={() => setLang("fr")}
                  >
                    Français
                  </button>
                  <button
                    className={`lang-btn ${lang === "wo" ? "lang-active" : ""}`}
                    onClick={() => setLang("wo")}
                  >
                    Wolof
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 2 : OTP ── */}
          {step === STEPS.OTP && (
            <div className="step">
              <button className="back-btn" onClick={() => setStep(STEPS.CNIE)}>
                ← {t.back}
              </button>
              <div className="step-title">{t.stepTitle2}</div>
              <div className="step-sub">{t.stepSub2}</div>
              <div className="otp-hint">{t.otpHint}</div>
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
                {t.resend}{" "}
                <span className="resend-link">{t.resendLink}</span>
              </div>
              <button className="btn-primary" onClick={handleOtpSubmit}>
                {t.btnValidate}
              </button>
              <button className="btn-red" onClick={() => setStep(STEPS.CNIE)}>
                {t.btnCancel}
              </button>
            </div>
          )}

          {/* ── ÉTAPE 3 : SUCCÈS ── */}
          {step === STEPS.SUCCESS && (
            <div className="step">
              <div className="success-icon">✅</div>
              <div className="step-title" style={{ textAlign: "center" }}>
                {t.successTitle}
              </div>
              <div className="success-msg">
                {t.successMsg} <strong>Amadou M.</strong>
              </div>
              <div className="success-info">
                ✓ {t.successInfo}
              </div>
              <button className="btn-primary" onClick={onSuccess}>
                {t.btnDashboard}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}