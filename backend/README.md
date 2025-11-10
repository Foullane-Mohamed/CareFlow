# CareFlow EHR — Partie 1 (MVP, Authentification)

**Statut** : MVP — Socle backend, authentification et gestion utilisateurs / patients / rendez‑vous (prévention des conflits).

## Description

CareFlow est un backend RESTful pour un Electronic Health Record (EHR) destiné à cliniques et cabinets. Cette première partie (Partie 1) fournit le socle : authentification sécurisée (JWT access + refresh), gestion des utilisateurs et rôles, modèles de patients et rendez‑vous avec prévention automatique des conflits.

## Stack technique

* Node.js + Express
* MongoDB + Mongoose
* JWT (access & refresh tokens)
* bcrypt pour le hachage des mots de passe
* Joi ou express‑validator pour la validation
* Redis (optionnel) pour file d'attente / refresh tokens / notifications
* Winston + Morgan pour logging
* Mocha / Chai / Supertest pour les tests

## Principales fonctionnalités (MVP)

* Inscription / connexion (JWT access + refresh)
* Refresh token & logout
* Réinitialisation de mot de passe par email (flow : request token -> email -> reset)
* Gestion des rôles (admin, doctor, nurse, patient, secretary)
* CRUD utilisateurs (admin) : création, suspension, réactivation
* CRUD patients : dossier médical basique (allergies, antécédents, contact, assurance)
* CRUD rendez‑vous : création, modification, annulation, prévention des conflits (HTTP 409)
* Endpoint de disponibilités par praticien et date

## Architecture proposée

```
src/
 ├─ controllers/
 ├─ services/
 ├─ models/
 ├─ routes/
 ├─ middlewares/
 ├─ utils/
 ├─ validators/
 ├─ jobs/ (notifications, reminders)
 ├─ tests/
 └─ app.js (ou server.js)
```

* **controllers/** : orchestration des requêtes
* **services/** : logique métier (vérif disponibilités, création rendez‑vous)
* **models/** : schémas Mongoose
* **middlewares/** : auth, errorHandler, validation, logging
* **validators/** : schémas Joi

## Variables d'environnement (exemple)

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/careflow
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXP=15m
JWT_REFRESH_EXP=7d
BCRYPT_SALT_ROUNDS=10
EMAIL_SERVICE=sendgrid (ou smtp)
EMAIL_API_KEY=...
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
```

> **Sécurité** : stocker les secrets (JWT, SMTP) dans un vault ou variables d'environnements sécurisées.

## Installation & démarrage

```bash
# cloner
git clone <repo>
cd careflow

# installer
npm install

# variables d'environnement
# créer un .env basé sur .env.example

# lancer en dev
npm run dev

# build + prod
npm run start:prod
```

**Scripts utiles (package.json)**

* `dev` : nodemon + env de dev
* `start` : node server
* `test` : mocha/chai
* `lint` : eslint

## Endpoints (résumé)

**Versioning** : `/api/v1/...`

### Auth

* `POST /api/v1/auth/register` — inscription (role par défaut : patient ou role contrôlé)
* `POST /api/v1/auth/login` — connexion → { accessToken, refreshToken }
* `POST /api/v1/auth/refresh` — rafraîchir access token
* `POST /api/v1/auth/logout` — blacklist / supprimer refresh token
* `POST /api/v1/auth/request-reset` — demander reset par email
* `POST /api/v1/auth/reset` — effectuer reset avec token

### Users (admin)

* `GET /api/v1/users` — lister (filtres, pagination)
* `GET /api/v1/users/:id` — détail
* `POST /api/v1/users` — créer (admin crée médecin, secrétaire, etc.)
* `PUT /api/v1/users/:id` — modifier
* `PATCH /api/v1/users/:id/suspend` — suspendre
* `PATCH /api/v1/users/:id/activate` — réactiver

### Patients

* `GET /api/v1/patients` — recherche / filtres
* `POST /api/v1/patients` — créer dossier
* `GET /api/v1/patients/:id` — voir dossier
* `PUT /api/v1/patients/:id` — modifier
* `DELETE /api/v1/patients/:id` — supprimer (soft delete recommandé)

### Appointments

* `GET /api/v1/appointments` — lister
* `POST /api/v1/appointments` — créer (vérification disponibilité)
* `GET /api/v1/appointments/:id` — détail
* `PUT /api/v1/appointments/:id` — modifier (vérif conflits)
* `PATCH /api/v1/appointments/:id/cancel` — annuler
* `PATCH /api/v1/appointments/:id/complete` — marquer complété
* `GET /api/v1/doctors/:id/availability?date=YYYY-MM-DD` — disponibilités

**Prévention conflits** : lors de création/modification, le service vérifie qu'aucun rendez‑vous existant pour le même praticien ne chevauche la plage horaire. En cas de chevauchement → HTTP 409 Conflict.

## Logiciel métier important

* **Service de disponibilité** : calculer créneaux à partir des rendez‑vous existants et des règles (durée par rendez‑vous, pauses)
* **Détection conflit** : recherche d'intervalles qui se chevauchent (utiliser index sur doctorId + date)
* **Rappels par email** : job périodique (cron) qui envoie rappel 24h avant via Redis queue

## Validation & erreurs

* Utiliser Joi pour valider payloads et renvoyer erreurs claires (400)
* Middleware d'erreurs centralisé pour logger et formater les réponses (500, 404, 403, 401, 409)

## Tests

* Unitaires : services critiques (disponibilités, création RDV, auth)
* Intégration : endpoints avec mongodb-memory-server
* Exemples : Supertest pour auth (register/login/refresh)

## Bonnes pratiques & recommandations

* Soft delete pour patients & users (isDeleted / suspended)
* Indexes : `doctorId + startDate` pour accélérer recherche RDV
* Limiter les tentatives de login (brute force)
* Stocker les refresh tokens (Redis) pour pouvoir les révoquer
* Utiliser HTTPS et sécuriser les cookies si tokens en cookies

## Roadmap (prochaines étapes)

1. Implémenter files d'attente (Redis + Bull) pour emails
2. Ajouter calendrier partagé / export ICS
3. Webhooks / intégration SSO (OAuth2) pour grands établissements
4. RBAC fin (policies + permissions détaillées)
5. Dashboard admin + métriques

## Contribution

* Fork → feature branch → PR → revue
* Respecter eslint et tests unitaires

## Licence

MIT

---

*Pour toute modification (par ex. ajouter le flow complet d'email ou détails des schémas), dis-moi ce que tu veux et j'édite le README.*
