import React, { useEffect, useState } from "react";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image_url: "",
  });

  // State for creating a new product
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image_url: "",
    discount: "", // New field for discount
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:3000/api/seller/products", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  // Handle create product changes
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/seller/product/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newProduct),
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchProducts();
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          image_url: "",
        });
        setShowCreateForm(false);
        console.log(data.message);
      } else {
        console.error("Error creating product:", data.message);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_url: product.image_url,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/seller/product/edit/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editFormData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchProducts();
        setEditingProduct(null);
        console.log(data.message);
      } else {
        console.error("Error updating product:", data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/seller/product/delete/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
        console.log(data.message);
      } else {
        console.error("Error deleting product:", data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? "Close Create Product" : "Create Product"}
      </button>

      {showCreateForm && (
        <div className="create-form">
          <h3>Create Product</h3>
          <form onSubmit={handleCreateProduct}>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleNewProductChange}
              placeholder="Name"
              required
            />
            <input
              type="text"
              name="description"
              value={newProduct.description}
              onChange={handleNewProductChange}
              placeholder="Description"
              required
            />
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleNewProductChange}
              placeholder="Price"
              required
            />
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleNewProductChange}
              placeholder="Category"
              required
            />
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleNewProductChange}
              placeholder="Stock"
              required
            />
            <input
              type="text"
              name="image_url"
              value={newProduct.image_url}
              onChange={handleNewProductChange}
              placeholder="Image URL"
              required
            />
            <button type="submit">Create Product</button>
          </form>
        </div>
      )}

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editingProduct && (
        <div className="edit-form">
          <h3>Edit Product</h3>
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditChange}
              placeholder="Name"
            />
            <input
              type="text"
              name="description"
              value={editFormData.description}
              onChange={handleEditChange}
              placeholder="Description"
            />
            <input
              type="number"
              name="price"
              value={editFormData.price}
              onChange={handleEditChange}
              placeholder="Price"
            />
            <input
              type="text"
              name="category"
              value={editFormData.category}
              onChange={handleEditChange}
              placeholder="Category"
            />
            <input
              type="number"
              name="stock"
              value={editFormData.stock}
              onChange={handleEditChange}
              placeholder="Stock"
            />
            <input
              type="text"
              name="image_url"
              value={editFormData.image_url}
              onChange={handleEditChange}
              placeholder="Image URL"
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingProduct(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList;
