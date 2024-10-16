// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const UserLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     const response = await fetch("http://localhost:3000/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password_hash: password }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.role);
//       navigate("/user/dashboard");
//     } else {
//       alert(data.error);
//     }
//   };

//   return (
//     <div>
//       <h2>User Login</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default UserLogin;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const fetchCartFromAPI = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return { cart_items: [] };
    }
  };

  const updateCartAPI = async (token, id, quantity) => {
    try {
      let url, method;
      url = `http://localhost:3000/api/cart/update/${id}`;
      method = "PUT";

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: id, quantity }),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const mergeCartWithServer = async (token) => {
    console.log("merge has been run");
    const serverCart = await fetchCartFromAPI(token);
    const localCartString = Cookies.get("cart");

    if (localCartString) {
      const localCart = JSON.parse(localCartString);
      const mergedCartItems = [...serverCart.cart_items];
      console.log(mergedCartItems);

      localCart.cart_items.forEach((localItem) => {
        const existingItemIndex = mergedCartItems.findIndex(
          (item) => item.product_id === localItem.product_id
        );
        if (existingItemIndex > -1) {
          mergedCartItems[existingItemIndex].quantity += localItem.quantity;
        } else {
          mergedCartItems.push(localItem);
        }
      });

      // Update the server with the merged cart
      for (const item of mergedCartItems) {
        console.log(`this is a single item for merge: ${typeof item.quantity}`);
        await updateCartAPI(token, item.product_id, item.quantity);
      }

      // Clear the local cart from cookies
      Cookies.remove("cart");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password_hash: password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // Merge cart after successful login
        await mergeCartWithServer(data.token);

        navigate("/user/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div>
      <h2>User Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default UserLogin;
