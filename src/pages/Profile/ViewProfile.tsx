import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { ProfileSidebar } from '../../components/Profile/ProfileSidebar';
import { AccountStatistics } from '../../components/Profile/AccountStatistics';
import { PersonalInfoSection } from '../../components/Profile/PersonalInfoSection';
import { EditProfileModal } from '../../components/Profile/EditProfileModal';
import { SignOutButton } from '../../components/Profile/SignOutButton';
import { IAddress } from '../../types/Address';
import { Transaction } from '../../types/Transaction';
import { ImpOrder } from '../../types/ImpOrder';

export const ViewProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { profileData, updateProfilePicture, updateProfileData } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(true);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [editData, setEditData] = useState(profileData);

  const [orders, setOrders] = useState<ImpOrder[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
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

  const handleInputChange = (field: keyof typeof editData, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleStatClick = (statName: string) => {
    setSelectedStat(selectedStat === statName ? null : statName);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-gray-100">
      <ProfileSidebar
        profileData={profileData}
        onEditClick={handleEditClick}
        onImageUpload={handleImageUpload}
      />

      <div className="flex-1 p-5 md:p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-[28px] text-gray-800">Profile Dashboard</h1>
        </div>

        <AccountStatistics
          orders={orders}
          addresses={addresses}
          transactions={transactions}
          walletBalance={walletBalance}
          isStatsOpen={isStatsOpen}
          selectedStat={selectedStat}
          onToggleStats={() => setIsStatsOpen(!isStatsOpen)}
          onStatClick={handleStatClick}
        />

        <PersonalInfoSection
          profileData={profileData}
          isOpen={isPersonalInfoOpen}
          onToggle={() => setIsPersonalInfoOpen(!isPersonalInfoOpen)}
        />

        <SignOutButton onLogout={logout} />
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        editData={editData}
        onClose={handleModalClose}
        onSave={handleSaveChanges}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default ViewProfile;