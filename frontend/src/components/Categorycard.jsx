import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CategoryCard = ({ category, onUpdate, onDelete }) => {
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updatedName, setUpdatedName] = useState(category.name);

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


  //------------------------------------------------------------------------ Update Category-------------------------------------------------------------------------
  const handleUpdate = async () => {
    try {
      const username = getUserName();
  
      await axios.put(
        `http://localhost:8080/category/update-category/${category.id}`,
        { name: updatedName },
        {
          params: { username },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      onUpdate({ ...category, name: updatedName });
      setShowUpdatePopup(false);
      alert("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update the category. Please try again.");
    }
  };
  

  // ------------------------------------------------------------------------Delete Category---------------------------------------------------------------------------------
  const handleDelete = async () => {
    try {
      const username = getUserName();
  
      await axios.delete(
        `http://localhost:8080/category/delete-category/${category.id}`,
        {
          params: { username },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      onDelete(category.id);
      alert("Category deleted successfully!");
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alert("This category is in use with products and cannot be deleted.");
      } else {
        console.error("Error deleting category:", error);
        alert("Failed to delete the category. Please try again.");
      }
    }
  };
  
  return (
    <div className="flex flex-col ml-0 gap-3 p-3 max-w-md mx-auto">
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-700 flex flex-col justify-start items-center w-full transition-all hover:shadow-xl">
      {/* Category ID */}
      <div className="w-full text-center border-b border-blue-300 pb-3">
        <p className="text-red-600 font-bold text-lg tracking-wide">ID:{category.id}</p>
        <h4 className="text-xl font-semibold text-blue-700 break-words mt-1">{category.name}</h4>
      </div>
  
          {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-4 w-full">
           <button
               onClick={() => setShowUpdatePopup(true)}
               className="px-6 py-3 text-lg sm:px-5 sm:py-2 sm:text-base xs:px-4 xs:py-1.5 xs:text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
           >
             Update
          </button>
          <button
           onClick={handleDelete}
           className="px-6 py-3 text-lg sm:px-5 sm:py-2 sm:text-base xs:px-4 xs:py-1.5 xs:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
            >
           Delete
           </button>
       </div>

    
        {/* Update Popup */}
        {showUpdatePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
            <div className="bg-white p-6 w-[90%] md:w-[40%] rounded-lg shadow-lg">
              <h2 className="text-lg font-bold">Update Category</h2>
              <input
                type="text"
                className="block w-full mt-2 p-2 border rounded"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setShowUpdatePopup(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default CategoryCard;


  