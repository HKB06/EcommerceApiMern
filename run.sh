#!/bin/bash

echo "Démarrage du déploiement..."
echo "Nettoyage des conteneurs existants..."
docker stop db-container express-app react-app 2>/dev/null
docker rm db-container express-app react-app 2>/dev/null
docker network rm ecommerce-network 2>/dev/null

echo "Création du réseau Docker..."
docker network create ecommerce-network

echo "Démarrage du conteneur MongoDB..."
docker run -d \
  --name db-container \
  --network ecommerce-network \
  -v mongodb_data:/data/db \
  mongo

echo "Construction et démarrage de l'API Express..."
docker build -t express-api .
docker run -d \
  --name express-app \
  --network ecommerce-network \
  -p 5000:5000 \
  -e NODE_ENV=development \
  -e MONGO_URI="mongodb://db-container:27017/ecommerce" \
  -e PORT=5000 \
  express-api

echo "Construction et démarrage du frontend React..."
cd client
docker build -t react-app .
docker run -d \
  --name react-app \
  --network ecommerce-network \
  -p 3000:3000 \
  -e REACT_APP_API_URL="http://localhost:5000/api" \
  react-app
cd ..

echo "Attente du démarrage des conteneurs..."
sleep 5

echo "État des conteneurs :"
docker ps

echo "Déploiement terminé !"
echo "Frontend : http://localhost:3000"
echo "API : http://localhost:5000"
