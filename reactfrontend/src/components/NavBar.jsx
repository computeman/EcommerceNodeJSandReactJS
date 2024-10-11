import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

const Navbar = ({ products, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownResults, setDropdownResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDropdownResults(results);
    } else {
      setDropdownResults([]);
    }
  }, [searchTerm, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const filteredResults = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onSearch(filteredResults); // Pass filtered results to parent component
      setSearchTerm("");
      navigate("/search-results", { state: { results: filteredResults } }); // Navigate to the search results page
    }
  };

  const handleDropdownSelect = (productName) => {
    setSearchTerm(productName);
    const filteredResults = products.filter((product) =>
      product.name.toLowerCase().includes(productName.toLowerCase())
    );
    navigate("/search-results", { state: { results: filteredResults } });
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img
            src="https://img.freepik.com/premium-photo/white-golden-letter-logo-design-business-identity-digital-design-company_971166-54222.jpg?w=740"
            alt="Logo"
          />
        </Link>
        <span className="navbar-title">ShopEasy</span>
      </div>

      <div className="navbar-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {dropdownResults.length > 0 && (
          <ul className="dropdown">
            {dropdownResults.map((product) => (
              <li
                key={product.id}
                onClick={() => handleDropdownSelect(product.name)}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="navbar-links">
        <Link to="/cart" className="cart-link">
          <i className="fa fa-shopping-cart"></i> Cart
        </Link>
        <Link to="/sell" className="btn btn-primary sell-btn">
          Sell with Us
        </Link>
        <Link to="/login" className="login-link">
          New customer? <span>Sign In</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
