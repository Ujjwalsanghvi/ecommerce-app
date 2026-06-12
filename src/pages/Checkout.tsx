import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAppSelector } from '../store/hooks';

export const Checkout: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Load saved address if exists
  useEffect(() => {
    const savedAddresses = localStorage.getItem(`addresses_${user?.id}`);
    if (savedAddresses) {
      const addresses = JSON.parse(savedAddresses);
      const defaultAddress = addresses.find((addr: any) => addr.isDefault);
      if (defaultAddress) {
        setFormData(prev => ({
          ...prev,
          address: defaultAddress.street,
          city: defaultAddress.city,
          zipCode: defaultAddress.zipCode
        }));
      }
    }
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      total: getCartTotal(),
      status: 'pending',
      items: cart.map(item => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      shippingAddress: {
        fullName: formData.fullName,
        street: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      }
    };
    
    // Save order to localStorage
    const existingOrders = localStorage.getItem(`orders_${user?.id}`);
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.unshift(newOrder);
    localStorage.setItem(`orders_${user?.id}`, JSON.stringify(orders));
    
    // Update wallet balance (deduct amount)
    const currentBalance = parseFloat(localStorage.getItem(`wallet_balance_${user?.id}`) || '0');
    const newBalance = currentBalance - getCartTotal();
    localStorage.setItem(`wallet_balance_${user?.id}`, newBalance.toString());
    
    // Add transaction record
    const existingTransactions = localStorage.getItem(`wallet_transactions_${user?.id}`);
    const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
    transactions.unshift({
      id: `TXN-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'debit',
      amount: getCartTotal(),
      description: `Payment for Order #${newOrder.id}`,
      status: 'completed'
    });
    localStorage.setItem(`wallet_transactions_${user?.id}`, JSON.stringify(transactions));
    
    alert('Order placed successfully!');
    clearCart();
    navigate('/products');
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-10 min-h-[calc(100vh-80px)] bg-gray-100 md:px-4 md:py-5">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 font-bold md:text-2xl md:mb-5">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-8 flex-wrap md:flex-col md:gap-5">
        {/* Left Column - Shipping & Payment */}
        <div className="flex-[2] min-w-[280px] md:w-full md:min-w-auto">
          {/* Shipping Information */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm md:p-5 md:mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-400 md:text-base md:mb-4">Shipping Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                placeholder="Enter your address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                  placeholder="City"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                  placeholder="Zip Code"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm md:p-5 md:mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-400 md:text-base md:mb-4">Payment Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                  placeholder="MM/YY"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="flex-1 min-w-[300px] md:w-full md:min-w-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-[100px] md:static md:p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-400 md:text-base md:mb-4">Order Summary</h2>
            
            <div className="max-h-[400px] overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex gap-3 items-center flex-1">
                    <img src={item.product.image} alt={item.product.title} className="w-12 h-12 object-contain bg-gray-50 rounded-md p-1" />
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-gray-800 mb-1 leading-tight">{item.product.title.substring(0, 40)}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-blue-400 ml-3">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="h-px bg-gray-200 my-4"></div>
            
            <div className="flex justify-between items-center mb-5 pt-2">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-blue-400">${getCartTotal().toFixed(2)}</span>
            </div>
            
            <button type="submit" className="w-full bg-green-500 text-white border-none py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(76,175,80,0.3)] md:py-3 md:text-sm">
              Place Order (${getCartTotal().toFixed(2)})
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;