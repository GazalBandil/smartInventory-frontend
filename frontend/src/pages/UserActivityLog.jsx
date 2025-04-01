import { useState, useEffect } from "react";
import axios from "axios";


const UserActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    contactNo: "",
  });

  //-------------------------------------------- Fetch user activity logs------------------------------------------------------
  const fetchLogs = async (username = "") => {
    try {
      const response = await axios.get(
        `http://localhost:8080/user-activities/${username}`
      );
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching user activity logs:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = decode(token);
        const username = decodedToken.username; 
        fetchLogs(username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found. User is not logged in.");
    }
  }, []); 

  // --------------------------------------------Handle input changes----------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //------------------------------------- Handle search input change-------------------------------------------------
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchLogs(e.target.value);
  };

  // -------------------------------------------------Register Handler------------------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      alert("Access Denied: Only admins can create new admins");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/create-admin",
        {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          contactNo: formData.contactNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert("Admin registered successfully");
      setShowForm(false);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        username: "",
        contactNo: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="fixed left-64 top-14 w-[calc(100%-64px)] h-[calc(100vh-14px)] p-6 bg-gray-100 overflow-auto">
      {/* Header */}
      <p className="text-blue-950 text-left underline font-bold text-4xl">
        User Activity Log
      </p>
      <br />

      {/* Search Bar & Button */}
      <div className="flex gap-3 w-[80%] items-center">
        {/* Search Input */}
        <div className="mb-4 w-[30%] mt-8">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border text-center border-gray-200 bg-blue-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Create Admin Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ml-auto"
        >
          Create Admin
        </button>
      </div>

      <br />

      {/* Activity Logs */}
      <div className="w-full max-w-xl grid gap-5">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 w-full"
            >
              <div className="flex flex-col space-y-2">
                <h4 className="text-xl font-semibold text-blue-700">
                  {log.username}
                </h4>
                <p className="text-gray-600 text-base font-medium bg-blue-50 px-3 py-1 rounded-md inline-block w-fit">
                  {log.action}
                </p>
                <h5 className="text-gray-800 font-medium text-sm italic">
                  {log.description}
                </h5>
                <p className="text-gray-500 text-xs border-t pt-2">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No activity found for this user.</p>
        )}
      </div>

      {/* Register Form */}
      {showForm && (
        <div className="mt-6 p-6  bg-white rounded-xl justify-end shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center text-blue-700">
            Register Admin
          </h2>
          <form className="space-y-4 mt-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-left text-gray-700 font-medium">
                Company Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="xyz@nucleusteq.com"
                className="w-full px-4 py-2 bg-gray-100 border text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                pattern=".+@nucleusteq\.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-left text-gray-700 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  className="w-full px-4 py-2 bg-gray-100 text-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-left text-gray-700 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  className="w-full px-4 py-2 bg-gray-100 text-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-left text-gray-700 font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                required
                className="w-full px-4 py-2 bg-gray-100 border text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-left text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 bg-gray-100 border text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-left text-gray-700 font-medium">
                Contact No
              </label>
              <input
                type="tel"
                name="contactNo"
                placeholder="Enter your contact number"
                required
                className="w-full px-4 py-2 bg-gray-100 text-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formData.contactNo}
                onChange={handleChange}
              />
            </div>
            <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold">
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserActivityLog;
