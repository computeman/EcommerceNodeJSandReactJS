import React, { useState, useEffect } from "react";
import "./DiscountManager.css";

const DiscountManager = () => {
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
  });
  const [editingDiscount, setEditingDiscount] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchDiscounts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/seller/products",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/seller/discounts",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAddDiscount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/seller/discount/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchDiscounts();
        setForm({
          product_id: "",
          discount_percentage: "",
          start_date: "",
          end_date: "",
        });
        console.log(data.message);
      } else {
        console.error("Error adding discount:", data.message);
      }
    } catch (error) {
      console.error("Error adding discount:", error);
    }
  };

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
    setForm({
      product_id: discount.product_id,
      discount_percentage: discount.discount_percentage,
      start_date: discount.start_date.split("T")[0],
      end_date: discount.end_date.split("T")[0],
    });
  };

  const handleUpdateDiscount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/seller/discount/edit/${editingDiscount.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchDiscounts();
        setEditingDiscount(null);
        console.log(data.message);
      } else {
        console.error("Error updating discount:", data.message);
      }
    } catch (error) {
      console.error("Error updating discount:", error);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/seller/discount/delete/${discountId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchDiscounts();
        console.log(data.message);
      } else {
        console.error("Error deleting discount:", data.message);
      }
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };

  return (
    <div className="discount-manager">
      <h2>Manage Discounts</h2>
      <form
        onSubmit={editingDiscount ? handleUpdateDiscount : handleAddDiscount}
      >
        <select
          name="product_id"
          value={form.product_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="discount_percentage"
          value={form.discount_percentage}
          onChange={handleInputChange}
          placeholder="Discount Percentage"
          required
        />
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {editingDiscount ? "Update Discount" : "Add Discount"}
        </button>
        {editingDiscount && (
          <button type="button" onClick={() => setEditingDiscount(null)}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Discounts</h3>
      <ul>
        {discounts.map((discount) => (
          <li key={discount.id}>
            <div>
              <img
                src={discount.Product.image_url}
                alt={discount.Product.name}
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              />
              <span>{discount.Product.name}</span>
            </div>
            <p>
              <strong>Discount:</strong> {discount.discount_percentage}% |
              <strong> Start:</strong>{" "}
              {new Date(discount.start_date).toLocaleDateString()} |
              <strong> End:</strong>{" "}
              {new Date(discount.end_date).toLocaleDateString()}
            </p>
            <button onClick={() => handleEditDiscount(discount)}>Edit</button>
            <button onClick={() => handleDeleteDiscount(discount.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscountManager;
