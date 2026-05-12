import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              
              {/* Profile Dropdown */}
              <div style={styles.profileContainer} ref={dropdownRef}>
                <button onClick={handleProfileClick} style={styles.profileButton}>
                  <div style={styles.profileIcon}>
                    <span style={styles.profileIconText}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span style={styles.dropdownArrow}>{isProfileOpen ? '▲' : '▼'}</span>
                </button>
                
                {isProfileOpen && (
                  <div style={styles.dropdownMenu}>
                    <div style={styles.userInfo}>
                      <div style={styles.userAvatar}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div style={styles.userDetails}>
                        <div style={styles.userName}>{user?.name}</div>
                        <div style={styles.userEmail}>{user?.email}</div>
                      </div>
                    </div>
                    <div style={styles.dropdownDivider}></div>
                    <Link to="/profile/address" style={styles.dropdownItem}>
                      <span style={styles.dropdownIcon}>📍</span>
                      My Address
                    </Link>
                    <Link to="/profile/orders" style={styles.dropdownItem}>
                      <span style={styles.dropdownIcon}>📦</span>
                      My Orders
                    </Link>
                    <Link to="/profile/wallet" style={styles.dropdownItem}>
                      <span style={styles.dropdownIcon}>💰</span>
                      My Wallet
                    </Link>
                    <div style={styles.dropdownDivider}></div>
                    <button onClick={handleLogout} style={styles.dropdownLogout}>
                      <span style={styles.dropdownIcon}>🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.3s',
    fontSize: '14px',
    fontWeight: '500',
  },
  profileContainer: {
    position: 'relative' as const,
  },
  profileButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px 4px 4px',
    borderRadius: '30px',
    transition: 'background-color 0.3s',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#4fc3f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconText: {
    color: '#1a1a2e',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  dropdownArrow: {
    fontSize: '10px',
    color: 'white',
    marginRight: '4px',
  },
  dropdownMenu: {
    position: 'absolute' as const,
    top: '100%',
    right: '0',
    marginTop: '10px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    minWidth: '260px',
    overflow: 'hidden',
    zIndex: 1000,
    animation: 'slideDown 0.2s ease-out',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#4fc3f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  },
  userEmail: {
    fontSize: '12px',
    color: '#666',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: '#333',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    fontSize: '14px',
    cursor: 'pointer',
  },
  dropdownIcon: {
    fontSize: '18px',
    width: '24px',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '4px 0',
  },
  dropdownLogout: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    color: '#f44336',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    fontSize: '14px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    textAlign: 'left' as const,
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dropdown-item:hover {
    background-color: #f5f5f5;
  }
  
  .dropdown-logout:hover {
    background-color: #ffebee;
  }
  
  .profile-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
document.head.appendChild(styleSheet);