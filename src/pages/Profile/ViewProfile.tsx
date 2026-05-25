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

  const latestOrders = orders.slice(0, 1);
  const latestAddresses = addresses.slice(0, 1);
  const latestTransactions = transactions.slice(0, 1);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-100">
      {/* Sidebar - Left Side */}
      <div className="w-80 bg-white flex flex-col border-r border-gray-200 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-8 text-center border-b border-gray-200">
          <div className="relative inline-block mb-4">
            {profileData.profilePicture ? (
              <img src={profileData.profilePicture} alt="Profile" className="w-[100px] h-[100px] rounded-full object-cover border-4 border-blue-400" />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-blue-400 flex items-center justify-center border-4 border-blue-400">
                <span className="text-white text-4xl font-bold">
                  {profileData.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-blue-400 border-none rounded-full w-8 h-8 text-base cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110">
              📷
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
          </div>
          <h3 className="text-base font-bold mb-1 text-gray-800">{profileData.fullName}</h3>
          <p className="text-xs text-gray-500 mb-4">{profileData.email}</p>
          <button onClick={handleEditClick} className="bg-blue-400 text-white border-none py-2 px-4 cursor-pointer text-xs w-full transition-all duration-300 rounded-full hover:bg-blue-500 hover:-translate-y-0.5">
            ✏️ Edit Personal Information
          </button>
        </div>

        <div className="p-5 border-b border-gray-200">
          <h4 className="text-xs font-semibold text-gray-400 mb-4 tracking-wide">BASIC DETAILS</h4>
          <div className="py-2 border-b border-gray-100">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 tracking-wide">NAME</span>
              <span className="text-sm text-gray-800 font-medium">{profileData.fullName}</span>
            </div>
          </div>
          <div className="py-2 border-b border-gray-100">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 tracking-wide">GENDER</span>
              <span className="text-sm text-gray-800 font-medium">
                {profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : 'Not specified'}
              </span>
            </div>
          </div>
          <div className="py-2 border-b border-gray-100">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 tracking-wide">MOBILE</span>
              <span className="text-sm text-gray-800 font-medium">{profileData.phone || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Right Side */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-[28px] text-gray-800">Profile Dashboard</h1>
        </div>

        {/* Account Statistics Section */}
        <div className="bg-white rounded-xl mb-5 overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 p-4 cursor-pointer bg-white transition-colors duration-300 border-b border-gray-200 hover:bg-gray-50" onClick={() => setIsStatsOpen(!isStatsOpen)}>
            <span className="text-2xl">📊</span>
            <h2 className="flex-1 text-lg font-semibold text-gray-800 m-0">Account Statistics</h2>
            <span className="text-base text-gray-400">{isStatsOpen ? '▼' : '▶'}</span>
          </div>
          {isStatsOpen && (
            <div className="p-6">
              <div className="flex flex-col gap-3">
                {/* Total Orders */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:translate-x-1" onClick={() => handleStatClick('orders')}>
                  <span className="text-3xl w-11">📦</span>
                  <span className="flex-1 text-sm text-gray-500 font-medium">Total Orders</span>
                  <span className="text-xl font-bold text-blue-400">{totalOrders}</span>
                  <span className="text-xs text-gray-400">{selectedStat === 'orders' ? '▲' : '▼'}</span>
                </div>
                {selectedStat === 'orders' && (
                  <div className="mt-4 p-5 bg-white rounded-xl border border-gray-200">
                    {orders.length === 0 ? (
                      <p className="text-center text-gray-400 p-5">No orders found</p>
                    ) : (
                      <>
                        {latestOrders.map(order => (
                          <div key={order.id} className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex justify-between mb-2">
                              <span className="font-bold text-sm">Order #{order.id}</span>
                              <span className={`px-2 py-1 rounded text-white text-[11px] font-bold bg-${order.status === 'delivered' ? 'green-500' : order.status === 'shipped' ? 'blue-500' : order.status === 'processing' ? 'orange-500' : order.status === 'pending' ? 'yellow-500' : 'red-500'}`}>{order.status}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-2">Placed on: {new Date(order.date).toLocaleDateString()}</div>
                            {order.items.map(item => (
                              <div key={item.id} className="flex gap-4 p-2 my-2 bg-white rounded-lg">
                                <img src={item.image} alt={item.title} className="w-12 h-12 object-contain" />
                                <div className="flex-1 text-xs">
                                  <div className="font-medium mb-1">{item.title.substring(0, 50)}</div>
                                  <div>Quantity: {item.quantity}</div>
                                  <div>Price: ${item.price.toFixed(2)}</div>
                                </div>
                                <div className="font-bold text-blue-400">${(item.price * item.quantity).toFixed(2)}</div>
                              </div>
                            ))}
                            <div className="text-right font-bold mt-2 pt-2 border-t border-gray-200">Total: ${order.total.toFixed(2)}</div>
                          </div>
                        ))}
                        {orders.length > 1 && (
                          <div className="flex justify-end mt-4">
                            <Link to="/profile/orders" className="bg-none border-none text-blue-400 cursor-pointer text-[13px] font-medium px-3 py-2 transition-all duration-300 inline-flex items-center gap-1 no-underline hover:text-blue-500 hover:translate-x-1">
                              View More Orders →
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Saved Addresses */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:translate-x-1" onClick={() => handleStatClick('addresses')}>
                  <span className="text-3xl w-11">📍</span>
                  <span className="flex-1 text-sm text-gray-500 font-medium">Saved Addresses</span>
                  <span className="text-xl font-bold text-blue-400">{savedAddresses}</span>
                  <span className="text-xs text-gray-400">{selectedStat === 'addresses' ? '▲' : '▼'}</span>
                </div>
                {selectedStat === 'addresses' && (
                  <div className="mt-4 p-5 bg-white rounded-xl border border-gray-200">
                    {addresses.length === 0 ? (
                      <p className="text-center text-gray-400 p-5">No addresses saved</p>
                    ) : (
                      <>
                        {latestAddresses.map(address => (
                          <div key={address.id} className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                            {address.isDefault && <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded text-[10px]">Default</span>}
                            <p><strong>{address.fullName}</strong></p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                            <p>{address.country}</p>
                            <p>📞 {address.phone}</p>
                          </div>
                        ))}
                        {addresses.length > 1 && (
                          <div className="flex justify-end mt-4">
                            <Link to="/profile/address" className="bg-none border-none text-blue-400 cursor-pointer text-[13px] font-medium px-3 py-2 transition-all duration-300 inline-flex items-center gap-1 no-underline hover:text-blue-500 hover:translate-x-1">
                              View More Addresses →
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Wallet Balance */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:translate-x-1" onClick={() => handleStatClick('wallet')}>
                  <span className="text-3xl w-11">💰</span>
                  <span className="flex-1 text-sm text-gray-500 font-medium">Wallet Balance</span>
                  <span className="text-xl font-bold text-blue-400">${walletBalance.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">{selectedStat === 'wallet' ? '▲' : '▼'}</span>
                </div>
                {selectedStat === 'wallet' && (
                  <div className="mt-4 p-5 bg-white rounded-xl border border-gray-200">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-xl flex justify-between items-center mb-5 text-white">
                      <div className="text-base">
                        Current Balance: <span className="text-2xl font-bold ml-2">${walletBalance.toFixed(2)}</span>
                      </div>
                      <Link to="/profile/wallet" className="bg-white/20 text-white px-4 py-2 rounded-md text-xs no-underline transition-all duration-300 hover:bg-white/30">+ Add Money</Link>
                    </div>
                    <div className="text-sm font-bold mb-2">Recent Transaction</div>
                    {transactions.length === 0 ? (
                      <p className="text-center text-gray-400 p-5">No transactions yet</p>
                    ) : (
                      <>
                        {latestTransactions.map(transaction => (
                          <div key={transaction.id} className="p-3 mb-2 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex justify-between mb-2">
                              <div>
                                <div className="text-sm font-medium">{transaction.description}</div>
                                <div className="text-xs text-gray-500">{transaction.date}</div>
                              </div>
                              <div className={`text-base font-bold ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-2 py-0.5 rounded text-white text-[10px] ${transaction.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}>{transaction.status}</span>
                            </div>
                          </div>
                        ))}
                        {transactions.length > 1 && (
                          <div className="flex justify-end mt-4">
                            <Link to="/profile/wallet" className="bg-none border-none text-blue-400 cursor-pointer text-[13px] font-medium px-3 py-2 transition-all duration-300 inline-flex items-center gap-1 no-underline hover:text-blue-500 hover:translate-x-1">
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
        <div className="bg-white rounded-xl mb-5 overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 p-4 cursor-pointer bg-white transition-colors duration-300 border-b border-gray-200 hover:bg-gray-50" onClick={() => setIsPersonalInfoOpen(!isPersonalInfoOpen)}>
            <span className="text-2xl">👤</span>
            <h2 className="flex-1 text-lg font-semibold text-gray-800 m-0">Personal Information</h2>
            <span className="text-base text-gray-400">{isPersonalInfoOpen ? '▼' : '▶'}</span>
          </div>
          {isPersonalInfoOpen && (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                  <p className="text-base text-gray-800 py-1.5">{profileData.email}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</label>
                  <p className="text-base text-gray-800 py-1.5">{profileData.dateOfBirth || 'Not provided'}</p>
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
                  <p className="text-base text-gray-800 py-1.5">{profileData.bio || 'No bio provided'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Member Since</label>
                  <p className="text-base text-gray-800 py-1.5">{new Date(profileData.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out Button at Bottom */}
        <div className="mt-8 mb-5">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-red-500 cursor-pointer text-base font-medium transition-all duration-300 hover:bg-red-50 hover:-translate-y-0.5">
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-xl w-[90%] max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 m-0">Edit Personal Information</h2>
              <button onClick={handleModalClose} className="bg-none border-none text-xl cursor-pointer text-gray-400 w-8 h-8 flex items-center justify-center rounded hover:text-gray-800">✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">Full Name</label>
                <input type="text" value={editData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">Email Address</label>
                <input type="email" value={editData.email} disabled className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-gray-100" />
                <small className="text-xs text-gray-400 mt-1 block">Email cannot be changed</small>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">Phone Number</label>
                <input type="tel" value={editData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="Enter your phone number" className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">Date of Birth</label>
                <input type="date" value={editData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">Gender</label>
                <select value={editData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">Bio</label>
                <textarea value={editData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} rows={4} placeholder="Tell us about yourself" className="w-full p-2.5 border border-gray-300 rounded-md text-sm font-inherit resize-vertical" />
              </div>
            </div>
            <div className="flex gap-2.5 p-5 border-t border-gray-200">
              <button onClick={handleModalClose} className="flex-1 py-2.5 bg-gray-100 border-none rounded-md cursor-pointer text-sm hover:bg-gray-200">Cancel</button>
              <button onClick={handleSaveChanges} className="flex-1 py-2.5 bg-blue-400 text-white border-none rounded-md cursor-pointer text-sm hover:bg-blue-500">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .flex.min-h-\\[calc\\(100vh-80px\\)\\] {
            flex-direction: column;
          }
          .w-80 {
            width: 100%;
            position: relative;
            top: 0;
            height: auto;
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
          }
          .flex-1 {
            padding: 20px;
          }
          .text-\\[28px\\] {
            font-size: 24px;
          }
          .grid-cols-2 {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .col-span-2 {
            grid-column: span 1;
          }
          .gap-4 {
            gap: 12px;
          }
          .p-4 {
            padding: 12px;
          }
          .text-3xl {
            font-size: 24px;
            width: 35px;
          }
          .text-xl {
            font-size: 18px;
          }
          .order-item {
            flex-direction: column;
            text-align: center;
          }
          .order-item-img {
            margin: 0 auto;
          }
          .bg-gradient-to-r {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewProfile;