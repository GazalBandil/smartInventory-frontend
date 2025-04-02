import { useState, useEffect } from "react";
import axios from "axios";
import CategoryCard from "../components/Categorycard.jsx"
import { jwtDecode } from "jwt-decode";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newCategory, setNewCategory] = useState("");


    
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

  //----------------------------------------------------------------------- Fetch all categories----------------------------------------------------------------------------
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/category/all-category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------------------------------- ---------------------Create a new category-------------------------------------------------------------------------------------
  // Create a new category
  const handleCreateCategory = async () => {
    try {
      const username = getUserName();
      const response = await axios.post("http://localhost:8080/category/add-category", { name: newCategory },
        {  params: { username },
                headers: {
                  "Content-Type": "application/json",
        },});
      setCategories([...categories, response.data]);
      setNewCategory("");
      setShowCreatePopup(false);
      alert("category is added successfully!!");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };
  
  // --------------------------------------------------------UI------------------------------------------------------------------------------------------------------------

  return (
    <div className="fixed left-64 top-14 w-[calc(100%-64px)] h-[calc(100vh-14px)] overflow-y-scroll  p-6 bg-gray-100">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={fetchCategories}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          All Categories
        </button>
        <button
          onClick={() => setShowCreatePopup(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create Category
        </button>
      </div>

      {/*-------------------------------------------------------------------- Category List---------------------------------------------------------------------------------- */}
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} onUpdate={fetchCategories} onDelete={fetchCategories} />
        ))}
      </div>

      {/* Create Category Popup */}
      {showCreatePopup && (
        <div className="fixed inset-0 flex items-center justify-center  bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold">Create Category</h2>
            <input
              type="text"
              name="name"
              className="block w-full mt-2 p-2 border rounded"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category Name"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setShowCreatePopup(false)} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleCreateCategory} className="px-3 py-1 bg-green-500 text-white rounded">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
