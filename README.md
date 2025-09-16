# Exam Management System

Application de gestion d'examens avec Symfony 7, Angular 18, MariaDB et Docker.

## Prérequis

- Docker et Docker Compose
- Ports 4200 (frontend), 8000 (backend), 3306 (database) disponibles

## Installation

1. **Démarrer les services**
```bash
docker compose up --build
```

2. **Accéder à l'application**
- Frontend : http://localhost:4200
- Backend API : http://localhost:8000

## Authentification JWT

**Identifiants par défaut :**
- Email : `admin@example.com`
- Mot de passe : `password`

## Fonctionnalités

- Authentification JWT Bearer avec LexikJWTAuthenticationBundle
- CRUD examens avec statuts et validation
- Interface responsive Angular 18
- Statistiques temps réel avec signals
- Protection des routes et API endpoints

## API Endpoints

- `POST /api/login_check` - Authentification JWT
- `GET /exams` - Liste des examens (authentifié)
- `POST /exams` - Créer un examen (authentifié)

## Architecture

```
/backend          # Symfony 7 + API Platform + JWT
/frontend         # Angular 18 standalone
/docker-compose.yml
```

## Configuration

Les clés JWT sont générées automatiquement au démarrage du backend. L'utilisateur admin et les données de test sont chargés via les fixtures Doctrine.