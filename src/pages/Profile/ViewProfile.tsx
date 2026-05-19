import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { Link } from 'react-router-dom';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  profilePicture: string;
  joinDate: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

interface Address {
  id: number;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: string;
}

export const ViewProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { profileData, updateProfilePicture, updateProfileData } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(true);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [editData, setEditData] = useState<ProfileData>(profileData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    loadOrders();
    loadAddresses();
    loadWalletData();
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem(`orders_${user?.id}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const demoOrders: Order[] = [
        {
          id: 'ORD-001',
          date: '2024-05-10',
          total: 299.97,
          status: 'delivered',
          items: [
            {
              id: 1,
              title: 'Fjallraven - Foldsack No. 1 Backpack',
              price: 109.95,
              quantity: 1,
              image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
            }
          ]
        },
        {
          id: 'ORD-002',
          date: '2024-05-05',
          total: 89.99,
          status: 'shipped',
          items: [
            {
              id: 2,
              title: 'Mens Casual Premium Slim Fit T-Shirts',
              price: 22.3,
              quantity: 2,
              image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
            }
          ]
        }
      ];
      setOrders(demoOrders);
      localStorage.setItem(`orders_${user?.id}`, JSON.stringify(demoOrders));
    }
  };

  const loadAddresses = () => {
    const savedAddresses = localStorage.getItem(`addresses_${user?.id}`);
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      const demoAddresses: Address[] = [
        {
          id: 1,
          fullName: user?.name || 'John Doe',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          phone: '+1 234 567 8900',
          isDefault: true
        }
      ];
      setAddresses(demoAddresses);
      localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(demoAddresses));
    }
  };

  const loadWalletData = () => {
    const savedBalance = localStorage.getItem(`wallet_balance_${user?.id}`);
    const savedTransactions = localStorage.getItem(`wallet_transactions_${user?.id}`);
    
    if (savedBalance) {
      setWalletBalance(parseFloat(savedBalance));
    } else {
      setWalletBalance(500.00);
      localStorage.setItem(`wallet_balance_${user?.id}`, '500.00');
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      const demoTransactions: Transaction[] = [
        {
          id: 'TXN-001',
          date: '2024-05-10',
          type: 'credit',
          amount: 500.00,
          description: 'Added money to wallet',
          status: 'completed'
        },
        {
          id: 'TXN-002',
          date: '2024-05-05',
          type: 'debit',
          amount: 89.99,
          description: 'Payment for Order #ORD-002',
          status: 'completed'
        }
      ];
      setTransactions(demoTransactions);
      localStorage.setItem(`wallet_transactions_${user?.id}`, JSON.stringify(demoTransactions));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        updateProfilePicture(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setEditData(profileData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = () => {
    updateProfileData(editData);
    setIsModalOpen(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleStatClick = (statName: string) => {
    if (selectedStat === statName) {
      setSelectedStat(null);
    } else {
      setSelectedStat(statName);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return '#4caf50';
      case 'shipped': return '#2196f3';
      case 'processing': return '#ff9800';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  const totalOrders = orders.length;
  const savedAddresses = addresses.length;

  // Get latest items (only show 1 initially)
  const latestOrders = orders.slice(0, 1);
  const latestAddresses = addresses.slice(0, 1);
  const latestTransactions = transactions.slice(0, 1);

  return (
    <div className="profile-page">
      {/* Sidebar - Left Side */}
      <div className="profile-sidebar">
        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            {profileData.profilePicture ? (
              <img src={profileData.profilePicture} alt="Profile" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                <span className="avatar-text">
                  {profileData.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <button onClick={() => fileInputRef.current?.click()} className="camera-btn">
              📷
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
          </div>
          <h3 className="profile-name">{profileData.fullName}</h3>
          <p className="profile-email">{profileData.email}</p>
          <button onClick={handleEditClick} className="edit-info-btn">
            ✏️ Edit Personal Information
          </button>
        </div>

        <div className="basic-details-section">
          <h4 className="section-subtitle">BASIC DETAILS</h4>
          <div className="detail-item">
            <div className="detail-info">
              <span className="detail-label">NAME</span>
              <span className="detail-value">{profileData.fullName}</span>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-info">
              <span className="detail-label">GENDER</span>
              <span className="detail-value">
                {profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : 'Not specified'}
              </span>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-info">
              <span className="detail-label">MOBILE</span>
              <span className="detail-value">{profileData.phone || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Right Side */}
      <div className="profile-main">
        <div className="profile-header">
          <h1 className="profile-title">Profile Dashboard</h1>
        </div>

        {/* Account Statistics Section */}
        <div className="stats-section">
          <div className="section-header" onClick={() => setIsStatsOpen(!isStatsOpen)}>
            <span className="section-icon">📊</span>
            <h2 className="section-title">Account Statistics</h2>
            <span className="section-arrow">{isStatsOpen ? '▼' : '▶'}</span>
          </div>
          {isStatsOpen && (
            <div className="section-content">
              <div className="stats-list">
                {/* Total Orders */}
                <div className="stat-card" onClick={() => handleStatClick('orders')}>
                  <span className="stat-emoji">📦</span>
                  <span className="stat-name">Total Orders</span>
                  <span className="stat-number">{totalOrders}</span>
                  <span className="stat-toggle">{selectedStat === 'orders' ? '▲' : '▼'}</span>
                </div>
                {selectedStat === 'orders' && (
                  <div className="stat-details">
                    {orders.length === 0 ? (
                      <p className="no-data">No orders found</p>
                    ) : (
                      <>
                        {latestOrders.map(order => (
                          <div key={order.id} className="order-card">
                            <div className="order-header">
                              <span className="order-id">Order #{order.id}</span>
                              <span className={`order-status status-${order.status}`}>{order.status}</span>
                            </div>
                            <div className="order-date">Placed on: {new Date(order.date).toLocaleDateString()}</div>
                            {order.items.map(item => (
                              <div key={item.id} className="order-item">
                                <img src={item.image} alt={item.title} className="order-item-img" />
                                <div className="order-item-details">
                                  <div className="order-item-title">{item.title.substring(0, 50)}</div>
                                  <div>Quantity: {item.quantity}</div>
                                  <div>Price: ${item.price.toFixed(2)}</div>
                                </div>
                                <div className="order-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                              </div>
                            ))}
                            <div className="order-total">Total: ${order.total.toFixed(2)}</div>
                          </div>
                        ))}
                        {orders.length > 1 && (
                          <div className="view-more-container">
                            <Link to="/profile/orders" className="view-more-link">
                              View More Orders →
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Saved Addresses */}
                <div className="stat-card" onClick={() => handleStatClick('addresses')}>
                  <span className="stat-emoji">📍</span>
                  <span className="stat-name">Saved Addresses</span>
                  <span className="stat-number">{savedAddresses}</span>
                  <span className="stat-toggle">{selectedStat === 'addresses' ? '▲' : '▼'}</span>
                </div>
                {selectedStat === 'addresses' && (
                  <div className="stat-details">
                    {addresses.length === 0 ? (
                      <p className="no-data">No addresses saved</p>
                    ) : (
                      <>
                        {latestAddresses.map(address => (
                          <div key={address.id} className="address-card">
                            {address.isDefault && <span className="default-badge">Default</span>}
                            <p><strong>{address.fullName}</strong></p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                            <p>{address.country}</p>
                            <p>📞 {address.phone}</p>
                          </div>
                        ))}
                        {addresses.length > 1 && (
                          <div className="view-more-container">
                            <Link to="/profile/address" className="view-more-link">
                              View More Addresses →
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Wallet Balance */}
                <div className="stat-card" onClick={() => handleStatClick('wallet')}>
                  <span className="stat-emoji">💰</span>
                  <span className="stat-name">Wallet Balance</span>
                  <span className="stat-number">${walletBalance.toFixed(2)}</span>
                  <span className="stat-toggle">{selectedStat === 'wallet' ? '▲' : '▼'}</span>
                </div>
                {selectedStat === 'wallet' && (
                  <div className="stat-details">
                    <div className="wallet-card">
                      <div className="current-balance">
                        Current Balance: <span className="balance-amount">${walletBalance.toFixed(2)}</span>
                      </div>
                      <Link to="/profile/wallet" className="add-money-link">+ Add Money</Link>
                    </div>
                    <div className="transactions-title">Recent Transaction</div>
                    {transactions.length === 0 ? (
                      <p className="no-data">No transactions yet</p>
                    ) : (
                      <>
                        {latestTransactions.map(transaction => (
                          <div key={transaction.id} className="transaction-card">
                            <div className="transaction-info">
                              <div>
                                <div className="transaction-desc">{transaction.description}</div>
                                <div className="transaction-date">{transaction.date}</div>
                              </div>
                              <div className={`transaction-amount ${transaction.type}`}>
                                {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                              </div>
                            </div>
                            <div className="transaction-status">
                              <span className={`status-badge status-${transaction.status}`}>{transaction.status}</span>
                            </div>
                          </div>
                        ))}
                        {transactions.length > 1 && (
                          <div className="view-more-container">
                            <Link to="/profile/wallet" className="view-more-link">
                              View All Transactions →
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Personal Information Section */}
        <div className="personal-info-section">
          <div className="section-header" onClick={() => setIsPersonalInfoOpen(!isPersonalInfoOpen)}>
            <span className="section-icon">👤</span>
            <h2 className="section-title">Personal Information</h2>
            <span className="section-arrow">{isPersonalInfoOpen ? '▼' : '▶'}</span>
          </div>
          {isPersonalInfoOpen && (
            <div className="section-content">
              <div className="info-grid">
                <div className="info-field">
                  <label className="info-label">Email Address</label>
                  <p className="info-value">{profileData.email}</p>
                </div>
                <div className="info-field">
                  <label className="info-label">Date of Birth</label>
                  <p className="info-value">{profileData.dateOfBirth || 'Not provided'}</p>
                </div>
                <div className="info-field full-width">
                  <label className="info-label">Bio</label>
                  <p className="info-value">{profileData.bio || 'No bio provided'}</p>
                </div>
                <div className="info-field">
                  <label className="info-label">Member Since</label>
                  <p className="info-value">{new Date(profileData.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out Button - At the bottom for both desktop and mobile */}
        <div className="signout-bottom-container">
          <button onClick={logout} className="signout-bottom-btn">
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Personal Information</h2>
              <button onClick={handleModalClose} className="close-modal">✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-field">
                <label>Full Name</label>
                <input type="text" value={editData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
              </div>
              <div className="modal-field">
                <label>Email Address</label>
                <input type="email" value={editData.email} disabled />
                <small>Email cannot be changed</small>
              </div>
              <div className="modal-field">
                <label>Phone Number</label>
                <input type="tel" value={editData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="Enter your phone number" />
              </div>
              <div className="modal-field">
                <label>Date of Birth</label>
                <input type="date" value={editData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} />
              </div>
              <div className="modal-field">
                <label>Gender</label>
                <select value={editData.gender} onChange={(e) => handleInputChange('gender', e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Bio</label>
                <textarea value={editData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} rows={4} placeholder="Tell us about yourself" />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleModalClose} className="cancel-btn">Cancel</button>
              <button onClick={handleSaveChanges} className="save-btn">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .profile-page {
          display: flex;
          min-height: calc(100vh - 80px);
          background-color: #f5f5f5;
        }

        /* Sidebar Styles */
        .profile-sidebar {
          width: 320px;
          background-color: white;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e0e0e0;
          position: sticky;
          top: 80px;
          height: calc(100vh - 80px);
          overflow-y: auto;
        }

        .profile-avatar-section {
          padding: 30px 20px;
          text-align: center;
          border-bottom: 1px solid #e0e0e0;
        }

        .avatar-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 15px;
        }

        .avatar-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #4fc3f7;
        }

        .avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #4fc3f7;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #4fc3f7;
        }

        .avatar-text {
          font-size: 40px;
          font-weight: bold;
          color: white;
        }

        .camera-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background-color: #4fc3f7;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .camera-btn:hover {
          transform: scale(1.1);
        }

        .profile-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
        }

        .profile-email {
          font-size: 12px;
          color: #666;
          margin-bottom: 15px;
        }

        .edit-info-btn {
          background-color: #4fc3f7;
          color: white;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 12px;
          width: 100%;
          transition: all 0.3s;
          border-radius: 20px;
        }

        .edit-info-btn:hover {
          background-color: #45b5e6;
          transform: translateY(-2px);
        }

        .basic-details-section {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .section-subtitle {
          font-size: 12px;
          font-weight: 600;
          color: #999;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }

        .detail-item {
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 10px;
          color: #999;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }

        /* Main Content Styles */
        .profile-main {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        .profile-header {
          margin-bottom: 30px;
        }

        .profile-title {
          font-size: 28px;
          color: #333;
        }

        /* Section Styles */
        .stats-section,
        .personal-info-section {
          background-color: white;
          border-radius: 12px;
          margin-bottom: 20px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 24px;
          cursor: pointer;
          background-color: white;
          transition: background-color 0.3s;
          border-bottom: 1px solid #e0e0e0;
        }

        .section-header:hover {
          background-color: #f8f9fa;
        }

        .section-icon {
          font-size: 24px;
        }

        .section-title {
          flex: 1;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .section-arrow {
          font-size: 16px;
          color: #999;
        }

        .section-content {
          padding: 24px;
        }

        /* Statistics Styles */
        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          transition: all 0.3s;
        }

        .stat-card:hover {
          background-color: #e8f4f8;
          transform: translateX(5px);
        }

        .stat-emoji {
          font-size: 28px;
          width: 45px;
        }

        .stat-name {
          flex: 1;
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .stat-number {
          font-size: 20px;
          font-weight: bold;
          color: #4fc3f7;
        }

        .stat-toggle {
          font-size: 12px;
          color: #999;
        }

        .stat-details {
          margin-top: 15px;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
        }

        /* View More Link */
        .view-more-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 15px;
        }

        .view-more-link {
          background: none;
          border: none;
          color: #4fc3f7;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 12px;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          text-decoration: none;
        }

        .view-more-link:hover {
          color: #45b5e6;
          transform: translateX(3px);
        }

        /* Sign Out Button at Bottom */
        .signout-bottom-container {
          margin-top: 30px;
          margin-bottom: 20px;
        }

        .signout-bottom-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          color: #f44336;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .signout-bottom-btn:hover {
          background-color: #ffebee;
          transform: translateY(-2px);
        }

        /* Personal Information Styles */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .info-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-field.full-width {
          grid-column: span 2;
        }

        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 15px;
          color: #333;
          padding: 6px 0;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal {
          background-color: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-body {
          padding: 20px;
          overflow-y: auto;
        }

        .modal-field {
          margin-bottom: 16px;
        }

        .modal-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .modal-field input,
        .modal-field select,
        .modal-field textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .modal-footer {
          display: flex;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .cancel-btn {
          flex: 1;
          padding: 10px;
          background-color: #f5f5f5;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .save-btn {
          flex: 1;
          padding: 10px;
          background-color: #4fc3f7;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Utility Classes */
        .order-card, .address-card, .transaction-card {
          padding: 15px;
          margin-bottom: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #fafafa;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .order-status {
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          font-size: 11px;
          font-weight: bold;
        }

        .status-delivered { background-color: #4caf50; }
        .status-shipped { background-color: #2196f3; }
        .status-processing { background-color: #ff9800; }
        .status-pending { background-color: #ffc107; }
        .status-cancelled { background-color: #f44336; }

        .order-item {
          display: flex;
          gap: 15px;
          padding: 10px;
          margin: 10px 0;
          background-color: white;
          border-radius: 8px;
        }

        .order-item-img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .order-item-details {
          flex: 1;
          font-size: 12px;
        }

        .order-item-title {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .order-item-price {
          font-weight: bold;
          color: #4fc3f7;
        }

        .order-total {
          text-align: right;
          font-weight: bold;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }

        .address-card {
          position: relative;
        }

        .default-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #4caf50;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
        }

        .wallet-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          color: white;
        }

        .balance-amount {
          font-size: 24px;
          font-weight: bold;
          margin-left: 10px;
        }

        .add-money-link {
          background-color: rgba(255,255,255,0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 12px;
          transition: all 0.3s;
        }

        .add-money-link:hover {
          background-color: rgba(255,255,255,0.3);
        }

        .transactions-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .transaction-card {
          margin-bottom: 10px;
        }

        .transaction-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .transaction-desc {
          font-size: 13px;
          font-weight: 500;
        }

        .transaction-date {
          font-size: 11px;
          color: #666;
        }

        .transaction-amount {
          font-size: 16px;
          font-weight: bold;
        }

        .transaction-amount.credit { color: #4caf50; }
        .transaction-amount.debit { color: #f44336; }

        .status-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 10px;
        }

        .status-completed { background-color: #4caf50; }
        .status-pending { background-color: #ff9800; }

        .no-data {
          text-align: center;
          color: #999;
          padding: 20px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .profile-page {
            flex-direction: column;
          }
          
          .profile-sidebar {
            width: 100%;
            position: relative;
            top: 0;
            height: auto;
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
          }
          
          .profile-main {
            padding: 20px;
          }
          
          .profile-title {
            font-size: 24px;
          }
          
          .section-header {
            padding: 15px 20px;
          }
          
          .section-title {
            font-size: 16px;
          }
          
          .section-content {
            padding: 20px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .info-field.full-width {
            grid-column: span 1;
          }
          
          .stat-card {
            padding: 12px;
          }
          
          .stat-emoji {
            font-size: 24px;
            width: 35px;
          }
          
          .stat-number {
            font-size: 18px;
          }
          
          .order-item {
            flex-direction: column;
            text-align: center;
          }
          
          .order-item-img {
            margin: 0 auto;
          }
          
          .wallet-card {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .signout-bottom-btn {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewProfile;