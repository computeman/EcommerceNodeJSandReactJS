import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./HomePage.css";

const HomePage = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [cart, setCart] = useState(() => {
    const savedCart = Cookies.get("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const updateCartCookies = (updatedCart) => {
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  };

  const addToCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        [id]: (prevCart[id] || 0) + 1,
      };
      updateCartCookies(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[id] > 1) {
        updatedCart[id] = updatedCart[id] - 1;
      } else {
        delete updatedCart[id];
      }
      updateCartCookies(updatedCart);
      return updatedCart;
    });
  };

  return (
    <div className="homepage">
      <div className="product-container">
        {products.map((product) => {
          const priceAfterDiscount =
            product.discount?.percentage > 0
              ? product.price -
                (product.price * product.discount.percentage) / 100
              : product.price;

          return (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>
                Price: ${priceAfterDiscount.toFixed(2)}{" "}
                {product.discount?.percentage > 0 && (
                  <span className="original-price">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </p>
              {cart[product.id] ? (
                <div className="cart-quantity">
                  <button onClick={() => removeFromCart(product.id)}>-</button>
                  <span>{cart[product.id]}</span>
                  <button onClick={() => addToCart(product.id)}>+</button>
                </div>
              ) : (
                <button onClick={() => addToCart(product.id)}>
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
