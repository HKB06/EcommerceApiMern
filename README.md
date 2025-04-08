# E-commerce API

## Objectif
API E-commerce RESTful avec architecture MVC, gérant produits, clients et commandes (incluant une commande directe).

---
## Installation et Lancement

### Prérequis
- Docker et Docker Compose installés
- Git pour cloner le projet

### Configuration initiale
1. Cloner le projet et accéder à la branche :
```bash
git clone https://github.com/HKB06/EcommerceApiMern.git
cd EcommerceApiMern
git checkout docker-exo
```

2. Configurer les variables d'environnement :

```bash
# Pour l'API
cp .env.example .env


# Pour le frontend React
cd client
cp .env.example .env
cd ..
```
### Lancement avec Docker
1. S'assurer que Docker est démarré
2. Lancer l'application complète :

```bash
./run.sh
```
Ce script va :

* Arrêter les conteneurs existants (si présents)
* Créer le réseau Docker
* Construire et démarrer les conteneurs :
  * MongoDB (db-container)
  * API Express (express-app)
  * Frontend React (react-app)

### Accès à l'application

* Interface utilisateur : http://localhost:3000
* API : http://localhost:5000
* Base de données : mongodb://localhost:27017
### Commandes Docker utiles
```bash
# Voir les logs des conteneurs
docker logs express-app    # Logs de l'API
docker logs react-app      # Logs du frontend
docker logs db-container   # Logs de MongoDB
```

# Arrêter les conteneurs
```bash
docker stop express-app react-app db-container
```

# Supprimer les conteneurs
```bash
docker rm express-app react-app db-container
```

# Voir les conteneurs en cours d'exécution
```bash
docker ps
```
### Script de test
Le fichier test.sh envoie des requêtes (produits, clients, commandes).  
Pour l’exécuter :  
```bash
./test.sh
```
--- 
## Fonctionnalités
- Produits : créer, lister, récupérer par ID, mettre à jour, supprimer  
- Clients : créer, lister  
- Commandes : créer, récupérer par ID, mettre à jour, supprimer  
- Commande directe : créer rapidement une commande pour un client existant  
- Recherche & pagination 

---

## Spécifications
### Modèles
#### Product
- name : String (requis)  
- description : String  
- price : Number (requis)  
- stock : Number (défaut : 0)

#### Customer
- name : String (requis)  
- email : String (requis, unique)  
- address : String  

#### Order
- customer : ObjectId (référence Customer, requis)  
- products : tableau d’ObjectId (référence Product)

### Contrôleurs
#### Product Controller
- createProduct  
- getAllProducts (gère search, page, limit)  
- getProductById  
- updateProduct  
- deleteProduct  

#### Customer Controller
- createCustomer  
- getCustomers  

#### Order Controller
- createOrder (vérifie l’existence du client)  
- getOrderById (populate client/produits)  
- updateOrder  
- deleteOrder  
- createDirectOrder (commande directe)

### Routes
| Action                          | Méthode | Endpoint                          | Description                                  |
|---------------------------------|---------|-----------------------------------|----------------------------------------------|
| Créer un produit                | POST    | /api/products                     | Ajoute un nouveau produit                    |
| Lister les produits            | GET     | /api/products                     | Récupère tous les produits (search/page)     |
| Récupérer un produit           | GET     | /api/products/:id                 | Récupère un produit par ID                   |
| Mettre à jour un produit       | PUT     | /api/products/:id                 | Met à jour un produit                        |
| Supprimer un produit           | DELETE  | /api/products/:id                 | Supprime un produit                          |
| Créer un client                | POST    | /api/customers                    | Ajoute un nouveau client                     |
| Lister les clients             | GET     | /api/customers                    | Récupère tous les clients                    |
| Créer une commande             | POST    | /api/orders                       | Place une nouvelle commande                  |
| Récupérer une commande         | GET     | /api/orders/:id                   | Récupère une commande par ID                 |
| Mettre à jour une commande     | PUT     | /api/orders/:id                   | Met à jour une commande                      |
| Supprimer une commande         | DELETE  | /api/orders/:id                   | Supprime une commande                        |
| Commande directe               | POST    | /api/orders/direct/:customerId    | Crée une commande pour un client existant    |

---

## Conclusion
Structure MVC, routes REST, run.sh pour lancer via Docker, test.sh pour vérifier le fonctionnement. Extensible avec validations, authentification, etc.

## Contributeur
Hugo Khaled Brotons 