import { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [pageActuelle, setPageActuelle] = useState(1);
  const [nombrePages, setNombrePages] = useState(0);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [donnees, setDonnees] = useState({
    nom: '',
    description: '',
    prix: '',
    stock: ''
  });
  const [idModification, setIdModification] = useState(null);

  useEffect(() => {
    chargerProduits(pageActuelle);
  }, [pageActuelle]);

  const chargerProduits = async (page) => {
    try {
      setChargement(true);
      const reponse = await fetch(`${API_URL}/products?page=${page}&limit=5`);
      const data = await reponse.json();
      setProduits(data.docs);
      setNombrePages(data.totalPages);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    try {
      const methode = idModification ? 'PUT' : 'POST';
      const url = idModification 
        ? `${API_URL}/products/${idModification}`
        : `${API_URL}/products`;

      await fetch(url, {
        method: methode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...donnees,
          prix: Number(donnees.prix),
          stock: Number(donnees.stock)
        })
      });

      chargerProduits(pageActuelle);
      setAfficherFormulaire(false);
      setDonnees({ nom: '', description: '', prix: '', stock: '' });
      setIdModification(null);
    } catch (err) {
      setErreur(err.message);
    }
  };

  const gererModification = (produit) => {
    setDonnees({
      nom: produit.nom,
      description: produit.description,
      prix: produit.prix,
      stock: produit.stock
    });
    setIdModification(produit._id);
    setAfficherFormulaire(true);
  };

  const gererSuppression = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        chargerProduits(pageActuelle);
      } catch (err) {
        setErreur(err.message);
      }
    }
  };

  if (chargement) return <div className="loading">Chargement...</div>;
  if (erreur) return <div className="error">Erreur: {erreur}</div>;

  return (
    <div className="App">
      <header className="header">
        <h1>Produits E-commerce</h1>
        <button 
          className="add-button"
          onClick={() => {
            setAfficherFormulaire(true);
            setIdModification(null);
            setDonnees({ nom: '', description: '', prix: '', stock: '' });
          }}
        >
          Ajouter un Produit
        </button>
      </header>

      {afficherFormulaire && (
        <div className="form-overlay">
          <form className="product-form" onSubmit={gererSoumission}>
            <h2>{idModification ? 'Modifier le Produit' : 'Ajouter un Produit'}</h2>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={donnees.nom}
                onChange={e => setDonnees({...donnees, nom: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={donnees.description}
                onChange={e => setDonnees({...donnees, description: e.target.value})}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Prix (€)</label>
                <input
                  type="number"
                  value={donnees.prix}
                  onChange={e => setDonnees({...donnees, prix: e.target.value})}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={donnees.stock}
                  onChange={e => setDonnees({...donnees, stock: e.target.value})}
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {idModification ? 'Modifier' : 'Créer'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setAfficherFormulaire(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-grid">
        {produits.map(produit => (
          <div key={produit._id} className="product-card">
            <div className="product-content">
              <h3>{produit.nom}</h3>
              <p className="description">{produit.description}</p>
              <div className="product-details">
                <p className="price">Prix: {produit.prix}€</p>
                <p className="stock">Stock: {produit.stock}</p>
              </div>
            </div>
            <div className="card-buttons">
              <button 
                className="btn-edit" 
                onClick={() => gererModification(produit)}
              >
                Modifier
              </button>
              <button 
                className="btn-delete" 
                onClick={() => gererSuppression(produit._id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button 
          className="btn-nav"
          onClick={() => setPageActuelle(p => p - 1)}
          disabled={pageActuelle === 1}
        >
          Précédent
        </button>
        <span>Page {pageActuelle} sur {nombrePages}</span>
        <button 
          className="btn-nav"
          onClick={() => setPageActuelle(p => p + 1)}
          disabled={pageActuelle === nombrePages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default App;