# Porotein

Porotein est une application mobile de suivi de séances de sport, développée avec React Native et Node.js. L'application permet de suivre les performances sportives, d'enregistrer les données des séances, et d'accéder aux données de santé via l'application Santé d'Apple (HealthKit).

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Structure du Projet](#structure-du-projet)
- [Installation](#installation)
- [Scripts Disponibles](#scripts-disponibles)
- [Configuration de l'Environnement de Développement](#configuration-de-lenvironnement-de-développement)
- [Contribution](#contribution)
- [License](#license)

## Fonctionnalités

- Suivi des séances de sport
- Affichage des statistiques et des graphiques de performance
- Authentification biométrique via Face ID (prévu)
- Intégration du SSO Apple (prévu)
- Accès aux données de santé via HealthKit (prévu)

## Technologies Utilisées

- **Frontend** : React Native, styled-components/native, React Navigation
- **Backend** : Node.js, Express
- **Base de données** : MongoDB
- **Gestion des dépendances** : Yarn Workspaces, Lerna

## Structure du Projetporotein/
│
├── packages/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   ├── navigation/
│   │   │   ├── App.js
│   │   │   ├── …
│   │   ├── …
│   ├── backend/
│   │   ├── index.js
│   │   ├── …
├── package.json
├── lerna.json
└── README.md

## Installation

### Prérequis

- Node.js
- Yarn
- React Native CLI
- Xcode (pour iOS)
- Android Studio (pour Android)

### Étapes d'installation

1. **Cloner le dépôt**

```sh
git clone https://github.com/ton-nom-utilisateur/porotein.git
cd porotein```
