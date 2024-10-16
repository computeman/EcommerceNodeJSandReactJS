import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState({ cart_items: [], total_amount: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchCartFromAPI(token);
    } else {
      const savedCart = Cookies.get("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
        } catch (error) {
          console.error("Error parsing saved cart:", error);
          setCart({ cart_items: [], total_amount: 0 });
        }
      }
      setIsLoading(false);
    }
  }, []);

  const fetchCartFromAPI = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = await response.json();
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCart({ cart_items: [], total_amount: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const itemPrice = isLoggedIn ? item.price : item.product_price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalAmount = calculateTotal(cart.cart_items);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.cart_items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.cart_items.map((item) => (
            <div
              key={isLoggedIn ? item.id : item.product_id}
              className="cart-item"
            >
              <img
                src={item.product_image_url || "placeholder-image-url.jpg"}
                alt={isLoggedIn ? item.product_name : item.product_name}
                className="cart-item-img"
              />
              <div className="cart-item-details">
                <h3>{isLoggedIn ? item.product_name : item.product_name}</h3>
                <p>
                  ${(isLoggedIn ? item.price : item.product_price).toFixed(2)}
                </p>
                <p>Quantity: {item.quantity}</p>
                <p>
                  Total: $
                  {(
                    (isLoggedIn ? item.price : item.product_price) *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Cart Total: ${totalAmount.toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
