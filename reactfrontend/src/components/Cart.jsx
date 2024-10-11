// // src/components/Cart.js
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie"; // Import js-cookie for managing cookies
// import "./Cart.css";

// const Cart = () => {
//   const [cart, setCart] = useState({});
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // Retrieve cart from cookies
//     const savedCart = Cookies.get("cart");
//     setCart(savedCart ? JSON.parse(savedCart) : {});

//     // Fetch product data (assuming products data is fetched separately)
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/api/products");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const cartItems = Object.keys(cart).map((productId) => {
//     const product = products.find((p) => p.id === parseInt(productId));
//     const quantity = cart[productId];
//     return { ...product, quantity };
//   });

//   const calculateTotal = () => {
//     return cartItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     ).toFixed(2);
//   };

//   return (
//     <div className="cart-container">
//       <h2>Your Cart</h2>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {cartItems.map((item) => (
//             <div key={item.id} className="cart-item">
//               <img
//                 src={item.image_url}
//                 alt={item.name}
//                 className="cart-item-img"
//               />
//               <div className="cart-item-details">
//                 <h3>{item.name}</h3>
//                 <p>${item.price.toFixed(2)}</p>
//                 <p>Quantity: {item.quantity}</p>
//                 <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
//               </div>
//             </div>
//           ))}
//           <div className="cart-summary">
//             <h3>Cart Total: ${calculateTotal()}</h3>
//             <button className="checkout-btn">Proceed to Checkout</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;
// src/components/Cart.js
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie for managing cookies
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Retrieve cart from cookies
    const savedCart = Cookies.get("cart");
    setCart(savedCart ? JSON.parse(savedCart) : {});

    // Fetch product data (assuming products data is fetched separately)
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const cartItems = Object.keys(cart).map((productId) => {
    const product = products.find((p) => p.id === parseInt(productId));
    const quantity = cart[productId];

    // If the product is found, return it with its quantity; otherwise, return null.
    return product ? { ...product, quantity } : null;
  }).filter(item => item !== null); // Filter out any null items

  const calculateTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image_url}
                alt={item.name}
                className="cart-item-img"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Cart Total: ${calculateTotal()}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
