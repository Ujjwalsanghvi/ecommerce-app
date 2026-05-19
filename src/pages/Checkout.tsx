import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const Checkout: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
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
    <div className="checkout-container">
      <div className="checkout-header">
        <h1 className="checkout-title">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        {/* Left Column - Shipping & Payment */}
        <div className="checkout-left">
          {/* Shipping Information */}
          <div className="form-section">
            <h2 className="section-title">Shipping Information</h2>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your address"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="City"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Zip Code"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="form-section">
            <h2 className="section-title">Payment Information</h2>
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="MM/YY"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="checkout-right">
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.product.id} className="summary-item">
                  <div className="item-info">
                    <img src={item.product.image} alt={item.product.title} className="item-image" />
                    <div className="item-details">
                      <div className="item-title">{item.product.title.substring(0, 40)}</div>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="item-price">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-total">
              <span className="total-label">Total:</span>
              <span className="total-amount">${getCartTotal().toFixed(2)}</span>
            </div>
            
            <button type="submit" className="place-order-btn">
              Place Order (${getCartTotal().toFixed(2)})
            </button>
          </div>
        </div>
      </form>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .checkout-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
          min-height: calc(100vh - 80px);
          background-color: #f5f5f5;
        }

        .checkout-header {
          margin-bottom: 30px;
        }

        .checkout-title {
          font-size: 32px;
          color: #333;
          font-weight: bold;
        }

        .checkout-form {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }

        /* Left Column */
        .checkout-left {
          flex: 2;
          min-width: 280px;
        }

        /* Right Column */
        .checkout-right {
          flex: 1.2;
          min-width: 300px;
        }

        /* Form Sections */
        .form-section {
          background-color: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #4fc3f7;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
          outline: none;
        }

        .form-input:focus {
          border-color: #4fc3f7;
          box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Order Summary */
        .order-summary {
          background-color: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          position: sticky;
          top: 100px;
        }

        .summary-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #4fc3f7;
        }

        .summary-items {
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 16px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          gap: 12px;
          align-items: center;
          flex: 1;
        }

        .item-image {
          width: 50px;
          height: 50px;
          object-fit: contain;
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 4px;
        }

        .item-details {
          flex: 1;
        }

        .item-title {
          font-size: 13px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .item-quantity {
          font-size: 12px;
          color: #666;
        }

        .item-price {
          font-size: 14px;
          font-weight: 600;
          color: #4fc3f7;
          margin-left: 12px;
        }

        .summary-divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 16px 0;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-top: 8px;
        }

        .total-label {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .total-amount {
          font-size: 24px;
          font-weight: bold;
          color: #4fc3f7;
        }

        .place-order-btn {
          width: 100%;
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .place-order-btn:hover {
          background-color: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        /* Scrollbar Styling */
        .summary-items::-webkit-scrollbar {
          width: 6px;
        }

        .summary-items::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .summary-items::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }

        .summary-items::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .checkout-container {
            padding: 20px 15px;
          }

          .checkout-title {
            font-size: 24px;
            margin-bottom: 20px;
          }

          .checkout-form {
            flex-direction: column;
            gap: 20px;
          }

          .checkout-left,
          .checkout-right {
            width: 100%;
            min-width: auto;
          }

          .form-section {
            padding: 20px;
            margin-bottom: 16px;
          }

          .section-title {
            font-size: 16px;
            margin-bottom: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .form-input {
            padding: 10px 12px;
            font-size: 14px;
          }

          .order-summary {
            padding: 20px;
            position: static;
            margin-bottom: 20px;
          }

          .summary-title {
            font-size: 16px;
            margin-bottom: 16px;
          }

          .summary-items {
            max-height: 300px;
          }

          .item-image {
            width: 45px;
            height: 45px;
          }

          .item-title {
            font-size: 12px;
          }

          .item-price {
            font-size: 13px;
          }

          .total-label {
            font-size: 16px;
          }

          .total-amount {
            font-size: 20px;
          }

          .place-order-btn {
            padding: 12px;
            font-size: 15px;
          }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .checkout-container {
            padding: 15px 12px;
          }

          .form-section {
            padding: 16px;
          }

          .order-summary {
            padding: 16px;
          }

          .item-info {
            gap: 8px;
          }

          .item-image {
            width: 40px;
            height: 40px;
          }

          .item-title {
            font-size: 11px;
          }

          .total-amount {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};