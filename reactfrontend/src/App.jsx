import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import UserLogin from "./components/UserLogin";
import SellerLogin from "./components/SellerLogin";
import OwnerLogin from "./components/OwnerLogin";
import UserDashboard from "./components/UserDashboard";
import SellerDashboard from "./components/SellerDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import SearchResults from "./components/SearchResults";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
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

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <Navbar products={products} onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/search-results"
          element={<SearchResults />} // The SearchResults component
        />

        {/* Protected routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute component={UserDashboard} allowedRole="user" />
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute component={SellerDashboard} allowedRole="seller" />
          }
        />
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute component={OwnerDashboard} allowedRole="owner" />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
