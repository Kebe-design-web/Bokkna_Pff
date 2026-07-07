"""
BOKKNA - Module IA : Assistant conversationnel (Chatbot)
Auteur : Fatima Kebe

Ce module gère la logique de l'assistant : détection d'intention à partir
du message de l'utilisateur, puis appel du module IA approprié
(ElectionAnalyzer, VoterVerifier, FraudDetector) pour construire une
réponse factuelle basée sur les données réelles de la plateforme.

Le ton des réponses est volontairement sobre et institutionnel :
pas d'émojis, pas de formulations familières.
"""

from analyse.election_analyzer import ElectionAnalyzer
from detection_fraude.voter_verifier import VoterVerifier
from detection_fraude.fraud_detector import FraudDetector


class BokknaChatbot:
    """Assistant conversationnel de la plateforme Bokkna."""

    MESSAGE_ACCUEIL = (
        "Bonjour. Je suis l'assistant Bokkna. "
        "Je peux vous renseigner sur les points suivants :\n"
        "- Statistiques et résultats d'un scrutin\n"
        "- Vérification de l'éligibilité d'un électeur\n"
        "- Fonctionnement du vote chiffré et de l'anonymat\n"
        "- Signalement d'une anomalie ou d'une activité suspecte\n"
        "Posez votre question pour commencer."
    )

    MESSAGE_INCOMPRIS = (
        "Je n'ai pas d'information précise sur cette demande. "
        "Vous pouvez me demander le taux de participation, "
        "les résultats d'un scrutin, une vérification d'éligibilité, "
        "ou des précisions sur la sécurité du vote."
    )

    # Mots-clés associés à chaque intention. La détection reste simple
    # (recherche de mots-clés) ; elle peut être remplacée plus tard par
    # un modèle de classification si nécessaire.
    INTENTIONS = {
        "participation": ["participation", "taux", "combien ont voté", "combien de votes"],
        "resultats": ["résultat", "resultats", "gagnant", "vainqueur", "score"],
        "eligibilite": ["éligible", "eligible", "eligibilité", "puis-je voter", "ai-je le droit"],
        "securite": ["sécurité", "chiffrement", "rsa", "anonymat", "confidentialité", "otp"],
        "fraude": ["fraude", "suspect", "anomalie", "signaler", "tentative"],
        "aide": ["aide", "capacité", "que peux-tu faire", "fonctionnalités"],
    }

    def __init__(self):
        self.analyzer = ElectionAnalyzer()
        self.verifier = VoterVerifier()
        self.fraud_detector = FraudDetector()

    def detecter_intention(self, message):
        message_normalise = message.lower().strip()
        for intention, mots_cles in self.INTENTIONS.items():
            if any(mot in message_normalise for mot in mots_cles):
                return intention
        return "inconnu"

    def repondre(self, message, contexte=None):
        """
        Traite un message utilisateur et retourne une réponse.

        contexte (dict optionnel) peut contenir :
            - id_scrutin : identifiant du scrutin concerné
            - electeur : dictionnaire des informations de l'électeur
            - votes : liste des votes chargés depuis la base
            - electeurs : liste des électeurs chargés depuis la base
        """
        contexte = contexte or {}
        intention = self.detecter_intention(message)

        if intention == "aide":
            return {"reponse": self.MESSAGE_ACCUEIL, "intention": intention}

        if intention == "participation":
            return self._repondre_participation(contexte)

        if intention == "resultats":
            return self._repondre_resultats(contexte)

        if intention == "eligibilite":
            return self._repondre_eligibilite(contexte)

        if intention == "securite":
            return {
                "reponse": (
                    "Chaque vote est chiffré avec une clé RSA-2048 générée "
                    "spécifiquement pour le scrutin. L'identité de l'électeur "
                    "est vérifiée séparément par CNIE et code OTP envoyé par SMS, "
                    "sans lien conservé entre l'identité et le contenu du vote. "
                    "Toutes les opérations sont consignées dans un journal d'audit."
                ),
                "intention": intention,
            }

        if intention == "fraude":
            return self._repondre_fraude(contexte)

        return {"reponse": self.MESSAGE_INCOMPRIS, "intention": "inconnu"}

    def _repondre_participation(self, contexte):
        id_scrutin = contexte.get("id_scrutin")
        if not id_scrutin:
            return {
                "reponse": "Précisez le scrutin concerné pour obtenir le taux de participation.",
                "intention": "participation",
            }
        self.analyzer.charger_votes(contexte.get("votes", []))
        self.analyzer.charger_electeurs(contexte.get("electeurs", []))
        stats = self.analyzer.calculer_statistiques(id_scrutin)
        return {
            "reponse": (
                f"Taux de participation actuel : {stats['taux_participation']}% "
                f"({stats['total_votes']} votes sur {stats['total_electeurs']} électeurs inscrits)."
            ),
            "intention": "participation",
            "donnees": stats,
        }

    def _repondre_resultats(self, contexte):
        id_scrutin = contexte.get("id_scrutin")
        if not id_scrutin:
            return {
                "reponse": "Précisez le scrutin concerné pour consulter les résultats.",
                "intention": "resultats",
            }
        self.analyzer.charger_votes(contexte.get("votes", []))
        self.analyzer.charger_electeurs(contexte.get("electeurs", []))
        stats = self.analyzer.calculer_statistiques(id_scrutin)
        if not stats["resultats"]:
            return {
                "reponse": "Aucun vote n'a encore été enregistré pour ce scrutin.",
                "intention": "resultats",
            }
        gagnant = stats["gagnant"]
        return {
            "reponse": (
                f"Résultats provisoires : le candidat en tête totalise "
                f"{gagnant['pourcentage']}% des voix ({gagnant['nombre_voix']} votes). "
                f"Total des votes comptabilisés : {stats['total_votes']}."
            ),
            "intention": "resultats",
            "donnees": stats,
        }

    def _repondre_eligibilite(self, contexte):
        electeur = contexte.get("electeur")
        if not electeur:
            return {
                "reponse": "Je n'ai pas accès aux informations de cet électeur.",
                "intention": "eligibilite",
            }
        resultat = self.verifier.verifier_eligibilite(electeur)
        if resultat["eligible"]:
            return {
                "reponse": "Ce compte est éligible au vote.",
                "intention": "eligibilite",
                "donnees": resultat,
            }
        raisons = ", ".join(resultat["raisons_rejet"])
        return {
            "reponse": f"Ce compte n'est pas éligible au vote. Motif(s) : {raisons}.",
            "intention": "eligibilite",
            "donnees": resultat,
        }

    def _repondre_fraude(self, contexte):
        rapport = self.fraud_detector.rapport_alertes()
        if rapport["total"] == 0:
            return {
                "reponse": "Aucune anomalie détectée à ce jour sur ce scrutin.",
                "intention": "fraude",
                "donnees": rapport,
            }
        return {
            "reponse": (
                f"{rapport['total']} alerte(s) enregistrée(s), "
                f"dont {rapport['critiques']} de niveau critique."
            ),
            "intention": "fraude",
            "donnees": rapport,
        }
