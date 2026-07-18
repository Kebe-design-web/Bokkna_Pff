from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.utils import timezone
from django.db import transaction
from django.conf import settings
import random
import jwt
import datetime
from .models import Electeur, Candidat, Election, Vote
from .serializers import CandidatSerializer, ElecteurSerializer, VoteSerializer

# ----------------------------------------------
# 1. GENERATION / DECODAGE DU TOKEN JWT
# ----------------------------------------------
def generate_jwt_token(electeur_id):
    """Génère un token JWT pour l'électeur"""
    payload = {
        'electeur_id': str(electeur_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=settings.JWT_EXPIRATION_SECONDS),
        'iat': datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

def get_electeur_from_token(request):
    """Extrait et vérifie le token JWT dans l'en-tête Authorization"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        electeur_id = payload.get('electeur_id')
        return Electeur.objects.get(id=electeur_id)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, Electeur.DoesNotExist):
        return None

# ----------------------------------------------
# 2. ENDPOINTS D'AUTHENTIFICATION (OTP)
# ----------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def request_otp(request):
    """
    Étape 1 : L'utilisateur envoie son CNI.
    On génère un code OTP et on le stocke dans le cache pendant 5 minutes.
    """
    numero_cni = request.data.get('numero_cni')
    if not numero_cni:
        return Response({'error': 'Le numéro CNI est requis'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        electeur = Electeur.objects.get(numero_cni=numero_cni)
    except Electeur.DoesNotExist:
        return Response({'error': 'Numéro CNI non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    # Générer un code OTP à 6 chiffres
    otp_code = str(random.randint(100000, 999999))
    
    # Stocker dans le cache (expiration 5 minutes)
    cache.set(f'otp_{numero_cni}', otp_code, timeout=300)
    
    # Ici, normalement on enverrait le code par SMS.
    # Pour le test, on le renvoie dans la réponse (ou on l'affiche dans la console)
    print(f"🔐 Code OTP pour {electeur.prenom} {electeur.nom} : {otp_code}")
    
    return Response({
        'message': 'Code OTP envoyé avec succès',
        'otp_code': otp_code  # ⚠️ À SUPPRIMER EN PRODUCTION (c'est juste pour tester)
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_with_otp(request):
    """
    Étape 2 : L'utilisateur envoie son CNI + le code OTP.
    Si c'est bon, on génère un token JWT et on le renvoie.
    """
    numero_cni = request.data.get('numero_cni')
    otp_saisi = request.data.get('otp_code')
    
    if not numero_cni or not otp_saisi:
        return Response({'error': 'CNI et OTP requis'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Vérifier le code dans le cache
    otp_stocke = cache.get(f'otp_{numero_cni}')
    if not otp_stocke:
        return Response({'error': 'Code OTP expiré ou invalide'}, status=status.HTTP_400_BAD_REQUEST)
    
    if otp_stocke != otp_saisi:
        return Response({'error': 'Code OTP incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        electeur = Electeur.objects.get(numero_cni=numero_cni)
    except Electeur.DoesNotExist:
        return Response({'error': 'Électeur non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    # Supprimer l'OTP du cache après utilisation (usage unique)
    cache.delete(f'otp_{numero_cni}')
    
    # Générer le JWT
    token = generate_jwt_token(electeur.id)
    
    return Response({
        'message': 'Authentification réussie',
        'token': token,
        'electeur': {
            'id': electeur.id,
            'nom': electeur.nom,
            'prenom': electeur.prenom,
            'a_vote': electeur.a_vote
        }
    }, status=status.HTTP_200_OK)

# ----------------------------------------------
# 3. LISTE DES CANDIDATS (Public)
# ----------------------------------------------

@api_view(['GET'])
@permission_classes([AllowAny])
def liste_candidats(request):
    """Renvoie la liste de tous les candidats"""
    candidats = Candidat.objects.all()
    serializer = CandidatSerializer(candidats, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ----------------------------------------------
# 4. LE VOTE (LE COEUR SECURISE)
# ----------------------------------------------

@api_view(['POST'])
def voter(request):
    """
    Endpoint protégé par JWT.
    Vérifications : élection en cours, pas déjà voté, candidat existe.
    """
    # 1. Vérifier le JWT
    electeur = get_electeur_from_token(request)
    if not electeur:
        return Response({'error': 'Token invalide ou expiré'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # 2. Vérifier si l'élection est active (on prend la première active ou par date)
    try:
        election = Election.objects.get(est_active=True)
    except Election.DoesNotExist:
        return Response({'error': 'Aucune élection active'}, status=status.HTTP_400_BAD_REQUEST)
    
    maintenant = timezone.now()
    if maintenant < election.date_debut:
        return Response({'error': 'L\'élection n\'a pas encore commencé'}, status=status.HTTP_403_FORBIDDEN)
    if maintenant > election.date_fin:
        return Response({'error': 'L\'élection est terminée'}, status=status.HTTP_403_FORBIDDEN)
    
    # 3. Vérifier si l'électeur a déjà voté
    if electeur.a_vote:
        return Response({'error': 'Vous avez déjà voté'}, status=status.HTTP_403_FORBIDDEN)
    
    # 4. Récupérer le candidat choisi
    candidat_id = request.data.get('candidat_id')
    if not candidat_id:
        return Response({'error': 'ID du candidat requis'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        candidat = Candidat.objects.get(id=candidat_id)
    except Candidat.DoesNotExist:
        return Response({'error': 'Candidat non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    # 5. ENREGISTRER LE VOTE (Transaction ACID)
    # On utilise transaction.atomic() pour garantir qu'on ne crée pas de vote si la mise à jour échoue
    with transaction.atomic():
        # Créer le vote
        vote = Vote.objects.create(
            electeur=electeur,
            candidat=candidat
        )
        # Marquer l'électeur comme ayant voté
        electeur.a_vote = True
        electeur.save()
    
    # Retourner une confirmation
    serializer = VoteSerializer(vote)
    return Response({
        'message': 'Vote enregistré avec succès !',
        'vote': serializer.data
    }, status=status.HTTP_201_CREATED)

# ----------------------------------------------
# 5. RESULTATS EN TEMPS REEL
# ----------------------------------------------

@api_view(['GET'])
@permission_classes([AllowAny])
def resultats_temps_reel(request):
    """
    Compte les voix par candidat.
    Accessible à tous (sans authentification).
    """
    from django.db.models import Count
    
    # Récupérer tous les candidats avec leur nombre de votes
    candidats = Candidat.objects.annotate(
        total_votes=Count('vote')
    ).order_by('-total_votes')
    
    resultats = []
    for c in candidats:
        resultats.append({
            'candidat': f"{c.prenom} {c.nom}",
            'parti': c.parti_politique,
            'voix': c.total_votes
        })
    
    # Statistiques globales
    total_votes = Vote.objects.count()
    total_electeurs = Electeur.objects.count()
    votes_restants = total_electeurs - total_votes
    
    return Response({
        'resultats': resultats,
        'statistiques': {
            'total_votes': total_votes,
            'votes_valides': total_votes,  # Pas de vote invalide dans notre système
            'votes_invalides': 0,
            'votes_restants': votes_restants
        }
    }, status=status.HTTP_200_OK)

# ----------------------------------------------
# 6. RESULTATS OFFICIELS (Protégé par date)
# ----------------------------------------------

@api_view(['GET'])
@permission_classes([AllowAny])
def resultats_officiels(request):
    """
    Renvoie les résultats définitifs UNIQUEMENT si l'élection est terminée.
    """
    from django.db.models import Count
    
    try:
        election = Election.objects.get(est_active=True)
    except Election.DoesNotExist:
        return Response({'error': 'Aucune élection trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
    maintenant = timezone.now()
    if maintenant < election.date_fin:
        return Response({
            'error': 'Les résultats officiels ne sont disponibles qu\'après la clôture du scrutin.',
            'date_cloture': election.date_fin
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Même calcul que les résultats en temps réel, mais on pourrait ajouter un filtre
    # pour ne prendre que les votes validés (dans notre cas, ils le sont tous).
    candidats = Candidat.objects.annotate(
        total_votes=Count('vote')
    ).order_by('-total_votes')
    
    resultats = []
    for c in candidats:
        resultats.append({
            'candidat': f"{c.prenom} {c.nom}",
            'parti': c.parti_politique,
            'voix': c.total_votes
        })
    
    return Response({
        'election': election.nom,
        'date_cloture': election.date_fin,
        'resultats_officiels': resultats
    }, status=status.HTTP_200_OK)


    @api_view(['GET'])
@permission_classes([AllowAny])
def api_home(request):
    return Response({
        'message': 'Bienvenue sur l\'API de vote BOKKNA !',
        'endpoints_disponibles': {
            'auth': {
                'OTP': '/api/auth/otp/ (POST)',
                'Login': '/api/auth/login/ (POST)'
            },
            'candidats': '/api/candidats/ (GET)',
            'vote': '/api/votes/ (POST) - nécessite token JWT',
            'resultats': {
                'temps_reel': '/api/resultats/temps-reel/ (GET)',
                'officiels': '/api/resultats/officiels/ (GET)'
            }
        }
    })