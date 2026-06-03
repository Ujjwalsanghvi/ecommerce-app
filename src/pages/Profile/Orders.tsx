import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Order } from '../../types/Order';  // Changed from separate imports
import { demoOrders } from '../../data/demoOrders';

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