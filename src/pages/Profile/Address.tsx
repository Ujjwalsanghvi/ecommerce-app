import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

export const Address: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = () => {
    const savedAddresses = localStorage.getItem(`addresses_${user?.id}`);
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      // Demo addresses
      const demoAddresses = [
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

  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
    localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(newAddresses));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      // Update existing address
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...formData, id: addr.id, isDefault: addr.isDefault }
          : addr
      );
      saveAddresses(updatedAddresses);
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0
      };
      saveAddresses([...addresses, newAddress]);
    }
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: ''
    });
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      saveAddresses(updatedAddresses);
    }
  };

  const setDefaultAddress = (id: number) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(updatedAddresses);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Addresses</h1>
        <button onClick={() => {
          setEditingAddress(null);
          setFormData({
            fullName: user?.name || '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            phone: ''
          });
          setShowForm(true);
        }} style={styles.addButton}>
          + Add New Address
        </button>
      </div>

      {showForm && (
        <div style={styles.modal}>
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Street Address"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
                style={styles.input}
              />
              <div style={styles.row}>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  style={styles.rowInput}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  style={styles.rowInput}
                />
              </div>
              <div style={styles.row}>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                  style={styles.rowInput}
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                  style={styles.rowInput}
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                style={styles.input}
              />
              <div style={styles.formButtons}>
                <button type="submit" style={styles.submitButton}>
                  {editingAddress ? 'Update' : 'Save'} Address
                </button>
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                }} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.addressesList}>
        {addresses.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No addresses saved yet.</p>
            <button onClick={() => setShowForm(true)} style={styles.emptyButton}>
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map(address => (
            <div key={address.id} style={styles.addressCard}>
              {address.isDefault && <span style={styles.defaultBadge}>Default</span>}
              <div style={styles.addressContent}>
                <p><strong>{address.fullName}</strong></p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p>📞 {address.phone}</p>
              </div>
              <div style={styles.addressActions}>
                {!address.isDefault && (
                  <button onClick={() => setDefaultAddress(address.id)} style={styles.setDefaultButton}>
                    Set as Default
                  </button>
                )}
                <button onClick={() => handleEdit(address)} style={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => handleDelete(address.id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </div>
          ))
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
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
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
  },
  formTitle: {
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  rowInput: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  addressesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  addressCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    position: 'relative' as const,
    backgroundColor: 'white',
  },
  defaultBadge: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  addressContent: {
    marginBottom: '15px',
  },
  addressActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  setDefaultButton: {
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  editButton: {
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  emptyButton: {
    marginTop: '20px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
} as const;