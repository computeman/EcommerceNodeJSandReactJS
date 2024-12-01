// AdminDashboard.jsx
import React from "react";
import { Link, Route, Routes, useLocation, Navigate } from "react-router-dom";
import ProductList from "./ProductList";
import OrderList from "./OrderList";
import DiscountManager from "./DiscountManager";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h1>Admin</h1>
        <nav>
          <Link
            to="/admin/products"
            className={location.pathname === "/admin/products" ? "active" : ""}
          >
            Products
          </Link>
          <Link
            to="/admin/orders"
            className={location.pathname === "/admin/orders" ? "active" : ""}
          >
            Orders
          </Link>
          <Link
            to="/admin/discounts"
            className={location.pathname === "/admin/discounts" ? "active" : ""}
          >
            Discounts
          </Link>
        </nav>
      </div>
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/products" />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="discounts" element={<DiscountManager />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
