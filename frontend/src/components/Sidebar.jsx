import axios from "axios";
import { useNavigate ,NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const navigate = useNavigate();

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
  
      // -------------------------------------------------------------------Handle logout ------------------------------------------------------------
  const handleLogout = async () => {
    try {
        const username = getUserName(); 
        if (!username) {
            alert("Username not found, unable to log out.");
            return;
        }
        console.log("Logging out user:", username); 
        await axios.post("http://localhost:8080/auth/logout", null, {
            params: { username },
            headers: {
                "Content-Type": "application/json",
            },
        });
        localStorage.removeItem("isAuthenticated");
        alert("Successfully logged out");
        navigate("/login");
        window.location.reload();
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        alert("Logout failed. Try again.");
    }
};

// -----------------------------------------------------------------------------ui--------------------------------------------------------------------------
  return (
    <div className="w-64 h-screen fixed top-14 left-0 bg-slate-200 text-white p-6 shadow-lg flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-8 text-center">Smart Inventory System</h2>
        <nav>
          <ul className="space-y-4">
            {[
              { name: "Dashboard", path: "/" },
              { name: "Supplier", path: "/supplier" },
              { name: "Category", path: "/category" },
              { name: "Inventory Items", path: "/inventory-items" },
              { name: "Report", path: "/report" },
              { name: "User Activity Log", path: "/user-activity-log" },
            ].map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block py-3 px-4 text-gray-700 font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent hover:text-blue-600 hover:border-blue-500 hover:border-b-2 hover:shadow-md hover:rounded-md"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <br />
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 text-red-500 font-semibold hover:text-red-700 transition hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

