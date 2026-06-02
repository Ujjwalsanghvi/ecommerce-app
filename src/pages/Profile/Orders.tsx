import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Order } from '../../types/Order';  // Changed from separate imports

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);  // Changed to Order[]

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem(`orders_${user?.id}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Demo orders
      const demoOrders: Order[] = [  // Changed to Order[]
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

  // Rest of your component...
};