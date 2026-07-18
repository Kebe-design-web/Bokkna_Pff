from django.contrib import admin
from .models import Electeur, Candidat, Election, Vote

@admin.register(Electeur)
class ElecteurAdmin(admin.ModelAdmin):
    list_display = ('numero_cni', 'nom', 'prenom', 'a_vote')
    search_fields = ('numero_cni', 'nom')

@admin.register(Candidat)
class CandidatAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'parti_politique')

@admin.register(Election)
class ElectionAdmin(admin.ModelAdmin):
    list_display = ('nom', 'date_debut', 'date_fin', 'est_active')

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('electeur', 'candidat', 'horodatage')
    # On empêche la modification des votes dans l'admin (pour la sécurité)
    readonly_fields = ('electeur', 'candidat', 'horodatage')