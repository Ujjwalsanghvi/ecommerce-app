import { useWishlist } from '../contexts/WishlistContext';
import React, { useState, useEffect, useRef } from 'react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleFavoriteToggle = (product: Product, e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (isInWishlist(product.id)) {
    removeFromWishlist(product.id);
  } else {
    addToWishlist(product);
  }
};

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="product-list-container">
      <div className="filters-container">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        {/* Custom Dropdown for Categories - Fixes overflow issue */}
        <div className="custom-dropdown" ref={dropdownRef}>
          <button 
            className="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{selectedCategory || 'All Categories'}</span>
            <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div 
                className={`dropdown-item ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => handleCategorySelect('')}
              >
                All Categories
              </div>
              {categories.map(category => (
                <div 
                  key={category}
                  className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card" style={{transform:isInWishlist(product.id) ?'translateY(-4px)':'initial'}}>
            <button
  onClick={(e) => handleFavoriteToggle(product, e)}
  style={{
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'white',
    border: 'none',
    borderRadius: '50%',
    // visibility: 'visible',
    width: '32px',
    height: '32px',
    opacity: 1,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1,
  }}
>
  {isInWishlist(product.id) ? '❤️' : '🤍'}
</button>
            <Link to={`/product/${product.id}`} className="product-link">
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.title} className="product-image" />
              </div>
              <h3 className="product-title">
                {product.title.length > 50 ? product.title.substring(0, 50) + '...' : product.title}
              </h3>
              <div className="product-price">${product.price.toFixed(2)}</div>
              <div className="product-rating">
                <span className="star">★</span>
                <span>{product.rating.rate}</span>
                <span className="review-count">({product.rating.count} reviews)</span>
              </div>
            </Link>
            <button
              onClick={() => addToCart(product)}
              className="add-to-cart-btn"
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .product-list-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          min-height: calc(100vh - 80px);
          overflow-x: hidden;
        }

        /* Filters Section */
        .filters-container {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          padding: 14px 18px;
          font-size: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          outline: none;
          transition: all 0.3s;
          background-color: white;
          min-width: 200px;
        }

        .search-input:focus {
          border-color: #4fc3f7;
          box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1);
        }

        /* Custom Dropdown Styles - Fixes overflow issue */
        .custom-dropdown {
          position: relative;
          min-width: 180px;
        }

        .dropdown-button {
          padding: 14px 18px;
          font-size: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          background-color: white;
          cursor: pointer;
          outline: none;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          font-family:aria-label, sans-serif;
        }

        .dropdown-button:hover {
          border-color: #4fc3f7;
        }

        .dropdown-arrow {
          font-size: 12px;
          color: #666;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 8px;
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 14px;
          color: #333;
        }

        .dropdown-item:hover {
          background-color: #f5f5f5;
        }

        .dropdown-item.active {
          background-color: #e8f4f8;
          color: #4fc3f7;
          font-weight: 500;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        /* Product Card */
        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          opacity: 1;
          visibility: visible;
        }

        .product-link {
          text-decoration: none;
          color: #333;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-image-wrapper {
          padding: 20px;
          background-color: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #f0f0f0;
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: contain;
          transition: transform 0.3s;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-title {
          font-size: 15px;
          font-weight: 500;
          margin: 16px 16px 8px 16px;
          line-height: 1.4;
          min-height: 42px;
          color: #333;
        }

        .product-price {
          font-size: 22px;
          font-weight: bold;
          color: #4fc3f7;
          margin: 0 16px 8px 16px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 0 16px 16px 16px;
          font-size: 14px;
        }

        .star {
          color: #ffc107;
          font-size: 16px;
        }

        .review-count {
          color: #999;
          font-size: 12px;
        }

        .add-to-cart-btn {
          margin: 0 16px 16px 16px;
          background-color: #4fc3f7;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .add-to-cart-btn:hover {
          background-color: #45b5e6;
          transform: scale(1.02);
        }

        .loading {
          text-align: center;
          font-size: 24px;
          margin-top: 50px;
          color: #666;
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 20px;
          }
          
          .product-image {
            height: 180px;
          }
        }

        @media (max-width: 768px) {
          .product-list-container {
            padding: 15px;
          }
          
          .filters-container {
            flex-direction: column;
            gap: 12px;
          }
          
          .search-input {
            width: 100%;
            padding: 12px 16px;
            font-size: 14px;
          }
          
          .custom-dropdown {
            width: 100%;
            min-width: auto;
          }
          
          .dropdown-button {
            padding: 12px 16px;
            font-size: 14px;
          }
          
          .dropdown-menu {
            position: absolute;
            left: 0;
            right: 0;
            width: 100%;
            max-height: 250px;
          }
          
          .dropdown-item {
            padding: 10px 14px;
            font-size: 13px;
          }
          
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 16px;
          }
          
          .product-image {
            height: 160px;
          }
          
          .product-title {
            font-size: 14px;
            margin: 12px 12px 6px 12px;
            min-height: 38px;
          }
          
          .product-price {
            font-size: 20px;
            margin: 0 12px 6px 12px;
          }
          
          .product-rating {
            margin: 0 12px 12px 12px;
            font-size: 13px;
          }
          
          .add-to-cart-btn {
            margin: 0 12px 12px 12px;
            padding: 10px;
            font-size: 13px;
          }
        }

        @media (max-width: 560px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .product-image {
            height: 200px;
          }
        }

        @media (max-width: 480px) {
          .product-list-container {
            padding: 12px;
          }
          
          .search-input,
          .dropdown-button {
            padding: 10px 14px;
            font-size: 14px;
          }
          
          .product-image {
            height: 180px;
          }
          
          .product-title {
            font-size: 13px;
          }
          
          .product-price {
            font-size: 18px;
          }
          
          .product-rating {
            font-size: 12px;
          }
          
          .add-to-cart-btn {
            padding: 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};