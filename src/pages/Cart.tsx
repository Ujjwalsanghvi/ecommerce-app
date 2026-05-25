import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="continue-shopping">
          Continue Shopping
        </Link>
        <style>{`
          .empty-cart {
            text-align: center;
            padding: 50px;
            min-height: calc(100vh - 80px);
            background-color: #f5f5f5;
          }
          .empty-cart h2 {
            color: #333;
            margin-bottom: 20px;
          }
          .continue-shopping {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #4fc3f7;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s;
          }
          .continue-shopping:hover {
            background-color: #45b5e6;
            transform: translateY(-2px);
          }
          @media (max-width: 768px) {
            .empty-cart {
              padding: 30px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        <div className="cart-content">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.product.id} className="cart-item">
                  <img src={item.product.image} alt={item.product.title} className="item-image" />
                  
                  <div className="item-details">
                    <Link to={`/product/${item.product.id}`} className="item-title">
                      {item.product.title}
                    </Link>
                    <div className="item-price">${item.product.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary Section */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-[100px] md:static">
              <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-400">Order Summary</h3>
              <div className="flex justify-between mb-4 text-base text-gray-500">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <button onClick={clearCart} className="clear-cart-btn">
                Clear Cart
              </button>
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .cart-page {
          min-height: calc(100vh - 80px);
          background-color: #f5f5f5;
        }

        .cart-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .cart-title {
          font-size: 32px;
          color: #333;
          margin-bottom: 30px;
          font-weight: bold;
        }

        /* Desktop Layout - Side by Side */
        .cart-content {
          display: flex;
          gap: 30px;
        }

        .cart-items-section {
          flex: 2;
        }

        .order-summary-section {
          flex: 1;
        }

        /* Cart Items */
        .cart-items {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 2fr 150px 100px 80px;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.3s;
        }

        .cart-item:hover {
          background-color: #fafafa;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .item-image {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .item-title {
          color: #333;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.4;
        }

        .item-title:hover {
          color: #4fc3f7;
        }

        .item-price {
          font-size: 16px;
          font-weight: 600;
          color: #4fc3f7;
        }

        .item-quantity {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quantity-btn {
          width: 32px;
          height: 32px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          transition: all 0.3s;
        }

        .quantity-btn:hover {
          background-color: #e0e0e0;
          transform: scale(1.05);
        }

        .quantity {
          font-size: 16px;
          font-weight: 500;
          min-width: 30px;
          text-align: center;
        }

        .item-total {
          font-size: 18px;
          font-weight: bold;
          color: #4fc3f7;
        }

        .remove-btn {
          padding: 8px 16px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
          font-weight: 500;
        }

        .remove-btn:hover {
          background-color: #d32f2f;
          transform: scale(1.02);
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

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 15px;
          color: #666;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .summary-total span:last-child {
          color: #4fc3f7;
          font-size: 20px;
        }

        .clear-cart-btn {
          width: 100%;
          padding: 12px;
          background-color: #ff9800;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          margin-top: 20px;
          transition: all 0.3s;
        }

        .clear-cart-btn:hover {
          background-color: #f57c00;
          transform: translateY(-2px);
        }

        .checkout-btn {
          display: block;
          text-align: center;
          margin-top: 12px;
          padding: 12px;
          background-color: #4caf50;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .checkout-btn:hover {
          background-color: #45a049;
          transform: translateY(-2px);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .cart-container {
            padding: 20px 15px;
          }

          .cart-title {
            font-size: 24px;
            margin-bottom: 20px;
          }

          /* Stack layout on mobile */
          .cart-content {
            flex-direction: column;
            gap: 20px;
          }

          .cart-items-section {
            width: 100%;
          }

          .order-summary-section {
            width: 100%;
          }

          /* Cart item becomes column layout */
          .cart-item {
            grid-template-columns: 1fr;
            gap: 12px;
            text-align: center;
            padding: 16px;
          }

          .item-image {
            margin: 0 auto;
            width: 100px;
            height: 100px;
          }

          .item-details {
            align-items: center;
          }

          .item-title {
            font-size: 14px;
          }

          .item-price {
            font-size: 16px;
          }

          .item-quantity {
            justify-content: center;
          }

          .quantity-btn {
            width: 36px;
            height: 36px;
            font-size: 20px;
          }

          .item-total {
            font-size: 18px;
            text-align: center;
          }

          .remove-btn {
            width: 100px;
            margin: 0 auto;
            padding: 8px;
          }

          /* Order summary on mobile */
          .order-summary {
            position: static;
            padding: 20px;
          }

          .summary-title {
            font-size: 16px;
          }

          .summary-row {
            font-size: 14px;
          }

          .summary-total {
            font-size: 16px;
          }

          .summary-total span:last-child {
            font-size: 18px;
          }

          .clear-cart-btn,
          .checkout-btn {
            padding: 10px;
            font-size: 14px;
          }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .cart-container {
            padding: 15px 12px;
          }

          .cart-title {
            font-size: 22px;
          }

          .cart-item {
            padding: 12px;
          }

          .item-image {
            width: 80px;
            height: 80px;
          }

          .item-title {
            font-size: 13px;
          }

          .item-price {
            font-size: 15px;
          }

          .quantity-btn {
            width: 32px;
            height: 32px;
            font-size: 18px;
          }

          .item-total {
            font-size: 16px;
          }

          .order-summary {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};