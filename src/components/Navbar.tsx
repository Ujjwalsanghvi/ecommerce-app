import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          E-Shop
        </Link>
        
        <div style={styles.navLinks}>
          <Link to="/products" style={styles.link}>
            Products
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" style={styles.link}>
                Cart ({getCartCount()})
              </Link>
              <span style={styles.userName}>Hello, {user?.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/signup" style={styles.link}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '1rem 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  userName: {
    color: '#4fc3f7',
  },
  logoutBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
} as const;