import { useState } from "react";
import "../styles/RegisterPage.css";

const STEPS = { FORM: 1, SUCCESS: 2 };

export default function RegisterPage({ onBack }) {
  const [step, setStep] = useState(STEPS.FORM);
  const [form, setForm] = useState({ nom: "", prenom: "", cnie: "", telephone: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = "Champ obligatoire";
    if (!form.prenom.trim()) e.prenom = "Champ obligatoire";
    if (form.cnie.length < 8) e.cnie = "Numéro CNIE invalide";
    if (form.telephone.length < 9) e.telephone = "Numéro invalide";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setStep(STEPS.SUCCESS);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <div className="logo-circle">
          <div className="logo-inner">
            <div className="logo-dot" />
          </div>
        </div>
        <div>
          <div className="brand-name">BOKKNA</div>
          <div className="brand-sub">Plateforme de vote sécurisée</div>
        </div>
      </div>

      <div className="register-body">

        {step === STEPS.FORM && (
          <>
            <button className="back-btn" onClick={onBack}>
              ← Retour
            </button>
            <div className="step-title">Créer un compte</div>
            <div className="step-sub">Remplissez les informations ci-dessous pour vous inscrire</div>

            <div className="field-row">
              <div className="field-group">
                <label>Nom</label>
                <input
                  type="text"
                  placeholder="Diallo"
                  value={form.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  className={errors.nom ? "input-error" : ""}
                />
                {errors.nom && <div className="error-msg">{errors.nom}</div>}
              </div>
              <div className="field-group">
                <label>Prénom</label>
                <input
                  type="text"
                  placeholder="Amadou"
                  value={form.prenom}
                  onChange={(e) => handleChange("prenom", e.target.value)}
                  className={errors.prenom ? "input-error" : ""}
                />
                {errors.prenom && <div className="error-msg">{errors.prenom}</div>}
              </div>
            </div>

            <div className="field-group">
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
            </div>

            <div className="field-group">
              <label>Numéro de téléphone</label>
              <input
                type="text"
                placeholder="77 123 45 67"
                maxLength={12}
                value={form.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                className={errors.telephone ? "input-error" : ""}
              />
              {errors.telephone && <div className="error-msg">{errors.telephone}</div>}
            </div>

            <button className="btn-primary" onClick={handleSubmit}>
              S'inscrire
            </button>
          </>
        )}

        {step === STEPS.SUCCESS && (
          <div className="success-container">
            <div className="success-icon">✅</div>
            <div className="step-title" style={{ textAlign: "center" }}>Inscription réussie !</div>
            <div className="success-msg">
              Bienvenue <strong>{form.prenom} {form.nom}</strong> !<br />
              Votre compte a été créé avec succès.
            </div>
            <div className="success-info">
              Vous pouvez maintenant vous connecter avec votre numéro CNIE.
            </div>
            <button className="btn-primary" onClick={onBack}>
              Aller à la connexion
            </button>
          </div>
        )}

      </div>
    </div>
  );
}