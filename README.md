# Bokkna - Plateforme de Vote Électronique (Backend API)

Bokkna est une solution numérique de vote sécurisée, transparente et moderne, développée dans le cadre de notre projet de fin d'études à l'ISEPAT. Ce dépôt contient l'architecture backend de l'application.

## 👥 Organisation du Projet et Équipe
Le projet est réalisé par un groupe de trois étudiants, où les responsabilités ont été réparties ainsi :
* Fatou : Responsable de la conception, de la gestion de la base de données et de l'administration du dépôt GitHub.
* Bousso : Responsable de la documentation technique, de la rédaction du README et du support au développement backend.
* Dietew Ndour: frontend .

## 🏗️ Architecture Technique (Backend)
L'application repose sur une architecture RESTful robuste pour garantir des performances optimales lors des scrutins :
* **Framework principal :** Python avec Django.
* **Gestion des API :** Django REST Framework (DRF) pour une communication fluide, sécurisée et rapide des données de vote.
* **Sécurisation :** Utilisation de Serializers avancés pour la validation stricte des données (vérification de l'éligibilité de l'électeur, unicité du vote).
* **Base de données :** Gérée et optimisée pour stocker les utilisateurs, les scrutins, les candidats et l'enregistrement anonyme des voix.

## ⚙️ Fonctionnalités du Système
1. **Authentification & Droits :** Connexion sécurisée des électeurs et des administrateurs.
2. **Gestion des Scrutins :** Création, modification et clôture des sessions de vote par les administrateurs.
3. **Vote Sécurisé :** Système garantissant qu'un utilisateur connecté ne peut voter qu'une seule fois par scrutin.
4. **Dépouillement Automatique :** Calcul des résultats en temps réel via des requêtes de base de données optimisées.

## 🛠️ Instructions pour le Déploiement Local

