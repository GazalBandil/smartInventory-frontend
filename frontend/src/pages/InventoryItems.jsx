import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 


const InventoryItems = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConsumePopup, setShowConsumePopup] = useState(false);
  const [consumeQuantity, setConsumeQuantity] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    expiryDate: "",
    categoryId: "",
    supplierId: "",
  });

  
// to get the username from the token
  const getUserName = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
 
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub ;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };


  // ---------------------Fetch all products-------------------------------------------------
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
// -------------------------------handle search feature logic------------------------------------------
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      console.warn("Search query is empty");
      return;
    }
  
    try {
      const response = await axios.get(
        `http://localhost:8080/products/search/${encodeURIComponent(searchQuery)}`
      );
  
      console.log("Search results:", response.data);
      setProducts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alert("The Product that you are searching for is not found!!");
    } 
      console.error("Error searching product:", error);
    }
  };


// --------------------------------------------------handle add products feature logic -----------------------------------
  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token) {
        alert("Not authenticated! Please log in.");
        return;
      }
      if (role !== "ADMIN") {
        alert("Access Denied! Only Admins can add new products.");
        return;
      }
      const username = getUserName();
      await axios.post(
        "http://localhost:8080/products/add-item",
        newProduct, 
        {
          params: { username },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      fetchProducts();
      alert("Product added successfully!");
      setShowAddPopup(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Access Denied! Only Admins can add new products.");
      } else {
        console.error("Error adding product:", error);
        alert("Failed to add the product. Please try again.");
      }
    }
  };
  
// ----------------------------------------------------------handle update product feature logic -----------------------------------------------
  const handleUpdateProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token) {
        alert("Not authenticated! Please log in.");
        return;
      }

      if (role !== "ADMIN") {
        alert("Access Denied! Only Admins can update the Products.");
        return;
      }
      const username = getUserName();
      await axios.put(
        `http://localhost:8080/products/${id}`,
        selectedProduct,
        {
          params: { username },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowUpdatePopup(false);
      fetchProducts();
      alert("Product updated successfully!");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Access Denied! Only Admins can update the Products.");
      } else {
        console.error("Error updating product:", error);
        alert("Failed to update the product. Please try again.");
      }
    }
  };
  
// ------------------------------------------------handle delete product logic------------------------------------------------
const handleDeleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      alert("Not authenticated! Please log in.");
      return;
    }
    if (role !== "ADMIN") {
      alert("Access Denied! Only Admins can delete products.");
      return;
    }
    const username = getUserName();
    await axios.delete(`http://localhost:8080/products/${id}`, {
      params: { username },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });
    setShowDeletePopup(false);
    fetchProducts();
    alert("Product deleted successfully!");
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("Access Denied! Only Admins can delete products.");
    } else {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  }
};

// ----------------------------------------------------------handle product consuption-------------------------------------------------
 // handle product consumption
