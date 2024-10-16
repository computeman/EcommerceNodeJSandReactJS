import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./HomePage.css";

const HomePage = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [cart, setCart] = useState({ cart_items: [] });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchCartFromAPI(token);
    } else {
      const savedCart = Cookies.get("cart");
      console.log("Saved cart from cookie:", savedCart);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart.cart_items ? parsedCart : { cart_items: [] });
        } catch (error) {
          console.error("Error parsing saved cart:", error);
          setCart({ cart_items: [] });
        }
      } else {
        setCart({ cart_items: [] });
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("Cart state updated:", cart);
  }, [cart]);

  const fetchCartFromAPI = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = await response.json();
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const updateCartAPI = async (id, action, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");
      let url, method;
      if (action === "add") {
        url = "http://localhost:3000/api/cart/add";
        method = "POST";
      } else if (action === "update") {
        url = `http://localhost:3000/api/cart/update/${id}`;
        method = "PUT";
      } else if (action === "remove") {
        url = `http://localhost:3000/api/cart/decrement/${id}`;
        method = "PUT";
      }
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: id, quantity }),
      });
      await fetchCartFromAPI(token);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const addToCart = (product) => {
    console.log("Adding to cart:", product);
    console.log("Current cart before update:", cart);

    if (isLoggedIn) {
      updateCartAPI(product.id, "add");
    } else {
      setCart((prevCart) => {
        const currentCartItems = Array.isArray(prevCart.cart_items)
          ? prevCart.cart_items
          : [];

        const existingItemIndex = currentCartItems.findIndex(
          (item) => item.product_id === product.id
        );

        let updatedCartItems;
        if (existingItemIndex > -1) {
          updatedCartItems = currentCartItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCartItems = [
            ...currentCartItems,
            {
              product_id: product.id,
              product_name: product.name,
              product_price: product.price,
              product_image_url: product.image_url,
              quantity: 1,
            },
          ];
        }

        const updatedCart = { ...prevCart, cart_items: updatedCartItems };

        Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
        console.log("Updated cart:", updatedCart);
        return updatedCart;
      });
    }
  };

  const removeFromCart = (id) => {
    if (isLoggedIn) {
      updateCartAPI(id, "remove");
    } else {
      setCart((prevCart) => {
        const updatedCartItems = Array.isArray(prevCart.cart_items)
          ? prevCart.cart_items
              .map((item) => {
                if (item.product_id === id) {
                  return { ...item, quantity: item.quantity - 1 };
                }
                return item;
              })
              .filter((item) => item.quantity > 0)
          : [];
        const updatedCart = { ...prevCart, cart_items: updatedCartItems };
        Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
        return updatedCart;
      });
    }
  };

  const getItemQuantity = (productId) => {
    if (!cart || !Array.isArray(cart.cart_items)) return 0;
    const item = cart.cart_items.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
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

          const quantity = getItemQuantity(product.id);

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
              {quantity > 0 ? (
                <div className="cart-quantity">
                  <button onClick={() => removeFromCart(product.id)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => addToCart(product)}>+</button>
                </div>
              ) : (
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
