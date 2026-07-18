from rest_framework import serializers
from .models import Electeur, Candidat, Election, Vote

class CandidatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidat
        fields = ['id', 'nom', 'prenom', 'parti_politique', 'photo_url']

class ElecteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Electeur
        fields = ['id', 'numero_cni', 'nom', 'prenom', 'telephone', 'a_vote']

class ElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['id', 'nom', 'date_debut', 'date_fin', 'est_active']

class VoteSerializer(serializers.ModelSerializer):
    electeur_nom = serializers.CharField(source='electeur.nom', read_only=True)
    candidat_nom = serializers.CharField(source='candidat.nom', read_only=True)

    class Meta:
        model = Vote
        fields = ['id', 'electeur', 'candidat', 'horodatage', 'electeur_nom', 'candidat_nom']
        read_only_fields = ['horodatage']