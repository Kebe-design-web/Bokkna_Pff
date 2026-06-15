from datetime import datetime
from collections import defaultdict

class FraudDetector:
    def __init__(self):
        self.SEUIL_VOTES_PAR_IP = 3
        self.SEUIL_TENTATIVES = 5
        self.votes_par_ip = defaultdict(list)
        self.tentatives_echec = defaultdict(int)
        self.alertes = []

    def detecter_votes_meme_ip(self, ip, id_scrutin):
        cle = f"{ip}_{id_scrutin}"
        if len(self.votes_par_ip[cle]) >= self.SEUIL_VOTES_PAR_IP:
            alerte = {"type": "VOTES_MULTIPLES_IP", "niveau": "CRITIQUE",
                      "ip": ip, "horodatage": datetime.now().isoformat()}
            self.alertes.append(alerte)
            return True, alerte
        self.votes_par_ip[cle].append(datetime.now())
        return False, None

    def detecter_brute_force(self, id_electeur, succes):
        if not succes:
            self.tentatives_echec[id_electeur] += 1
            if self.tentatives_echec[id_electeur] >= self.SEUIL_TENTATIVES:
                alerte = {"type": "BRUTE_FORCE", "niveau": "CRITIQUE",
                          "id_electeur": id_electeur,
                          "tentatives": self.tentatives_echec[id_electeur]}
                self.alertes.append(alerte)
                return True, alerte
        else:
            self.tentatives_echec[id_electeur] = 0
        return False, None

    def analyser_vote(self, id_electeur, id_scrutin, ip):
        rapport = {"id_electeur": id_electeur, "score_risque": 0, "fraudes": []}
        fraude, alerte = self.detecter_votes_meme_ip(ip, id_scrutin)
        if fraude:
            rapport["fraudes"].append(alerte)
            rapport["score_risque"] += 60
        rapport["decision"] = "REJETE" if rapport["score_risque"] >= 60 else "ACCEPTE"
        return rapport

    def rapport_alertes(self):
        return {"total": len(self.alertes),
                "critiques": len([a for a in self.alertes if a.get("niveau") == "CRITIQUE"]),
                "alertes": self.alertes}

if __name__ == "__main__":
    d = FraudDetector()
    print("Test vote normal:", d.analyser_vote(1, 1, "192.168.1.1")["decision"])
    for i in range(4):
        d.detecter_votes_meme_ip("10.0.0.1", 1)
    print("Test IP suspecte:", d.analyser_vote(5, 1, "10.0.0.1")["decision"])
    for i in range(6):
        bloque, _ = d.detecter_brute_force(2, False)
    print("Test brute force detecte:", bloque)
    print("Total alertes:", d.rapport_alertes()["total"])
