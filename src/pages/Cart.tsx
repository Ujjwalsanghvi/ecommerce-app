import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <h2>Your cart is empty</h2>
        <Link to="/products" style={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>
      
      <div style={styles.cartContent}>
        <div style={styles.cartItems}>
          {cart.map(item => (
            <div key={item.product.id} style={styles.cartItem}>
              <img src={item.product.image} alt={item.product.title} style={styles.itemImage} />
              
              <div style={styles.itemDetails}>
                <Link to={`/product/${item.product.id}`} style={styles.itemTitle}>
                  {item.product.title}
                </Link>
                <div style={styles.itemPrice}>${item.product.price.toFixed(2)}</div>
              </div>
              
              <div style={styles.itemQuantity}>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  style={styles.quantityBtn}
                >
                  -
                </button>
                <span style={styles.quantity}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  style={styles.quantityBtn}
                >
                  +
                </button>
              </div>
              
              <div style={styles.itemTotal}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              
              <button
                onClick={() => removeFromCart(item.product.id)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div style={styles.summaryTotal}>
            <span>Total:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <button onClick={clearCart} style={styles.clearCartBtn}>
            Clear Cart
          </button>
          <Link to="/checkout" style={styles.checkoutBtn}>
            Proceed to Checkout
          </Link>
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
  emptyCart: {
    textAlign: 'center' as const,
    padding: '50px',
  },
  continueShopping: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4fc3f7',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
  cartContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
  },
  cartItems: {
    border: '1px solid #eee',
    borderRadius: '8px',
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '100px 2fr 150px 100px 80px',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    borderBottom: '1px solid #eee',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain' as const,
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  itemTitle: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '16px',
  },
  itemPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  itemQuantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  quantityBtn: {
    width: '30px',
    height: '30px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  quantity: {
    fontSize: '16px',
    minWidth: '30px',
    textAlign: 'center' as const,
  },
  itemTotal: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  removeBtn: {
    padding: '8px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  summary: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '20px',
    height: 'fit-content' as const,
  },
  summaryTitle: {
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
  },
  clearCartBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
  checkoutBtn: {
    display: 'block',
    textAlign: 'center' as const,
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#4caf50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '16px',
  },
} as const;