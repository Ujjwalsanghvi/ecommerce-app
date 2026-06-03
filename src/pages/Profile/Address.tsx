import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IAddress } from '../../types/Address';
import { getDemoAddresses } from '../../data/demoAddresses';



export const Address: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
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
      
        const demoAddresses = getDemoAddresses(user);

      setAddresses(demoAddresses);
      localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(demoAddresses));
    }
  };

  const saveAddresses = (newAddresses: IAddress[]) => {
    setAddresses(newAddresses);
    localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(newAddresses));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...formData, id: addr.id, isDefault: addr.isDefault }
          : addr
      );
      saveAddresses(updatedAddresses);
    } else {
      const newAddress: IAddress = {
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

  const handleEdit = (address: IAddress) => {
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
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] text-gray-800">My Addresses</h1>
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
        }} className="bg-green-500 text-white border-none px-5 py-2.5 rounded-md cursor-pointer text-sm">
          + Add New Address
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-8 rounded-xl w-[90%] max-w-[500px]">
            <h2 className="text-xl text-gray-800 mb-5">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="p-3 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                placeholder="Street Address"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
                className="p-3 border border-gray-300 rounded-md text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="p-3 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                  className="p-3 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                  className="p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="p-3 border border-gray-300 rounded-md text-sm"
              />
              <div className="flex gap-2.5 mt-2.5">
                <button type="submit" className="flex-1 bg-green-500 text-white border-none py-3 rounded-md cursor-pointer">
                  {editingAddress ? 'Update' : 'Save'} Address
                </button>
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                }} className="flex-1 bg-red-500 text-white border-none py-3 rounded-md cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
        {addresses.length === 0 ? (
          <div className="text-center p-15 bg-gray-50 rounded-lg">
            <p>No addresses saved yet.</p>
            <button onClick={() => setShowForm(true)} className="mt-5 bg-green-500 text-white border-none px-5 py-2.5 rounded-md cursor-pointer">
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map(address => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-5 relative bg-white">
              {address.isDefault && <span className="absolute top-2.5 right-2.5 bg-green-500 text-white px-2 py-1 rounded text-xs">Default</span>}
              <div className="mb-4">
                <p><strong>{address.fullName}</strong></p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p>📞 {address.phone}</p>
              </div>
              <div className="flex gap-2.5 justify-end">
                {!address.isDefault && (
                  <button onClick={() => setDefaultAddress(address.id)} className="bg-blue-500 text-white border-none px-3 py-1.5 rounded text-xs cursor-pointer">
                    Set as Default
                  </button>
                )}
                <button onClick={() => handleEdit(address)} className="bg-orange-500 text-white border-none px-3 py-1.5 rounded text-xs cursor-pointer">
                  Edit
                </button>
                <button onClick={() => handleDelete(address.id)} className="bg-red-500 text-white border-none px-3 py-1.5 rounded text-xs cursor-pointer">
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

export default Address;