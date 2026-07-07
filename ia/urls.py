from django.urls import path
from . import views_chatbot

urlpatterns = [
    path("chatbot/", views_chatbot.chatbot_view, name="chatbot"),
    path("chatbot/accueil/", views_chatbot.chatbot_accueil_view, name="chatbot-accueil"),
]
