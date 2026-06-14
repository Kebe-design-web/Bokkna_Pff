"""
BOKKNA - Module IA : Vérification des votants
Auteur : Fatima Kebe
"""
from datetime import datetime, date

class VoterVerifier:
    def __init__(self):
        self.AGE_MINIMUM = 18
        self.electeurs_bloques = set()
        self.votes_effectues = set()

    def verifier_eligibilite(self, electeur):
        resultat = {"id_electeur": electeur.get("id"), "eligible": True,
                    "raisons_rejet": [], "horodatage": datetime.now().isoformat()}
        if not electeur.get("est_verifie", False):
            resultat["eligible"] = False
            resultat["raisons_rejet"].append("Compte non vérifié")
        if electeur.get("date_naissance"):
            naissance = datetime.strptime(electeur["date_naissance"], "%Y-%m-%d").date()
            age = date.today().year - naissance.year
            if age < self.AGE_MINIMUM:
                resultat["eligible"] = False
                resultat["raisons_rejet"].append(f"Âge insuffisant : {age} ans")
        if electeur.get("id") in self.electeurs_bloques:
            resultat["eligible"] = False
            resultat["raisons_rejet"].append("Compte bloqué")
        resultat["statut"] = "ÉLIGIBLE" if resultat["eligible"] else "NON ÉLIGIBLE"
        return resultat

    def verifier_avant_vote(self, id_electeur, id_scrutin):
        cle = (id_electeur, id_scrutin)
        if cle in self.votes_effectues:
            return {"autorise": False, "message": "Électeur a déjà voté", "code": "DOUBLE_VOTE"}
        self.votes_effectues.add(cle)
        return {"autorise": True, "message": "Vote autorisé", "code": "OK"}

    def bloquer_electeur(self, id_electeur, raison):
        self.electeurs_bloques.add(id_electeur)
        return {"id_electeur": id_electeur, "bloque": True, "raison": raison}
EOFcat > ia/detection_fraude/voter_verifier.py << 'EOF'
"""
BOKKNA - Module IA : Vérification des votants
Auteur : Fatima Kebe
"""
from datetime import datetime, date

class VoterVerifier:
    def __init__(self):
        self.AGE_MINIMUM = 18
        self.electeurs_bloques = set()
        self.votes_effectues = set()

    def verifier_eligibilite(self, electeur):
        resultat = {"id_electeur": electeur.get("id"), "eligible": True,
                    "raisons_rejet": [], "horodatage": datetime.now().isoformat()}
        if not electeur.get("est_verifie", False):
            resultat["eligible"] = False
            resultat["raisons_rejet"].append("Compte non vérifié")
        if electeur.get("date_naissance"):
            naissance = datetime.strptime(electeur["date_naissance"], "%Y-%m-%d").date()
            age = date.today().year - naissance.year
            if age < self.AGE_MINIMUM:
                resultat["eligible"] = False
                resultat["raisons_rejet"].append(f"Âge insuffisant : {age} ans")
        if electeur.get("id") in self.electeurs_bloques:
            resultat["eligible"] = False
            resultat["raisons_rejet"].append("Compte bloqué")
        resultat["statut"] = "ÉLIGIBLE" if resultat["eligible"] else "NON ÉLIGIBLE"
        return resultat

    def verifier_avant_vote(self, id_electeur, id_scrutin):
        cle = (id_electeur, id_scrutin)
        if cle in self.votes_effectues:
            return {"autorise": False, "message": "Électeur a déjà voté", "code": "DOUBLE_VOTE"}
        self.votes_effectues.add(cle)
        return {"autorise": True, "message": "Vote autorisé", "code": "OK"}

    def bloquer_electeur(self, id_electeur, raison):
        self.electeurs_bloques.add(id_electeur)
        return {"id_electeur": id_electeur, "bloque": True, "raison": raison}
