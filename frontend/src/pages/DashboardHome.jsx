import { useState, useEffect } from "react";
import ExpiryProductCard from "../components/ExpiryCard.jsx";
import LowStockProductCard from "../components/LowstockCard.jsx";

const DashboardHome = () => {
  const [activeTab, setActiveTab] = useState("expiry");
  const [expiryProducts, setExpiryProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab]);

  const fetchProducts = async (type) => {
    setLoading(true);
    setError("");

    const url =
      type === "expiry"
        ? "http://localhost:8080/products/expiry"
        : "http://localhost:8080/api/alerts/low-stock";

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      type === "expiry" ? setExpiryProducts(data) : setLowStockProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className=" fixed  left-64 top-14 w-[calc(100%-64px)] h-[calc(100vh-14px)] p-6 bg-gray-100">
          
          {/* Buttons for Switching Tabs */}
          <div className="flex w-full items-center justify-content-center overflow-y-scroll space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-md font-semibold transition ${
                activeTab === "expiry"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
              onClick={() => setActiveTab("expiry")}
            >
              Expiry Products
            </button>
            <button
              className={`px-4 py-2 rounded-md font-semibold transition ${
                activeTab === "low-stock"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
              onClick={() => setActiveTab("low-stock")}
            >
              Low Stock Products
            </button>
          </div>
    
          {/* Display Products Section */}
          <div className="flex flex-col space-y-4  overflow-hidden h-[calc(100vh-14px-60px)]">
            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
    
            {!loading &&
              (activeTab === "expiry"
                ? expiryProducts.map((product) => (
                    <ExpiryProductCard key={product.id} product={product} />
                  ))
                : lowStockProducts.map((product) => (
                    <LowStockProductCard key={product.id} product={product} />
                  )))}
          </div>
        </div>
  );
};

export default DashboardHome;
