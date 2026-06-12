import React, { createContext, useContext, useState, useEffect } from 'react';
// Remove: import { useAuth } from './AuthContext';
import { ProfileData } from '../types/ProfileData';
import { IAddress } from '../types/Address';
import { Transaction } from '../types/Transaction';
import { Order } from '../types/Order';

interface ProfileContextType {
  profileData: ProfileData;
  updateProfilePicture: (imageUrl: string) => void;
  updateProfileData: (data: Partial<ProfileData>) => void;
  openEditModal: () => void;
  closeEditModal: () => void;
  isEditModalOpen: boolean;
  editData: ProfileData;
  setEditData: (data: ProfileData) => void;
  handleInputChange: (field: keyof ProfileData, value: string) => void;
  handleSaveChanges: () => void;
  handleEditClick: () => void;
  orders: Order[];
  addresses: IAddress[];
  transactions: Transaction[];
  walletBalance: number;
  loadStatistics: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get user from localStorage instead of useAuth
  const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  };
  
  const user = getUser();
  
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

  const [orders, setOrders] = useState<Order[]>([]);
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
      // Demo orders
      const demoOrders: Order[] = [];
      setOrders(demoOrders);
      localStorage.setItem(`orders_${user?.id}`, JSON.stringify(demoOrders));
    }
  };

  const loadAddresses = () => {
    const savedAddresses = localStorage.getItem(`addresses_${user?.id}`);
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      const demoAddresses: IAddress[] = [];
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
      const demoTransactions: Transaction[] = [];
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