import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ProfileData } from '../types/ProfileData';
import { IAddress } from '../types/Address';
import { Transaction } from '../types/Transaction';
import { ImpOrder } from '../types/ImpOrder';
import { ProfileContextType } from '../types/ProfileContextType';


const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    profilePicture: '',
    joinDate: new Date().toISOString().split('T')[0]
  });
  const [editData, setEditData] = useState<ProfileData>(profileData);

  // Statistics state
  const [orders, setOrders] = useState<ImpOrder[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    loadProfileData();
    loadStatistics();
  }, [user?.id]);

  useEffect(() => {
    setEditData(profileData);
  }, [profileData]);

  const loadProfileData = () => {
    const savedProfile = localStorage.getItem(`profile_${user?.id}`);
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
    }
  };

  const loadStatistics = () => {
    loadOrders();
    loadAddresses();
    loadWalletData();
  };

  const loadOrders = () => {
    const savedOrders = localStorage.getItem(`orders_${user?.id}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const demoOrders: ImpOrder[] = [
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
              image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
            },
          ],
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
              image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
            },
          ],
        },
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
      const demoAddresses: IAddress[] = [
        {
          id: 1,
          fullName: user?.name || 'John Doe',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          phone: '+1 234 567 8900',
          isDefault: true,
        },
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
      setWalletBalance(500.0);
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
          amount: 500.0,
          description: 'Added money to wallet',
          status: 'completed',
        },
        {
          id: 'TXN-002',
          date: '2024-05-05',
          type: 'debit',
          amount: 89.99,
          description: 'Payment for Order #ORD-002',
          status: 'completed',
        },
      ];
      setTransactions(demoTransactions);
      localStorage.setItem(`wallet_transactions_${user?.id}`, JSON.stringify(demoTransactions));
    }
  };

  const updateProfilePicture = (imageUrl: string) => {
    const updatedData = { ...profileData, profilePicture: imageUrl };
    setProfileData(updatedData);
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedData));
  };

  const updateProfileData = (data: Partial<ProfileData>) => {
    const updatedData = { ...profileData, ...data };
    setProfileData(updatedData);
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedData));
  };

  const handleEditClick = () => {
    setEditData(profileData);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    setIsModalOpen(true);
  };

  const handleSaveChanges = () => {
    updateProfileData(editData);
    setIsModalOpen(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <ProfileContext.Provider value={{ 
      profileData, 
      updateProfilePicture, 
      updateProfileData,
      openEditModal,
      closeEditModal,
      isEditModalOpen: isModalOpen,
      editData,
      setEditData,
      handleInputChange,
      handleSaveChanges,
      handleEditClick,
      orders,
      addresses,
      transactions,
      walletBalance,
      loadStatistics
    }}>
      {children}
    </ProfileContext.Provider>
  );
};