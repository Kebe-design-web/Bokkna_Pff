"""
BOKKNA - App ia : vue du chatbot
Auteur : Fatima Kebe

Expose le chatbot via un endpoint POST /api/ia/chatbot/
Adapter les imports de modèles (Scrutin, Vote, Electeur) au nom réel
de tes apps si besoin (ex : scrutins.models, votes.models, authentication.models).
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .chatbot_ia import BokknaChatbot

# À adapter selon le nom exact de tes apps/modèles Django
from scrutins.models import Scrutin
from votes.models import Vote
from authentication.models import Electeur

chatbot = BokknaChatbot()


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chatbot_view(request):
    """
    Corps de requête attendu :
    {
        "message": "quel est le taux de participation ?",
        "id_scrutin": 1
    }
    """
    message = request.data.get("message", "").strip()
    id_scrutin = request.data.get("id_scrutin")

    if not message:
        return Response({"reponse": "Message vide.", "intention": "erreur"}, status=400)

    contexte = {"id_scrutin": id_scrutin}

    # Charge le contexte réel depuis la base uniquement si nécessaire,
    # pour éviter des requêtes inutiles sur les intentions simples (aide, sécurité).
    if id_scrutin:
        votes_qs = Vote.objects.filter(id_scrutin=id_scrutin).values("id_scrutin", "id_candidat")
        electeurs_qs = Electeur.objects.all().values()
        contexte["votes"] = list(votes_qs)
        contexte["electeurs"] = list(electeurs_qs)

    # Pour les demandes d'éligibilité, on identifie l'électeur courant
    if request.user and hasattr(request.user, "electeur"):
        contexte["electeur"] = {
            "id": request.user.electeur.id,
            "est_verifie": request.user.electeur.est_verifie,
            "date_naissance": str(request.user.electeur.date_naissance),
        }

    resultat = chatbot.repondre(message, contexte)
    return Response(resultat)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chatbot_accueil_view(request):
    """Retourne le message d'accueil affiché à l'ouverture du chatbot."""
    return Response({"reponse": chatbot.MESSAGE_ACCUEIL, "intention": "accueil"})


# À ajouter dans ia/urls.py :
#
# from django.urls import path
# from . import views_chatbot
#
# urlpatterns = [
#     path("chatbot/", views_chatbot.chatbot_view, name="chatbot"),
#     path("chatbot/accueil/", views_chatbot.chatbot_accueil_view, name="chatbot-accueil"),
# ]
