// OrderList.jsx
import React, { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import "./OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/seller/orders", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <div className="order-list-container">
      <h2>Order List</h2>
      <ul className="order-list-ul">
        {orders.map((order) => (
          <li key={order.id} className="order-list-li">
            Order #{order.id} - ${order.total_amount}
            <button
              className="order-list-button"
              onClick={() => setSelectedOrder(order.id)}
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
      {selectedOrder && (
        <OrderDetails
          orderId={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </div>
  );
};

export default OrderList;
