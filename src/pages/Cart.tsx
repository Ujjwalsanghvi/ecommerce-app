import React from 'react';
import { EmptyCart } from '../components/cart/EmptyCart';  // Changed: Cart → cart
import { CartHeader } from '../components/cart/CartHeader';  // Changed: Cart → cart
import { CartItemsList } from '../components/cart/CartItemsList';  // Changed: Cart → cart
import { OrderSummary } from '../components/cart/OrderSummary';  // Changed: Cart → cart
import { useCart } from '../hooks/useCart';

export const Cart: React.FC = () => {
  const { 
    cart, 
    total, 
    handleUpdateQuantity, 
    handleRemoveFromCart, 
    handleClearCart 
  } = useCart();

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f5f5]">
      <div className="max-w-[1400px] mx-auto px-5 py-10 max-md:px-[15px] max-md:py-5 max-[480px]:px-3 max-[480px]:py-[15px]">
        <CartHeader />

        <div className="flex gap-[30px] max-md:flex-col max-md:gap-5">
          <div className="flex-[2] w-full">
            <CartItemsList
              items={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveFromCart}
            />
          </div>

          <div className="flex-1 w-full">
            <OrderSummary total={total} onClearCart={handleClearCart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;