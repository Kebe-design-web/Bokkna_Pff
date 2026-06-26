import { useState } from "react";
import "../styles/AuthPage.css";

export default function RegisterPage({ onBack }) {
  const [form, setForm] = useState({
    nom: "",
    cnie: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nom) e.nom = "Champ requis";
    if (form.cnie.length < 8) e.cnie = "Numéro CNIE invalide";
    if (form.telephone.length < 9) e.telephone = "Numéro invalide";
    if (!form.dateNaissance) e.dateNaissance = "Champ requis";
    if (!form.adresse) e.adresse = "Champ requis";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-circle">
              <div className="logo-inner"><div className="logo-dot" /></div>
            </div>
            <div className="brand">
              <div className="brand-name">BOKKNA</div>
              <div className="brand-sub">Plateforme de vote sécurisée</div>
            </div>
          </div>
          <div className="auth-body">
            <div className="step">
              <div className="success-icon">✅</div>
              <div className="step-title" style={{ textAlign: "center" }}>
                Inscription réussie !
              </div>
              <div className="success-msg">
                Bienvenue, <strong>{form.nom}</strong>
              </div>
              <div className="success-info">
                <i className="ti ti-shield-check" /> Votre compte a été créé avec succès
              </div>
              <div className="success-info" style={{ marginTop: 8 }}>
                <i className="ti ti-clock" /> Votre dossier est en cours de vérification
              </div>
              <button className="btn-primary" style={{ marginTop: 24 }} onClick={onBack}>
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-circle">
            <div className="logo-inner"><div className="logo-dot" /></div>
          </div>
          <div className="brand">
            <div className="brand-name">BOKKNA</div>
            <div className="brand-sub">Plateforme de vote sécurisée</div>
          </div>
        </div>

        <div className="auth-body">
          <div className="step">
            <button className="back-btn" onClick={onBack}>
              <i className="ti ti-arrow-left" /> Retour
            </button>
            <div className="step-title">Créer un compte</div>
            <div className="step-sub">Remplissez les informations ci-dessous</div>

            <label>Nom complet</label>
            <input
              type="text"
              placeholder="Amadou Mbaye"
              value={form.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className={errors.nom ? "input-error" : ""}
            />
            {errors.nom && <div className="error-msg">{errors.nom}</div>}

            <label>Numéro CNIE</label>
            <input
              type="text"
              placeholder="12345678901234"
              maxLength={14}
              value={form.cnie}
              onChange={(e) => handleChange("cnie", e.target.value)}
              className={errors.cnie ? "input-error" : ""}
            />
            {errors.cnie && <div className="error-msg">{errors.cnie}</div>}

            <label>Numéro de téléphone</label>
            <input
              type="tel"
              placeholder="77 123 45 67"
              value={form.telephone}
              onChange={(e) => handleChange("telephone", e.target.value)}
              className={errors.telephone ? "input-error" : ""}
            />
            {errors.telephone && <div className="error-msg">{errors.telephone}</div>}

            <label>Date de naissance</label>
            <input
              type="date"
              value={form.dateNaissance}
              onChange={(e) => handleChange("dateNaissance", e.target.value)}
              className={errors.dateNaissance ? "input-error" : ""}
            />
            {errors.dateNaissance && <div className="error-msg">{errors.dateNaissance}</div>}

            <label>Adresse</label>
            <input
              type="text"
              placeholder="Dakar, Plateau"
              value={form.adresse}
              onChange={(e) => handleChange("adresse", e.target.value)}
              className={errors.adresse ? "input-error" : ""}
            />
            {errors.adresse && <div className="error-msg">{errors.adresse}</div>}

            <button className="btn-primary" style={{ marginTop: 8 }} onClick={handleSubmit}>
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}