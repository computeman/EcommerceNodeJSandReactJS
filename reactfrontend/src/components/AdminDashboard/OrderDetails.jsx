import React, { useEffect, useState } from "react";
import "./OrderDetails.css";

const OrderDetails = ({ orderId, setSelectedOrder }) => {
  console.log(`Order Details Component Rendered with Order ID:`, orderId);

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      console.warn("No order ID provided");
      setLoading(false);
      return;
    }

    console.log(`Fetching order details for ID: ${orderId}`);

    fetch(`http://localhost:3000/api/seller/order/${orderId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Order Details:", data);
        setOrderDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order details:", err);
        setError(err);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!orderDetails || !orderDetails.items) {
    return <div>No order details available</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Order #{orderDetails.id}</h3>
        <button
          className="close-modal-button"
          onClick={() => setSelectedOrder(null)}
        >
          &times;
        </button>
        <ul className="modal-ul">
          {orderDetails.items.map((item) => (
            <li key={item.product_id} className="modal-li">
              <div>
                <img src={item.product_image} alt={item.product_name} />
                <span>{item.product_name}</span>
              </div>
              <p>
                <strong>Quantity:</strong> {item.quantity} |{" "}
                <strong>Price:</strong> ${item.price}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
