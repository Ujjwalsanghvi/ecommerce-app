import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useCart } from '../contexts/CartContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { profileData } = useProfile();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const profilePicture = profileData?.profilePicture;
  const userName = profileData?.fullName || user?.name || 'User';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          E-Shop
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="menu-icon">{isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>
        
        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <Link to="/products" className="nav-link">
            Products
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-link">
                Cart ({getCartCount()})
              </Link>
              
              {/* View Profile Link - Desktop */}
              <Link to="/profile/view" className="view-profile-link">
                View Profile
              </Link>
              
              <div className="profile-container" ref={dropdownRef}>
                <button onClick={handleProfileClick} className="profile-btn">
                  <div className="profile-icon">
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="profile-img" />
                    ) : (
                      <span className="profile-icon-text">
                        {userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="user-name">{userName.split(' ')[0]}</span>
                  <span className="dropdown-arrow">{isProfileOpen ? '▲' : '▼'}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="dropdown-menu">
                    <div className="user-info">
                      <div className="user-avatar">
                        {profilePicture ? (
                          <img src={profilePicture} alt="Profile" className="user-avatar-img" />
                        ) : (
                          <span>{userName?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{userName}</div>
                        <div className="user-email">{user?.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile/address" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      <span className="dropdown-icon">📍</span>
                      My Address
                    </Link>
                    <Link to="/profile/orders" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      <span className="dropdown-icon">📦</span>
                      My Orders
                    </Link>
                    <Link to="/profile/wallet" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      <span className="dropdown-icon">💰</span>
                      My Wallet
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-logout">
                      <span className="dropdown-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Signup
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-nav" ref={mobileMenuRef}>
            <Link to="/products" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Cart ({getCartCount()})
                </Link>
                {/* View Profile is NOT here - removed from mobile menu */}
                <Link to="/profile/address" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  My Address
                </Link>
                <Link to="/profile/orders" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  My Orders
                </Link>
                <Link to="/profile/wallet" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  My Wallet
                </Link>
                {/* View Profile added here - below My Wallet */}
                <Link to="/profile/view" className="mobile-link view-profile-mobile" onClick={() => setIsMobileMenuOpen(false)}>
                  👤 View Profile
                </Link>
                <button onClick={handleLogout} className="mobile-logout">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Signup
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .navbar {
          background-color: #1a1a2e;
          color: white;
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
        }

        .desktop-nav {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background-color 0.3s;
          font-size: 14px;
          font-weight: 500;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .view-profile-link {
          color: #4fc3f7;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.3s;
          font-size: 14px;
          font-weight: 500;
          background-color: rgba(79, 195, 247, 0.1);
          border: 1px solid rgba(79, 195, 247, 0.3);
        }

        .view-profile-link:hover {
          background-color: rgba(79, 195, 247, 0.2);
          transform: translateY(-2px);
        }

        .profile-container {
          position: relative;
        }

        .profile-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 4px;
          borderRadius: 30px;
          transition: background-color 0.3s;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 30px;
        }

        .profile-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .profile-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #4fc3f7;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-icon-text {
          color: #1a1a2e;
          font-size: 18px;
          font-weight: bold;
        }

        .user-name {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .dropdown-arrow {
          font-size: 10px;
          color: white;
          margin-left: 4px;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 10px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          min-width: 260px;
          overflow: hidden;
          z-index: 1000;
          animation: slideDown 0.2s ease-out;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background-color: #f8f9fa;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #4fc3f7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          color: #1a1a2e;
          overflow: hidden;
        }

        .user-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-details {
          flex: 1;
        }

        .user-email {
          font-size: 12px;
          color: #666;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #333;
          text-decoration: none;
          transition: background-color 0.2s;
          font-size: 14px;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background-color: #f5f5f5;
        }

        .dropdown-icon {
          font-size: 18px;
          width: 24px;
        }

        .dropdown-divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 4px 0;
        }

        .dropdown-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          color: #f44336;
          text-decoration: none;
          transition: background-color 0.2s;
          font-size: 14px;
          cursor: pointer;
          background: none;
          border: none;
          text-align: left;
        }

        .dropdown-logout:hover {
          background-color: #ffebee;
        }

        /* Mobile Navigation */
        .mobile-nav {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: #1a1a2e;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 999;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .mobile-link {
          color: white;
          text-decoration: none;
          padding: 10px;
          font-size: 16px;
          text-align: center;
          background-color: rgba(255,255,255,0.1);
          border-radius: 8px;
        }

        .view-profile-mobile {
          background-color: rgba(79, 195, 247, 0.2);
          border: 1px solid rgba(79, 195, 247, 0.3);
          color: #4fc3f7;
        }

        .mobile-logout {
          background-color: rgba(244, 67, 54, 0.2);
          color: #f44336;
          border: none;
          padding: 10px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          text-align: center;
        }

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

        /* Responsive */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          
          .mobile-menu-btn {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .mobile-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;