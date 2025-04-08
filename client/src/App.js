import { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products?page=${page}&limit=5`);
      const data = await response.json();
      setProducts(data.docs);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${API_URL}/products/${editingId}`
        : `${API_URL}/products`;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        })
      });

      fetchProducts(currentPage);
      setShowForm(false);
      setFormData({ name: '', description: '', price: '', stock: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        fetchProducts(currentPage);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <header className="header">
        <h1>E-commerce Products</h1>
        <button 
          className="add-button"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', stock: '' });
          }}
        >
          Add New Product
        </button>
      </header>

      {showForm && (
        <div className="form-overlay">
          <form className="product-form" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-content">
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <div className="product-details">
                <p className="price">Price: ${product.price}</p>
                <p className="stock">Stock: {product.stock}</p>
              </div>
            </div>
            <div className="card-buttons">
              <button 
                className="btn-edit" 
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button 
                className="btn-delete" 
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button 
          className="btn-nav"
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          className="btn-nav"
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;