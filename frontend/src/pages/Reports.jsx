import { useState, useEffect } from "react";
import axios from "axios";

const Reports = () => {
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Updated Stock Movements:", stockMovements);
  }, [stockMovements]);

  const parseCSV = (csv) => {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");
  
    return lines.slice(1).map((line) => {
      const values = line.split(",");
      let obj = {};
      headers.forEach((header, index) => {
        obj[header.trim().toLowerCase().replace(" ", "_")] = values[index] ? values[index].trim() : "";
      });
      return obj;
    });
  };
  
  const fetchStockMovements = async (type) => {
    try {
      setLoading(true);
      setError("");
  
      const response = await axios.get(`http://localhost:8080/api/stock-movement/report/${type}`, {
        responseType: "text",
      });
  
      console.log("Raw API Response:", response.data);
  
      const parsedData = parseCSV(response.data);
      console.log("Parsed Data:", parsedData);
  
      setStockMovements(parsedData);
    } catch (error) {
      console.error(`Error fetching ${type} stock movements:`, error);
      setError(`Failed to fetch ${type} stock movements. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Function to download CSV
  const downloadCSV = () => {
    if (stockMovements.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headers = ["Movement ID,Product ID,Product Name,Quantity,Type,Timestamp"];
    const rows = stockMovements.map((movement) =>
      `${movement.movement_id},${movement.item_id},${movement.product_name},${movement.quantity_changed},${movement.movement_type},${new Date(movement.timestamp).toLocaleString()}`
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_movements.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed left-64 top-14 w-[calc(100%-64px)] h-[calc(100vh-14px)] p-6 bg-gray-100">
      <h2 className="text-xl text-blue-800 font-bold mb-4">Stock Movements</h2>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => fetchStockMovements("daily")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Daily Report
        </button>
        <button
          onClick={() => fetchStockMovements("weekly")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Weekly Report
        </button>
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Download CSV
        </button>
      </div>

      {/* Stock Movements List */}
      <div className="bg-white p-4 w-[80%] mt-4 border rounded-md shadow-md">
        <h3 className="text-lg font-bold mb-2">Stock Movements History</h3>

        {loading ? (
          <p className="text-gray-600">Loading stock movements...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2">Movement ID</th>
                <th className="border p-2">Product ID</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.length > 0 ? (
                stockMovements.map((movement, index) => (
                  <tr key={movement.movement_id || index} className="text-center border-b">
                    <td className="border text-gray-600 p-2">{movement.movement_id}</td>
                    <td className="border  text-gray-600 p-2">{movement.item_id}</td>
                    <td className="border  text-gray-600 p-2">{movement.product_name}</td>
                    <td className="border  text-gray-600 p-2">{movement.quantity_changed}</td>
                    <td className="border  text-gray-600 p-2">{movement.movement_type}</td>
                    <td className="border  text-gray-600 p-2">{new Date(movement.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-600">
                    No stock movements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;





