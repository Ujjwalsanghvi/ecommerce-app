import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/Mainview';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get user from localStorage
  const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  };
  
  const user = getUser();
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [user?.id]);

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`);
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const saveWishlist = (newWishlist: Product[]) => {
    localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      saveWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId: number) => {
    saveWishlist(wishlist.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistCount,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};