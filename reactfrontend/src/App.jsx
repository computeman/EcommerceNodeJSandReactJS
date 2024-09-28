import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import UserLogin from "./components/UserLogin";
import SellerLogin from "./components/SellerLogin";
import OwnerLogin from "./components/OwnerLogin";
import UserDashboard from "./components/UserDashboard";
import SellerDashboard from "./components/SellerDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/owner/login" element={<OwnerLogin />} />

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
    </Router>
  );
}

export default App;
