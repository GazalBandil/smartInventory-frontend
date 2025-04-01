import { useEffect, useState } from "react";

export default function Header() {
    const [username, setUsername] = useState("");

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
          <h1 className="text-xl font-semibold">{username || "Guest"}</h1>
        </div>
      </header>
      
    );
  }
  