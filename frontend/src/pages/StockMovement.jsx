import { useState, useEffect } from "react";
import axios from "axios";

const StockMovement = () => {
  const [newMovement, setNewMovement] = useState({
    itemId: "",
    quantityChanged: "",
    movementType: "",
    userId: "",
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    setNewMovement({
      ...newMovement,
      [e.target.name]: e.target.value,
    });
  };

  const getUserName = () => {
    return localStorage.getItem("username") || ""; // Fetch username from localStorage
  };

  // Update timestamp every second to keep it current
  useEffect(() => {
    const interval = setInterval(() => {
      setNewMovement((prevMovement) => ({
        ...prevMovement,
        timestamp: new Date().toISOString().slice(0, 16), // Update timestamp
      }));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Handle form submission
  const handleAddStockMovement = async () => {
    try {
      const username = getUserName();
      const payload = {
        ...newMovement,
        quantityChanged: Number(newMovement.quantityChanged),
      };

      const response = await axios.post(
        "http://localhost:8080/api/stock-movement/record",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert("Stock Movement added successfully");
        setNewMovement({
          itemId: "",
          quantityChanged: "",
          movementType: "",
          userId: username,
          timestamp: new Date().toISOString().slice(0, 16),
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding stock movement:", error);
      setError("Failed to add stock movement. Please try again.");
    }
  };

  return (
    <div className="fixed left-64 top-14 w-[calc(100%-64px)] h-[calc(100vh-14px)] p-6 bg-gray-100">
      <h2 className="text-xl text-blue-800 font-bold mb-4">Stock Movements</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Add Stock Movement
        </button>
      </div>

      {showForm && (
        <div className="bg-white w-[50%] p-4 mt-4 border rounded-md shadow-md">
          <h3 className="text-lg font-bold mb-2">Add Stock Movement</h3>
          <input
            type="text"
            name="itemId"
            placeholder="Product ID"
            value={newMovement.itemId}
            onChange={handleInputChange}
            required
            className="w-full p-2 bg-blue-50 text-gray-600 border border-blue-500 rounded-md mb-2"
          />
          <input
            type="number"
            name="quantityChanged"
            placeholder="Quantity Changed"
            value={newMovement.quantityChanged}
            onChange={handleInputChange}
            required
            className="w-full p-2 bg-blue-50 text-gray-600 border border-blue-500 rounded-md mb-2"
          />
          <select
            name="movementType"
            value={newMovement.movementType}
            onChange={handleInputChange}
            required
            className="w-full p-2 text-gray-600 bg-blue-50 border border-blue-500 rounded-md mb-2"
          >
            <option value="">Select Movement Type</option>
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
            <option value="UPDATE">Stock Update</option>
            <option value="DELETE">Stock Delete</option>
          </select>
          <input
            type="datetime-local"
            name="timestamp"
            value={newMovement.timestamp}
            onChange={handleInputChange}
            required
            className="w-full p-2 text-gray-600 bg-blue-50 border border-blue-500 rounded-md mb-2"
          />
          <button
            onClick={handleAddStockMovement}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default StockMovement;

