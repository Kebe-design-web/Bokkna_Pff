from datetime import datetime, date

class VoterVerifier:
    def __init__(self):
        self.AGE_MINIMUM = 18
        self.electeurs_bloques = set()
        self.votes_effectues = set()

    def verifier_eligibilite(self, electeur):
        resultat = {"id_electeur": electeur.get("id"), "eligible": True, "raisons_rejet": []}
        if not electeur.get("est_verifie", False):
            resultat["eligible"] = False
            resultat["raisons_rejet"].append("Compte non verifie")
        if electeur.get("date_naissance"):
            naissance = datetime.strptime(electeur["date_naissance"], "%Y-%m-%d").date()
            age = date.today().year - naissance.year
            if age < self.AGE_MINIMUM:
                resultat["eligible"] = False
                resultat["raisons_rejet"].append(f"Age insuffisant : {age} ans")
        if electeur.get("id") in self.electeurs_bloques:
            resultat["eligible"] = False
            resultat["raisons_rejet"].append("Compte bloque")
        resultat["statut"] = "ELIGIBLE" if resultat["eligible"] else "NON ELIGIBLE"
        return resultat

    def verifier_avant_vote(self, id_electeur, id_scrutin):
        cle = (id_electeur, id_scrutin)
        if cle in self.votes_effectues:
            return {"autorise": False, "message": "Electeur a deja vote", "code": "DOUBLE_VOTE"}
        self.votes_effectues.add(cle)
        return {"autorise": True, "message": "Vote autorise", "code": "OK"}

    def bloquer_electeur(self, id_electeur, raison):
        self.electeurs_bloques.add(id_electeur)
        return {"id_electeur": id_electeur, "bloque": True, "raison": raison}

if __name__ == "__main__":
    v = VoterVerifier()
    electeur_ok = {"id": 1, "est_verifie": True, "date_naissance": "1990-05-15"}
    print("Test 1:", v.verifier_eligibilite(electeur_ok)["statut"])
    electeur_jeune = {"id": 2, "est_verifie": True, "date_naissance": "2010-01-01"}
    print("Test 2:", v.verifier_eligibilite(electeur_jeune)["statut"])
    v.verifier_avant_vote(1, 1)
    print("Test 3:", v.verifier_avant_vote(1, 1)["message"])
