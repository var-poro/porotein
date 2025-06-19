#!/bin/bash

# Script pour installer les dépendances et exécuter les tests

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Installation des dépendances ===${NC}"
pnpm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Échec de l'installation des dépendances${NC}"
    exit 1
fi

echo -e "${BLUE}=== Création des dossiers manquants pour les tests ===${NC}"
mkdir -p tests/integration

echo -e "${BLUE}=== Exécution des tests ===${NC}"
pnpm test

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Les tests ont été exécutés avec succès${NC}"
    echo -e "${BLUE}=== Génération du rapport de couverture ===${NC}"
    pnpm test:coverage
    
    echo -e "${GREEN}✓ Rapport de couverture généré${NC}"
    echo -e "${BLUE}Vous pouvez consulter le rapport détaillé dans le dossier coverage/lcov-report/index.html${NC}"
else
    echo -e "${RED}✗ Échec des tests${NC}"
    exit 1
fi 