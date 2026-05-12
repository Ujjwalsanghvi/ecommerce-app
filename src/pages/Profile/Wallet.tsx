import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

export const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = () => {
    const savedBalance = localStorage.getItem(`wallet_balance_${user?.id}`);
    const savedTransactions = localStorage.getItem(`wallet_transactions_${user?.id}`);
    
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    } else {
      // Demo balance
      setBalance(500.00);
      localStorage.setItem(`wallet_balance_${user?.id}`, '500.00');
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      // Demo transactions
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

  const saveWalletData = (newBalance: number, newTransactions: Transaction[]) => {
    setBalance(newBalance);
    setTransactions(newTransactions);
    localStorage.setItem(`wallet_balance_${user?.id}`, newBalance.toString());
    localStorage.setItem(`wallet_transactions_${user?.id}`, JSON.stringify(newTransactions));
  };

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const addAmount = parseFloat(amount);
    if (addAmount > 0 && addAmount <= 10000) {
      const newBalance = balance + addAmount;
      const newTransaction: Transaction = {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'credit',
        amount: addAmount,
        description: 'Added money to wallet',
        status: 'completed'
      };
      saveWalletData(newBalance, [newTransaction, ...transactions]);
      setShowAddMoney(false);
      setAmount('');
      alert(`$${addAmount} added successfully!`);
    } else {
      alert('Please enter a valid amount between 1 and 10000');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Wallet</h1>
      
      <div style={styles.balanceCard}>
        <div style={styles.balanceInfo}>
          <span style={styles.balanceLabel}>Current Balance</span>
          <span style={styles.balanceAmount}>${balance.toFixed(2)}</span>
        </div>
        <button onClick={() => setShowAddMoney(true)} style={styles.addMoneyButton}>
          + Add Money
        </button>
      </div>

      {showAddMoney && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Add Money to Wallet</h3>
            <form onSubmit={handleAddMoney}>
              <input
                type="number"
                placeholder="Enter amount (max $10,000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                max="10000"
                step="0.01"
                required
                style={styles.amountInput}
              />
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.confirmButton}>
                  Add Money
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMoney(false);
                    setAmount('');
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.transactionsSection}>
        <h2 style={styles.sectionTitle}>Transaction History</h2>
        {transactions.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No transactions yet.</p>
          </div>
        ) : (
          <div style={styles.transactionsList}>
            {transactions.map(transaction => (
              <div key={transaction.id} style={styles.transactionCard}>
                <div style={styles.transactionInfo}>
                  <div>
                    <div style={styles.transactionDescription}>{transaction.description}</div>
                    <div style={styles.transactionDate}>{transaction.date}</div>
                  </div>
                  <div style={{
                    ...styles.transactionAmount,
                    color: transaction.type === 'credit' ? '#4caf50' : '#f44336'
                  }}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
                <div style={styles.transactionStatus}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: transaction.status === 'completed' ? '#4caf50' : 
                                   transaction.status === 'pending' ? '#ff9800' : '#f44336'
                  }}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '30px',
  },
  balanceCard: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    color: 'white',
  },
  balanceInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  balanceLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: '36px',
    fontWeight: 'bold',
  },
  addMoneyButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid white',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
  },
  modalTitle: {
    marginBottom: '20px',
    color: '#333',
  },
  amountInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    marginBottom: '20px',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  transactionsSection: {
    marginTop: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '20px',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  transactionCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: 'white',
  },
  transactionInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  transactionDescription: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  transactionDate: {
    fontSize: '12px',
    color: '#666',
  },
  transactionAmount: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  transactionStatus: {
    textAlign: 'right' as const,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    color: '#666',
  },
} as const;