import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Header() {
    const [username, setUsername] = useState("");

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
    

    useEffect(() => {
        // Retrieve username from local storage 
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.username) {
          setUsername(storedUser.username);
        }
      }, []);
    
    return (
        <header className="fixed top-0 left-0 w-full text-blue-500 bg-slate-200 py-4 shadow-lg ">
        <div className="container mx-auto flex justify-center">
          <h1 className="text-xl font-semibold">{getUserName() || "Guest"}</h1>
        </div>
      </header>
      
    );
  }
  