const handleConsumeProduct = async (id, quantity) => {
  if (!quantity || quantity <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }
  try {
    await axios.post(`http://localhost:8080/products/consume/${id}/${quantity}`);
    setShowConsumePopup(false);
    fetchProducts();
    alert("Product consumed successfully");
  } catch (error) {
    console.error("Error consuming product:", error);
    alert("Failed to consume product. Please try again.");
  }
};
  useEffect(() => {
    fetchProducts();
  }, []);

  // -------------------------------------------------------Main ui code starts---------------------------------------------------------
  return (
    <div className="fixed left-64 top-14 w-[calc(100%-64px)] h-[calc(100vh-14px)] overflow-y-scroll p-6 bg-gray-100">
      {/* /*----------------------------------------Header---------------------------------------------------- */}
      <div className="flex w-[50%] items-center justify-evenly  space-x-4 mb-6">
        <br></br>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          View All Products
        </button>
        

        <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search Product"
          value={searchQuery}
          onChange={(e) => {
          console.log("Input changed:", e.target.value);
          setSearchQuery(e.target.value);
          }}
          className="p-2 border-2 w-[100%] bg-slate-200 text-gray-800 border-blue-500 rounded-md"
        />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Search
          </button>
        </div>

        <button
          onClick={() => setShowAddPopup(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Add Product
        </button>
      </div>

      {/* ---------------------------------- Product Cards ----------------------------------------*/}
      <div className="grid grid-cols-1 sm:grid-cols-2   w-full md:w-[50%] gap-7">
      {products.map((product) => (
        <div
         key={product.itemId}
         className="bg-white  p-4 rounded-lg text-red-500 shadow-md border flex flex-col justify-between"
        >
       <div>
        <h3 className="font-bold text-red-500">ID: {product.itemId}</h3>
        <h4 className="text-lg font-bold text-blue-600">{product.name}</h4>
        <p className="text-gray-700">Price: ₹{product.price}</p>
        <p className="text-gray-700">Quantity: {product.quantity}</p>
        <p className="text-gray-700">Expiry: {product.expiryDate}</p>
        <p className="text-gray-500">Category: {product.category.name}</p>
        <p className="text-gray-500">Supplier: {product.supplier.name}</p>
       </div>

      {/* {------------------------ Buttons of consume, update and delete --------------------------------------*/}
      <div className="flex flex-wrap justify-center mx-auto sm:justify-end mt-4 gap-2">
        <button
          onClick={() => {
            setSelectedProduct(product);
            setShowUpdatePopup(true);
          }}
          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-xs md:text-sm lg:text-base"
        >
          Update
        </button>

        <button
          onClick={() => {
            setSelectedProduct(product);
            setShowDeletePopup(true);
          }}
          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-xs md:text-sm lg:text-base"
        >
          Delete
        </button>

           <button
             onClick={() => {
             setSelectedProduct(product);
             setConsumeQuantity("");
             setShowConsumePopup(true);
             }}
             className="px-2 py-1 sm:px-3 sm:py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition text-xs md:text-sm lg:text-base"
            >
              Consume
            </button>
         </div>
        </div>
       ))}
    </div>


      {/* -------------------------------------------Add Product Popup --------------------------------------------*/}
      {showAddPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white p-6 border border-blue-200 rounded-lg shadow-lg w-96">
            <br></br>
            <h2 className="text-lg text-blue-600 max-w-md text-center border-b-2 border-blue-600 font-bold mb-4">Add Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              className="w-full p-2 text-gray-700 border bg-gray-100 border-blue-400 rounded mb-2"
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Price"
              className="w-full p-2 border text-gray-700 bg-gray-100 border-blue-400 rounded mb-2"
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Quantity"
              className="w-full p-2 border text-gray-700  bg-gray-100 border-blue-400 rounded mb-2"
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full p-2 border text-gray-700 bg-gray-100 border-blue-400 rounded mb-2"
              onChange={(e) =>
                setNewProduct({ ...newProduct, expiryDate: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category ID"
              className="w-full p-2 border text-gray-700  bg-gray-100 border-blue-400 rounded mb-2"
              onChange={(e) =>
                setNewProduct({ ...newProduct, categoryId: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Supplier ID"
              className="w-full p-2 border  text-gray-700 bg-gray-100 border-blue-400 rounded mb-4"
              onChange={(e) =>
                setNewProduct({ ...newProduct, supplierId: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddPopup(false)}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {-------------------------------------------------------update form input ----------------------------------------------} */}
      {showUpdatePopup && selectedProduct && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
    <div className="bg-white p-6 border border-blue-200 rounded-lg shadow-lg w-96">
      <h2 className="text-lg text-blue-600 text-center border-b-2 border-blue-600 font-bold mb-4">
        Update Product
      </h2>

      <form>
        {/* Product Name */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Product Name</label>
          <input
            type="text"
            value={selectedProduct.name || ""}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
            className="w-full p-2 border text-gray-600 bg-gray-100 border-blue-400 rounded"
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Price</label>
          <input
            type="number"
            value={selectedProduct.price || ""}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
            className="w-full p-2 border text-gray-600 bg-gray-100 border-blue-400 rounded"
          />
        </div>


        {/* Stock Quantity */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Stock Quantity</label>
          <input
            type="text"
            value={selectedProduct.quantity || ""}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
            className="w-full p-2 border text-gray-600 bg-gray-100 border-blue-400 rounded"
          />
        </div>

        {/* Expiry Date */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Expiry Date</label>
          <input
            type="date"
            value={selectedProduct.expiryDate || ""}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, expiryDate: e.target.value })}
            className="w-full p-2 border text-gray-600 bg-gray-100 border-blue-400 rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setShowUpdatePopup(false)}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleUpdateProduct(selectedProduct.itemId)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/*------------------------------------------------------- Consume Product Popup------------------------------------------ */}
      {showConsumePopup && selectedProduct && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
    <div className="bg-white p-6 border border-blue-200 rounded-lg shadow-lg w-96">
      <h2 className="text-lg text-blue-600 text-center border-b-2 border-blue-600 font-bold mb-4">
        Consume Product
      </h2>

      <form>
        {/* Product ID */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Product ID</label>
          <input
            type="text"
            value={selectedProduct.itemId || ""}
            readOnly
            className="w-full p-2 border text-red-600 bg-gray-200 border-blue-400 rounded cursor-not-allowed"
          />
        </div>

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Quantity to Consume</label>
          <input
            type="number"
            min="1"
            value={consumeQuantity}
            onChange={(e) => setConsumeQuantity(e.target.value)}
            className="w-full p-2 border text-gray-600 bg-gray-100 border-blue-400 rounded"
          />
        </div>
      </form>

      {/* Buttons */}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={() => setShowConsumePopup(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleConsumeProduct(selectedProduct.itemId, consumeQuantity)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Consume
        </button>
      </div>
    </div>
  </div>
)}
{/* -------------------------------------------------------delete popup------------------------------------ */}
{showDeletePopup && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white w-full sm:w-80 p-6 rounded-md shadow-md">
            <h3 className="text-lg text-red-500 font-semibold text-center mb-4">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-around">
              <button
                onClick={() => handleDeleteProduct(selectedProduct.itemId)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryItems;
