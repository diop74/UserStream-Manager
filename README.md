🎬 StreamAdmin - Gestion des Abonnements Netflix & Prime Video

Application complète de gestion des utilisateurs Netflix et Prime Video avec un dashboard d'administration moderne.

🚀 Fonctionnalités

Dashboard moderne avec statistiques utilisateurs

Gestion séparée des abonnés Netflix et Prime Video

CRUD complet (ajout, modification, suppression d’utilisateurs)

Calcul automatique des dates d’expiration

Alertes pour les abonnements expirés

Filtres et recherche par service et statut

🔧 Stack Technique

Frontend : React + Vite + Tailwind CSS

Backend : Node.js + Express

Base de données : MongoDB (via Mongoose)

Authentification : JWT

📋 Installation

Cloner le projet

git clone <repo-url>
cd streamadmin


Installer les dépendances

npm install


Configurer les variables d’environnement
Créez un fichier .env à la racine avec par exemple :

MONGODB_URI=your_mongodb_uri
PORT=3001
JWT_SECRET=your_jwt_secret


Lancer l’application

npm run dev


Frontend : http://localhost:5173

Backend API : http://localhost:3001

🗄️ Modèle Utilisateur
{
  name: String,
  email: String,
  service: "Netflix" | "PrimeVideo",
  subscriptionDate: Date,
  validityMonths: Number,
  expirationDate: Date,
  status: "Active" | "Expired"
}

📡 API Principale

GET /api/users → liste des utilisateurs

POST /api/users → créer un utilisateur

PUT /api/users/:id → modifier un utilisateur

DELETE /api/users/:id → supprimer un utilisateur

🎨 Technologies

React 18 + Vite

Tailwind CSS

Node.js + Express

MongoDB + Mongoose

JWT

