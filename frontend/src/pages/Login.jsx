import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"


export default function Login() {
  const [activeTab, setActiveTab] = useState("login"); // "login" or "register"
  const [role, setRole] = useState("user"); // "admin" or "user"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    contactNo: "",
    
  });

  const navigate = useNavigate();

   // Handle input changes
   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

       // Inside your Login function

const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post("http://localhost:8080/auth/login", {
      email: formData.email,
      password: formData.password,
    });
    const token = response.data;
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userRole = decodedToken.role;
    alert("Successfully Logged in");
     console.log(userRole);
    localStorage.setItem("token", token); 
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("role", userRole);

    if (userRole === "ADMIN") {
      console.log("User is an Admin!");
      navigate("/"); 
    } else {
      console.log("User is a regular user");
      navigate("/");
    }

    window.location.reload(); 

  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};

     // Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/create-user", 
       {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        contactNo: formData.contactNo,
        
       },
       {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
      );
      alert("User registered successfully");
      setActiveTab("login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-blue-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        {activeTab === "login" ? (
          <>
            {/* Tabs */}
            <div className="flex mb-6 gap-5 border-b-3">
              <button
                className={`flex-1 bg-white shadow-md pb-2 text-lg font-bold text-center transition-all duration-300 ${
                  role === "admin"
                    ? "border-b-4 border-blue-500 text-blue-700"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setRole("admin")}
              >
                ADMIN
              </button>
              <button
                className={`flex-1 pb-2 bg-white shadow-md text-lg font-bold text-center transition-all duration-300 ${
                  role === "user"
                    ? "border-b-4 border-blue-500 text-blue-700"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setRole("user")}
              >
                USER
              </button>
            </div>

            {/* Login Form */}
            <form className="space-y-5 " onSubmit={handleLogin}>
              <div>
                <label className="block text-left text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-100 text-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-left text-gray-700 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 bg-gray-100 text-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.password}
                  onChange={handleChange}
                />
                
              </div>
              <button
               type = "submit"
               className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold">
                {role === "admin" ? "Login as Admin" : "Login as User"}
              </button>
            </form>

            {/* Show for USER */}
            {role === "user" && (
              <p className="mt-4 text-center text-gray-600">
                Not a user?{" "}
                <span
                  className="text-blue-500 font-semibold cursor-pointer"
                  onClick={() => setActiveTab("register")}
                >
                  Register yourself
                </span>
              </p>
            )}
          </>
        ) : (
          <>
            {/* Register Form */}
            <h2 className="text-2xl font-bold text-center text-blue-700">Register</h2>
            <form className="space-y-4 mt-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-left text-gray-700 font-medium">Company Email</label>
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
                  <label className="block text-left text-gray-700 font-medium">First Name</label>
                  <input
                    type="text"
                    name = "firstName"
                    placeholder="First Name"
                    required
                    className="w-full px-4 py-2 bg-gray-100 text-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-left text-gray-700 font-medium">Last Name</label>
                  <input
                    type="text"
                    name = "lastName"
                    placeholder="Last Name"
                    required
                    className="w-full px-4 py-2 bg-gray-100 text-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-left text-gray-700 font-medium">Username</label>
                <input
                  type="text"
                  name = "username"
                  placeholder="Enter your username"
                  required
                  className="w-full px-4 py-2 bg-gray-100 border text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-left text-gray-700 font-medium">Password</label>
                <input
                  type="password"
                  name = "password"
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2 bg-gray-100 border text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-left text-gray-700 font-medium">Contact No</label>
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

            {/* Back to Login */}
            <p className="mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-500 font-semibold cursor-pointer"
                onClick={() => setActiveTab("login")}
              >
                Login here
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
