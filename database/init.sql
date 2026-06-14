-- BOKKNA - Base de données PostgreSQL
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE administrateur (
    id_admin      SERIAL PRIMARY KEY,
    nom           VARCHAR(100) NOT NULL,
    prenom        VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe  TEXT NOT NULL,
    role          VARCHAR(50) DEFAULT 'admin',
    date_creation TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scrutin (
    id_scrutin   SERIAL PRIMARY KEY,
    titre        VARCHAR(200) NOT NULL,
    description  TEXT,
    date_debut   TIMESTAMP NOT NULL,
    date_fin     TIMESTAMP NOT NULL,
    statut       VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente','en_cours','termine','annule')),
    type_scrutin VARCHAR(50) NOT NULL,
    id_admin     INT NOT NULL REFERENCES administrateur(id_admin),
    cle_publique TEXT,
    date_creation TIMESTAMP DEFAULT NOW()
);

CREATE TABLE candidat (
    id_candidat SERIAL PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL,
    prenom      VARCHAR(100) NOT NULL,
    parti       VARCHAR(150),
    photo_url   TEXT,
    biographie  TEXT,
    id_scrutin  INT NOT NULL REFERENCES scrutin(id_scrutin) ON DELETE CASCADE
);

CREATE TABLE electeur (
    id_electeur      SERIAL PRIMARY KEY,
    nom              VARCHAR(100) NOT NULL,
    prenom           VARCHAR(100) NOT NULL,
    cin              VARCHAR(20) UNIQUE NOT NULL,
    date_naissance   DATE NOT NULL,
    telephone        VARCHAR(20) UNIQUE,
    email            VARCHAR(150),
    region           VARCHAR(100),
    est_diaspora     BOOLEAN DEFAULT FALSE,
    est_verifie      BOOLEAN DEFAULT FALSE,
    date_inscription TIMESTAMP DEFAULT NOW()
);

CREATE TABLE token_anonymat (
    id_token      SERIAL PRIMARY KEY,
    token         TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
    id_electeur   INT NOT NULL REFERENCES electeur(id_electeur) ON DELETE CASCADE,
    id_scrutin    INT NOT NULL REFERENCES scrutin(id_scrutin) ON DELETE CASCADE,
    utilise       BOOLEAN DEFAULT FALSE,
    date_emission TIMESTAMP DEFAULT NOW(),
    UNIQUE(id_electeur, id_scrutin)
);

CREATE TABLE vote_chiffre (
    id_vote         SERIAL PRIMARY KEY,
    token_vote      TEXT NOT NULL,
    contenu_chiffre TEXT NOT NULL,
    id_scrutin      INT NOT NULL REFERENCES scrutin(id_scrutin),
    empreinte       TEXT NOT NULL,
    horodatage      TIMESTAMP DEFAULT NOW(),
    UNIQUE(token_vote, id_scrutin)
);

CREATE TABLE observateur (
    id_observateur     SERIAL PRIMARY KEY,
    nom                VARCHAR(100) NOT NULL,
    prenom             VARCHAR(100) NOT NULL,
    email              VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe       TEXT NOT NULL,
    organisation       VARCHAR(200),
    type_obs           VARCHAR(50) CHECK (type_obs IN ('national','international','ong')),
    id_scrutin         INT NOT NULL REFERENCES scrutin(id_scrutin) ON DELETE CASCADE,
    date_accreditation TIMESTAMP DEFAULT NOW()
);

CREATE TABLE journal_audit (
    id_log      SERIAL PRIMARY KEY,
    action      VARCHAR(100) NOT NULL,
    acteur_type VARCHAR(30) NOT NULL,
    acteur_id   INT,
    id_scrutin  INT REFERENCES scrutin(id_scrutin),
    ip_address  INET,
    details     JSONB,
    horodatage  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE otp_verification (
    id_otp      SERIAL PRIMARY KEY,
    id_electeur INT NOT NULL REFERENCES electeur(id_electeur) ON DELETE CASCADE,
    code_otp    VARCHAR(6) NOT NULL,
    expire_a    TIMESTAMP NOT NULL,
    utilise     BOOLEAN DEFAULT FALSE,
    date_envoi  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resultat_scrutin (
    id_resultat SERIAL PRIMARY KEY,
    id_scrutin  INT NOT NULL REFERENCES scrutin(id_scrutin),
    id_candidat INT NOT NULL REFERENCES candidat(id_candidat),
    nombre_voix INT DEFAULT 0,
    pourcentage DECIMAL(5,2),
    date_calcul TIMESTAMP DEFAULT NOW(),
    UNIQUE(id_scrutin, id_candidat)
);

CREATE INDEX idx_vote_scrutin      ON vote_chiffre(id_scrutin);
CREATE INDEX idx_token_electeur    ON token_anonymat(id_electeur);
CREATE INDEX idx_journal_horodatage ON journal_audit(horodatage);
