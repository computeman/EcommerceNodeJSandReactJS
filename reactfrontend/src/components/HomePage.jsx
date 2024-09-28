import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <Link to="/login">
        <button>User Login</button>
      </Link>
      <Link to="/seller/login">
        <button>Sell with Us</button>
      </Link>
      {/* Hidden route for owner login */}
      <a href="/owner/login" style={{ display: "none" }}>
        Owner Login
      </a>
    </div>
  );
};

export default HomePage;
