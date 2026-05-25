import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { WishlistProvider } from './contexts/WishlistContext'; // Add this import
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BackButton } from './components/BackButton';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist'; // Add this import
import { Address } from './pages/Profile/Address';
import { Orders } from './pages/Profile/Orders';
import { Wallet } from './pages/Profile/Wallet';
import { ViewProfile } from './pages/Profile/ViewProfile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <WishlistProvider>   {/* Add WishlistProvider HERE - before CartProvider */}
            <CartProvider>
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<ProductList />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile/view" element={
                  <ProtectedRoute>
                    <ViewProfile />
                  </ProtectedRoute>
                } />
                <Route path="/profile/address" element={
                  <ProtectedRoute>
                    <Address />
                  </ProtectedRoute>
                } />
                <Route path="/profile/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/profile/wallet" element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                } />
              </Routes>
              <BackButton />
            </CartProvider>
          </WishlistProvider>  {/* Close WishlistProvider here */}
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;