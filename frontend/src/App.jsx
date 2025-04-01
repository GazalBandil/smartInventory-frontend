import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; 
import Login from "./pages/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/DashboardHome.jsx";
import Supplier from "./pages/Supplier.jsx";
import Category from "./pages/Category.jsx";
import InventoryItems from "./pages/InventoryItems.jsx";
import Report from "./pages/Reports.jsx";
import StockMovement from "./pages/StockMovement.jsx";
import UserActivityLog from "./pages/UserActivityLog.jsx";
import Header from "./components/Header.jsx";

// Role-Based Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = JSON.parse(localStorage.getItem("userData"))?.role || "USER"; 

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      navigate("/"); // Redirect unauthorized users to Dashboard
    }
  }, [token, userRole, allowedRoles, navigate]);

  return token && (!allowedRoles || allowedRoles.includes(userRole)) ? element : null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  return (
    <Router>
      {isAuthenticated ? (
        <div className="h-screen flex flex-col bg-gray-50">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 p-6 overflow-y-auto">
              <Routes>
                {/* USER & ADMIN can access these routes */}
                <Route path="/" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["USER", "ADMIN"]} />} />
                <Route path="/category" element={<ProtectedRoute element={<Category />} allowedRoles={["USER", "ADMIN"]} />} />
                <Route path="/inventory-items" element={<ProtectedRoute element={<InventoryItems />} allowedRoles={["USER", "ADMIN"]} />} />
                <Route path="/report" element={<ProtectedRoute element={<Report />} allowedRoles={["USER", "ADMIN"]} />} />
                <Route path="/stock-movement" element={<ProtectedRoute element={<StockMovement />} allowedRoles={["USER", "ADMIN"]} />} />
                <Route path="/user-activity-log" element={<ProtectedRoute element={<UserActivityLog />} allowedRoles={["USER", "ADMIN"]} />} />
                <Route path="/supplier" element={<ProtectedRoute element={<Supplier />} allowedRoles={["USER","ADMIN"]} />} />

                {/* Catch-All */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
