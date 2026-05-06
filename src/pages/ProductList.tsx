import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types/Mainview';
import { useCart } from '../contexts/CartContext';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.categorySelect}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.productGrid}>
        {filteredProducts.map(product => (
          <div key={product.id} style={styles.productCard}>
            <Link to={`/product/${product.id}`} style={styles.productLink}>
              <img src={product.image} alt={product.title} style={styles.productImage} />
              <h3 style={styles.productTitle}>{product.title.substring(0, 50)}...</h3>
              <div style={styles.productPrice}>${product.price.toFixed(2)}</div>
              <div style={styles.productRating}>
                Rating: {product.rating.rate} ★ ({product.rating.count} reviews)
              </div>
            </Link>
            <button
              onClick={() => addToCart(product)}
              style={styles.addToCartBtn}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  categorySelect: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  productLink: {
    textDecoration: 'none',
    color: '#333',
  },
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'contain' as const,
    marginBottom: '10px',
  },
  productTitle: {
    fontSize: '16px',
    marginBottom: '10px',
    minHeight: '48px',
  },
  productPrice: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#4fc3f7',
    marginBottom: '10px',
  },
  productRating: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  addToCartBtn: {
    width: '100%',
    backgroundColor: '#4fc3f7',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  loading: {
    textAlign: 'center' as const,
    fontSize: '24px',
    marginTop: '50px',
  },
} as const;