from django.urls import path
from . import views

urlpatterns = [
    # Authentification
    path('auth/otp/', views.request_otp, name='request_otp'),
    path('auth/login/', views.login_with_otp, name='login_otp'),
    
    # Candidats
    path('candidats/', views.liste_candidats, name='liste_candidats'),
    
    # Vote (protégé par JWT)
    path('votes/', views.voter, name='voter'),
    
    # Résultats
    path('resultats/temps-reel/', views.resultats_temps_reel, name='resultats_temps_reel'),
    path('resultats/officiels/', views.resultats_officiels, name='resultats_officiels'),

    path('', views.api_home, name='api_home'),
]

