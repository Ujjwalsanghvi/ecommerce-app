import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { Order, OrderCardProps } from '../../types/Order';  // Changed: use Order instead of ImpOrder
import { IAddress } from '../../types/Address';
import { Transaction } from '../../types/Transaction';
import { StatCardProps } from '../../types/StatCardProps';
import { AddressCardProps } from '../../types/AddressCardProps';
import { TransactionCardProps } from '../../types/TransactionCardProps';

export const AccountStatistics: React.FC = () => {
  const { orders, addresses, transactions, walletBalance } = useProfile();
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  const totalOrders = orders.length;
  const savedAddresses = addresses.length;
  const latestOrders = orders.slice(0, 1);
  const latestAddresses = addresses.slice(0, 1);
  const latestTransactions = transactions.slice(0, 1);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'delivered':
        return '#4caf50';
      case 'shipped':
        return '#2196f3';
      case 'processing':
        return '#ff9800';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const handleStatClick = (statName: string): void => {
    setSelectedStat(selectedStat === statName ? null : statName);
  };

  return (
    <div className="bg-white rounded-xl mb-5 overflow-hidden shadow-sm">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer bg-white transition-colors duration-300 border-b border-gray-200 hover:bg-gray-50"
        onClick={() => setIsStatsOpen(!isStatsOpen)}
      >
        <span className="text-2xl">📊</span>
        <h2 className="flex-1 text-lg font-semibold text-gray-800 m-0">Account Statistics</h2>
        <span className="text-base text-gray-400">{isStatsOpen ? '▼' : '▶'}</span>
      </div>
      {isStatsOpen && (
        <div className="p-6">
          <div className="flex flex-col gap-3">
            {/* Total Orders */}
            <StatCard
              icon="📦"
              label="Total Orders"
              value={totalOrders}
              isOpen={selectedStat === 'orders'}
              onToggle={() => handleStatClick('orders')}
            >
              {orders.length === 0 ? (
                <p className="text-center text-gray-400 p-5">No orders found</p>
              ) : (
                <>
                  {latestOrders.map((order: Order) => (  // Changed: ImpOrder → Order
                    <OrderCard key={order.id} order={order} getStatusColor={getStatusColor} />
                  ))}
                  {orders.length > 1 && (
                    <div className="flex justify-end mt-4">
                      <Link
                        to="/profile/orders"
                        className="bg-none border-none text-blue-400 cursor-pointer text-[13px] font-medium px-3 py-2 transition-all duration-300 inline-flex items-center gap-1 no-underline hover:text-blue-500 hover:translate-x-1"
                      >
                        View More Orders →
                      </Link>
                    </div>
                  )}
                </>
              )}
            </StatCard>

            {/* Saved Addresses */}
            <StatCard
              icon="📍"
              label="Saved Addresses"
              value={savedAddresses}
              isOpen={selectedStat === 'addresses'}
              onToggle={() => handleStatClick('addresses')}
            >
              {addresses.length === 0 ? (
                <p className="text-center text-gray-400 p-5">No addresses saved</p>
              ) : (
                <>
                  {latestAddresses.map((address: IAddress) => (
                    <AddressCard key={address.id} address={address} />
                  ))}
                  {addresses.length > 1 && (
                    <div className="flex justify-end mt-4">
                      <Link
                        to="/profile/address"
                        className="bg-none border-none text-blue-400 cursor-pointer text-[13px] font-medium px-3 py-2 transition-all duration-300 inline-flex items-center gap-1 no-underline hover:text-blue-500 hover:translate-x-1"
                      >
                        View More Addresses →
                      </Link>
                    </div>
                  )}
                </>
              )}
            </StatCard>

            {/* Wallet Balance */}
            <StatCard
              icon="💰"
              label="Wallet Balance"
              value={`$${walletBalance.toFixed(2)}`}
              isOpen={selectedStat === 'wallet'}
              onToggle={() => handleStatClick('wallet')}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-xl flex flex-col md:flex-row md:justify-between items-center gap-4 md:gap-0 mb-5 text-white text-center md:text-left">
                <div className="text-base">
                  Current Balance: <span className="text-2xl font-bold ml-2">${walletBalance.toFixed(2)}</span>
                </div>
                <Link
                  to="/profile/wallet"
                  className="bg-white/20 text-white px-4 py-2 rounded-md text-xs no-underline transition-all duration-300 hover:bg-white/30"
                >
                  + Add Money
                </Link>
              </div>
              <div className="text-sm font-bold mb-2">Recent Transaction</div>
              {transactions.length === 0 ? (
                <p className="text-center text-gray-400 p-5">No transactions yet</p>
              ) : (
                <>
                  {latestTransactions.map((transaction: Transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                  {transactions.length > 1 && (
                    <div className="flex justify-end mt-4">
                      <Link
                        to="/profile/wallet"
                        className="bg-none border-none text-blue-400 cursor-pointer text-[13px] font-medium px-3 py-2 transition-all duration-300 inline-flex items-center gap-1 no-underline hover:text-blue-500 hover:translate-x-1"
                      >
                        View All Transactions →
                      </Link>
                    </div>
                  )}
                </>
              )}
            </StatCard>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components - moved inside the same file
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, isOpen, onToggle, children }) => (
  <>
    <div
      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:translate-x-1"
      onClick={onToggle}
    >
      <span className="text-2xl md:text-3xl w-9 md:w-11">{icon}</span>
      <span className="flex-1 text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-xl font-bold text-blue-400">{value}</span>
      <span className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</span>
    </div>
    {isOpen && <div className="mt-4 p-5 bg-white rounded-xl border border-gray-200">{children}</div>}
  </>
);

const OrderCard: React.FC<OrderCardProps> = ({ order, getStatusColor }) => (
  <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
    <div className="flex justify-between mb-2">
      <span className="font-bold text-sm">Order #{order.id}</span>
      <span
        className="px-2 py-1 rounded text-white text-[11px] font-bold"
        style={{ backgroundColor: getStatusColor(order.status) }}
      >
        {order.status}
      </span>
    </div>
    <div className="text-xs text-gray-500 mb-2">Placed on: {new Date(order.date).toLocaleDateString()}</div>
    {order.items.map((item) => (
      <div
        key={item.id}
        className="flex flex-col md:flex-row gap-4 p-2 my-2 bg-white rounded-lg text-center md:text-left"
      >
        <img src={item.image} alt={item.title} className="w-12 h-12 object-contain mx-auto md:mx-0" />
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
);

const AddressCard: React.FC<AddressCardProps> = ({ address }) => (
  <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50 relative">
    {address.isDefault && (
      <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded text-[10px]">Default</span>
    )}
    <p>
      <strong>{address.fullName}</strong>
    </p>
    <p>{address.street}</p>
    <p>
      {address.city}, {address.state} {address.zipCode}
    </p>
    <p>{address.country}</p>
    <p>📞 {address.phone}</p>
  </div>
);

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => (
  <div className="p-3 mb-2 border border-gray-200 rounded-lg bg-gray-50">
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
      <span
        className={`inline-block px-2 py-0.5 rounded text-white text-[10px] ${
          transaction.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
        }`}
      >
        {transaction.status}
      </span>
    </div>
  </div>
);