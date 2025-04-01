import { useState } from "react";
import axios from "axios";

const CategoryCard = ({ category, onUpdate, onDelete }) => {
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updatedName, setUpdatedName] = useState(category.name);

  // Update Category
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/category/update-category/${category.id}`,
        { name: updatedName }
      );
      if (response.status === 200) {
        onUpdate({ ...category, name: updatedName });
        setShowUpdatePopup(false);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Delete Category
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/category/delete-category/${category.id}`
      );
      
      if (response.status === 200) {
        onDelete(category.id);
      }
     
    } catch (error) {
        if (error.response && error.response.status === 500) {
            alert("This category is in use with products and cannot be deleted.");
        } 
        else{
      console.error("Error deleting category:", error);
        }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-6 max-w-4xl mx-auto">
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-700 flex flex-col justify-between items-center w-full transition-all hover:shadow-xl">
      {/* Category ID */}
      <div className="w-full text-center border-b border-blue-300 pb-3">
        <p className="text-red-600 font-bold text-lg tracking-wide">ID:{category.id}</p>
        <h4 className="text-xl font-semibold text-blue-700 break-words mt-1">{category.name}</h4>
      </div>
  
      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <button
          onClick={() => setShowUpdatePopup(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
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


  