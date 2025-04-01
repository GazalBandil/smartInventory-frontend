import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHome from "../pages/DashboardHome";
import Supplier from "../pages/Supplier";
import Category from "../pages/Category";
import InventoryItems from "../pages/InventoryItems";
import Report from "../pages/Reports";
import StockMovement from "../pages/StockMovement";
import UserActivityLog from "../pages/UserActivityLog";
import Header from "../components/Header";

const DashboardLayout = () => {
  const [activePage, setActivePage] = useState("dashboard");

  // Function to switch pages dynamically
  const renderPage = () => {
    switch (activePage) {
      case "supplier":
        return <Supplier />;
      case "category":
        return <Category />;
      case "inventory-items":
        return <InventoryItems />;
      case "report":
        return <Report />;
      case "stock-movement":
        return <StockMovement />;
      case "user-activity-log":
        return <UserActivityLog />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar (Fixed Left) */}
      <Sidebar setActivePage={setActivePage} />

      {/* Main Content Area */}
      <div className="flex-1 shadow-lg ml-64">
        {/* Fixed Header */}
        <Header />

        {/* Dynamic Content Section (Right Side) */}
        <div className="p-6 mt-14">{renderPage()}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
