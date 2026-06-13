import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
// Remove: import { ProfileProvider } from './contexts/ProfileContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BackButton } from './components/BackButton';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { Address } from './pages/Profile/Address';
import { Orders } from './pages/Profile/Orders';
import { Wallet } from './pages/Profile/Wallet';
import { ViewProfile } from './pages/Profile/ViewProfile';

function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* ProfileProvider removed - using Redux instead */}
        <WishlistProvider>
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
        </WishlistProvider>
      </Router>
    </Provider>
  );
}

export default App;