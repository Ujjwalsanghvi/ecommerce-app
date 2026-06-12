import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount
} from '../store/slices/cartSlice';

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (cart.length === 0) {
    return (
      <div className="text-center p-[50px] min-h-[calc(100vh-80px)] bg-[#f5f5f5] max-md:p-[30px]">
        <h2 className="text-[#333] mb-5">Your cart is empty</h2>

        <Link
          to="/products"
          className="inline-block mt-5 px-6 py-3 bg-[#4fc3f7] text-white no-underline rounded-[8px] transition-all duration-300 hover:bg-[#45b5e6] hover:-translate-y-[2px]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f5f5]">
      <div className="max-w-[1400px] mx-auto px-5 py-10 max-md:px-[15px] max-md:py-5 max-[480px]:px-3 max-[480px]:py-[15px]">
        <h1 className="text-[32px] text-[#333] mb-[30px] font-bold max-md:text-2xl max-md:mb-5 max-[480px]:text-[22px]">
          Shopping Cart
        </h1>

        {/* Desktop Layout - Side by Side */}
        <div className="flex gap-[30px] max-md:flex-col max-md:gap-5">
          {/* Cart Items Section */}
          <div className="flex-[2] w-full">
            <div className="bg-white rounded-[12px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="
                    grid
                    grid-cols-[100px_2fr_150px_100px_80px]
                    items-center
                    gap-[15px]
                    p-5
                    border-b border-[#f0f0f0]
                    transition-colors duration-300
                    hover:bg-[#fafafa]
                    last:border-b-0

                    max-md:grid-cols-1
                    max-md:gap-3
                    max-md:text-center
                    max-md:p-4

                    max-[480px]:p-3
                  "
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="
                      w-20
                      h-20
                      object-contain

                      max-md:mx-auto
                      max-md:w-[100px]
                      max-md:h-[100px]

                      max-[480px]:w-20
                      max-[480px]:h-20
                    "
                  />

                  <div className="flex flex-col gap-2 max-md:items-center">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="
                        text-[#333]
                        no-underline
                        text-[15px]
                        font-medium
                        leading-[1.4]
                        hover:text-[#4fc3f7]

                        max-md:text-[14px]
                        max-[480px]:text-[13px]
                      "
                    >
                      {item.product.title}
                    </Link>

                    <div className="text-base font-semibold text-[#4fc3f7] max-[480px]:text-[15px]">
                      ${item.product.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 max-md:justify-center">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="
                        w-8
                        h-8
                        bg-[#f0f0f0]
                        border-none
                        rounded-[6px]
                        cursor-pointer
                        text-[18px]
                        font-bold
                        transition-all
                        duration-300
                        hover:bg-[#e0e0e0]
                        hover:scale-[1.05]

                        max-md:w-9
                        max-md:h-9
                        max-md:text-[20px]

                        max-[480px]:w-8
                        max-[480px]:h-8
                        max-[480px]:text-[18px]
                      "
                    >
                      -
                    </button>

                    <span className="text-base font-medium min-w-[30px] text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="
                        w-8
                        h-8
                        bg-[#f0f0f0]
                        border-none
                        rounded-[6px]
                        cursor-pointer
                        text-[18px]
                        font-bold
                        transition-all
                        duration-300
                        hover:bg-[#e0e0e0]
                        hover:scale-[1.05]

                        max-md:w-9
                        max-md:h-9
                        max-md:text-[20px]

                        max-[480px]:w-8
                        max-[480px]:h-8
                        max-[480px]:text-[18px]
                      "
                    >
                      +
                    </button>
                  </div>

                  <div className="text-[18px] font-bold text-[#4fc3f7] max-md:text-center max-[480px]:text-base">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    className="
                      px-4
                      py-2
                      bg-[#f44336]
                      text-white
                      border-none
                      rounded-[6px]
                      cursor-pointer
                      transition-all
                      duration-300
                      text-[13px]
                      font-medium
                      hover:bg-[#d32f2f]
                      hover:scale-[1.02]

                      max-md:w-[100px]
                      max-md:mx-auto
                      max-md:py-2
                    "
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="flex-1 w-full">
            <div
              className="
                bg-white
                rounded-[12px]
                p-6
                shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                sticky
                top-[100px]

                max-md:static
                max-md:p-5

                max-[480px]:p-4
              "
            >
              <h3
                className="
                  text-[18px]
                  font-semibold
                  text-[#333]
                  mb-5
                  pb-[10px]
                  border-b-2
                  border-[#4fc3f7]

                  max-md:text-base
                "
              >
                Order Summary
              </h3>

              <div className="flex justify-between mb-[15px] text-[15px] text-[#666] max-md:text-[14px]">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-[15px] text-[15px] text-[#666] max-md:text-[14px]">
                <span>Shipping:</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between mt-[15px] pt-[15px] border-t border-[#e0e0e0] text-[18px] font-bold text-[#333] max-md:text-base">
                <span>Total:</span>

                <span className="text-[#4fc3f7] text-[20px] max-md:text-[18px]">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleClearCart}
                className="
                  w-full
                  py-3
                  bg-[#ff9800]
                  text-white
                  border-none
                  rounded-[8px]
                  cursor-pointer
                  text-[15px]
                  font-semibold
                  mt-5
                  transition-all
                  duration-300
                  hover:bg-[#f57c00]
                  hover:-translate-y-[2px]

                  max-md:py-[10px]
                  max-md:text-[14px]
                "
              >
                Clear Cart
              </button>

              <Link
                to="/checkout"
                className="
                  block
                  text-center
                  mt-3
                  py-3
                  bg-[#4caf50]
                  text-white
                  no-underline
                  rounded-[8px]
                  text-[15px]
                  font-semibold
                  transition-all
                  duration-300
                  hover:bg-[#45a049]
                  hover:-translate-y-[2px]

                  max-md:py-[10px]
                  max-md:text-[14px]
                "
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;