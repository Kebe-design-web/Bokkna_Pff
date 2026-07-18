from django.db import models
import uuid

# 1. Table des électeurs (Citoyens)
class Electeur(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    numero_cni = models.CharField(max_length=20, unique=True, verbose_name="Numéro CNI")
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    a_vote = models.BooleanField(default=False, verbose_name="A déjà voté")
    
    def __str__(self):
        return f"{self.prenom} {self.nom}"

# 2. Table des candidats
class Candidat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    parti_politique = models.CharField(max_length=150, blank=True, null=True)
    photo_url = models.URLField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"{self.prenom} {self.nom}"

# 3. Table de l'élection (Paramètres du scrutin)
class Election(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100, default="Présidentielle 2026")
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    est_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nom

# 4. Table des votes (LE CŒUR SECURISE)
class Vote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # ⚠️ OneToOneField = Un électeur ne peut voter qu'UNE SEULE FOIS (contrainte physique BDD)
    electeur = models.OneToOneField(Electeur, on_delete=models.CASCADE, verbose_name="Électeur")
    candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, verbose_name="Candidat")
    horodatage = models.DateTimeField(auto_now_add=True, verbose_name="Date du vote")
    
    def __str__(self):
        return f"{self.electeur} a voté pour {self.candidat}"