"""
BOKKNA - Module IA : Analyse des résultats électoraux
Auteur : Fatima Kebe
"""
from datetime import datetime
from collections import Counter

class ElectionAnalyzer:
    def __init__(self):
        self.votes = []
        self.electeurs = []

    def charger_votes(self, votes):
        self.votes = votes

    def charger_electeurs(self, electeurs):
        self.electeurs = electeurs

    def calculer_statistiques(self, id_scrutin):
        votes_scrutin = [v for v in self.votes if v.get("id_scrutin") == id_scrutin]
        total_electeurs = len(self.electeurs)
        total_votes = len(votes_scrutin)
        taux = round(total_votes / total_electeurs * 100, 2) if total_electeurs > 0 else 0
        compteur = Counter(v.get("id_candidat") for v in votes_scrutin)
        resultats = [{"id_candidat": cid, "nombre_voix": nb,
                      "pourcentage": round(nb / total_votes * 100, 2) if total_votes > 0 else 0}
                     for cid, nb in compteur.most_common()]
        return {"id_scrutin": id_scrutin, "total_electeurs": total_electeurs,
                "total_votes": total_votes, "taux_participation": taux,
                "resultats": resultats, "gagnant": resultats[0] if resultats else None}

    def predire_participation(self, votes_actuels, total_electeurs, minutes_ecoules, duree_totale):
        vitesse = votes_actuels / minutes_ecoules if minutes_ecoules > 0 else 0
        votes_predits = min(votes_actuels + vitesse * (duree_totale - minutes_ecoules), total_electeurs)
        return {"votes_predits": round(votes_predits),
                "taux_predit": round(votes_predits / total_electeurs * 100, 2) if total_electeurs > 0 else 0,
                "fiabilite": "Élevée" if minutes_ecoules >= 120 else "Moyenne" if minutes_ecoules >= 30 else "Faible"}
