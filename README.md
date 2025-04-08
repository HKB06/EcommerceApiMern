# E-commerce API

## Objectif
API E-commerce RESTful avec architecture MVC, gérant produits, clients et commandes (incluant une commande directe).

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

## Configuration & Lancement
### Via Docker
1. Lancer Docker  
2. Dans le dossier du projet :  
    ```bash
    ./run.sh
    npm install
    npm start
    ```
    L’API écoute sur http://localhost:5000

### Script de test
Le fichier test.sh envoie des requêtes (produits, clients, commandes).  
Pour l’exécuter :  
```bash
./test.sh
```

### Bonus
- Recherche : GET /api/products?search=lap  
- Pagination : GET /api/products?page=2&limit=3  
- Validations : vérifier price ou stock négatif

---

## Exemple de commande directe
```bash
curl -X POST --json '{
  "products": ["<ID_PRODUIT>"]
}' http://localhost:5000/api/orders/direct/<ID_CLIENT>
```
Retour JSON :
```json
{
  "message": "Order created successfully",
  "order": {
     "_id": "<ID_DE_LA_COMMANDE>",
     "customer": "<ID_CLIENT>",
     "products": ["<ID_PRODUIT>"]
  }
}
```

---

## Conclusion
Structure MVC, routes REST, run.sh pour lancer via Docker, test.sh pour vérifier le fonctionnement. Extensible avec validations, authentification, etc.

## Contributeur
Hugo Khaled Brotons 