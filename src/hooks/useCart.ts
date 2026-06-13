import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);

  const handleUpdateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  }, [dispatch]);

  const handleRemoveFromCart = useCallback((productId: number) => {
    dispatch(removeFromCart(productId));
  }, [dispatch]);

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return {
    cart,
    total,
    count,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleClearCart,
  };
};