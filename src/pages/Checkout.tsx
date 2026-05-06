import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export const Checkout: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order placed successfully!');
    clearCart();
    navigate('/products');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>
      
      <div style={styles.checkoutContent}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <h3>Shipping Information</h3>
            <div style={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
          </div>
          
          <div style={styles.section}>
            <h3>Payment Information</h3>
            <div style={styles.formGroup}>
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
          </div>
          
          <button type="submit" style={styles.placeOrderBtn}>
            Place Order (${getCartTotal().toFixed(2)})
          </button>
        </form>
        
        <div style={styles.orderSummary}>
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.product.id} style={styles.orderItem}>
              <span>{item.product.title.substring(0, 30)}...</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.total}>
            <strong>Total:</strong>
            <strong>${getCartTotal().toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    marginBottom: '30px',
    color: '#333',
  },
  checkoutContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  section: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '15px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  placeOrderBtn: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '15px',
    fontSize: '18px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  orderSummary: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '20px',
    height: 'fit-content' as const,
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
    fontSize: '18px',
  },
} as const;