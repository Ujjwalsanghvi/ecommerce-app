import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem(`orders_${user?.id}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Demo orders
      const demoOrders: Order[] = [
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
              image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
            },
            {
              id: 2,
              title: 'Mens Casual Premium Slim Fit T-Shirts',
              price: 22.3,
              quantity: 2,
              image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
            }
          ],
          shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        },
        {
          id: 'ORD-002',
          date: '2024-05-05',
          total: 89.99,
          status: 'shipped',
          items: [
            {
              id: 3,
              title: 'Mens Cotton Jacket',
              price: 55.99,
              quantity: 1,
              image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'
            }
          ],
          shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        }
      ];
      setOrders(demoOrders);
      localStorage.setItem(`orders_${user?.id}`, JSON.stringify(demoOrders));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return '#4caf50';
      case 'shipped': return '#2196f3';
      case 'processing': return '#ff9800';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>
      
      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" style={styles.shopButton}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map(order => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <span style={styles.orderId}>Order #{order.id}</span>
                  <span style={styles.orderDate}>Placed on {new Date(order.date).toLocaleDateString()}</span>
                </div>
                <span style={{...styles.orderStatus, backgroundColor: getStatusColor(order.status)}}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              
              <div style={styles.orderItems}>
                {order.items.map(item => (
                  <div key={item.id} style={styles.orderItem}>
                    <img src={item.image} alt={item.title} style={styles.itemImage} />
                    <div style={styles.itemDetails}>
                      <h4 style={styles.itemTitle}>{item.title}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                    </div>
                    <div style={styles.itemTotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={styles.orderFooter}>
                <div style={styles.shippingInfo}>
                  <strong>Shipping Address:</strong>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                </div>
                <div style={styles.orderTotal}>
                  <strong>Total Amount:</strong>
                  <span style={styles.totalAmount}>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
  ordersList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  orderCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginRight: '15px',
  },
  orderDate: {
    color: '#666',
    fontSize: '14px',
  },
  orderStatus: {
    padding: '4px 12px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  orderItems: {
    padding: '20px',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '15px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain' as const,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  itemTotal: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#4fc3f7',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#fafafa',
    borderTop: '1px solid #e0e0e0',
  },
  shippingInfo: {
    fontSize: '13px',
    color: '#666',
  },
  orderTotal: {
    textAlign: 'right' as const,
  },
  totalAmount: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#4fc3f7',
    marginLeft: '10px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  shopButton: {
    display: 'inline-block',
    marginTop: '20px',
    backgroundColor: '#4fc3f7',
    color: 'white',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
  },
} as const;