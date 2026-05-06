import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types/Mainview';
import { useCart } from '../contexts/CartContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await api.getProduct(Number(id));
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!product) {
    return <div style={styles.error}>Product not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.productDetail}>
        <div style={styles.imageContainer}>
          <img src={product.image} alt={product.title} style={styles.image} />
        </div>
        
        <div style={styles.infoContainer}>
          <h1 style={styles.title}>{product.title}</h1>
          <p style={styles.category}>Category: {product.category}</p>
          <div style={styles.rating}>
            Rating: {product.rating.rate} ★ ({product.rating.count} reviews)
          </div>
          <p style={styles.description}>{product.description}</p>
          <div style={styles.price}>${product.price.toFixed(2)}</div>
          
          <div style={styles.quantityContainer}>
            <label style={styles.quantityLabel}>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={styles.quantityInput}
            />
          </div>
          
          <button onClick={handleAddToCart} style={styles.addToCartBtn}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  productDetail: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
  },
  imageContainer: {
    textAlign: 'center' as const,
  },
  image: {
    maxWidth: '100%',
    height: '400px',
    objectFit: 'contain' as const,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  title: {
    fontSize: '28px',
    color: '#333',
  },
  category: {
    fontSize: '16px',
    color: '#666',
    textTransform: 'capitalize' as const,
  },
  rating: {
    fontSize: '16px',
    color: '#ffc107',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#666',
  },
  price: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  quantityLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  quantityInput: {
    width: '60px',
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  addToCartBtn: {
    backgroundColor: '#4fc3f7',
    color: 'white',
    border: 'none',
    padding: '15px',
    fontSize: '18px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  },
  loading: {
    textAlign: 'center' as const,
    fontSize: '24px',
    marginTop: '50px',
  },
  error: {
    textAlign: 'center' as const,
    fontSize: '24px',
    marginTop: '50px',
    color: '#f44336',
  },
} as const;