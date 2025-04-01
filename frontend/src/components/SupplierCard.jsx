import { useState } from "react";
import axios from "axios";

const SupplierCard = ({ supplier, onUpdate, onDelete }) => {
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [updatedSupplier, setUpdatedSupplier] = useState({ ...supplier });

  // Update Supplier
  const handleUpdate = async () => {
    if (!supplier.supplier_id) {
      console.error("Supplier ID is missing");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/supplier/update/${supplier.supplier_id}`,
        updatedSupplier,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        onUpdate({ ...supplier, ...updatedSupplier });
        setShowUpdatePopup(false);
      } else {
        console.error("Failed to update supplier:", response.data);
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  // Delete Supplier
  const handleDelete = async () => {
    if (!supplier.supplier_id) {
      console.error("Supplier ID is missing");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/supplier/delete/${supplier.supplier_id}`
      );

      if (response.status === 200) {
        onDelete(supplier.supplier_id);
        setShowDeletePopup(false);
      } else {
        console.error("Failed to delete supplier");
      }
    } catch (error) {
        if (error.response && error.response.status === 500) {
            alert("This supplier is in use with products and cannot be deleted.");
        }
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-lg hover:shadow-xl transition-all">
      <div >
  {/* Supplier Details */}
  <div className="border-b pb-4 mb-4">
    <h5 className="text-lg font-bold text-red-600">ID: {supplier.supplier_id}</h5>
    <h4 className="text-sm font-semibold text-gray-500 mt-2">Name</h4>
    <p className="text-xl text-blue-600 font-bold">{supplier.name}</p>
  </div>

  {/* Address & Contact */}
  <div className="mb-4">
    <h4 className="text-sm font-semibold text-gray-500 mt-2">Address</h4>
    <p className="text-gray-700">{supplier.address}</p>

    <h4 className="text-sm font-semibold text-gray-500 mt-2">Contact</h4>
    <p className="text-gray-700">{supplier.contact_info}</p>
  </div>

  {/* Action Buttons */}
  <div className="flex justify-center gap-4">
    <button
      onClick={() => setShowUpdatePopup(true)}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
    >
      Update
    </button>
    <button
      onClick={() => setShowDeletePopup(true)}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
    >
      Delete
    </button>
  </div>
</div>


      {/* Update Popup */}
      {showUpdatePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 w-[40%] rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Update Supplier</h2>
            <input
              type="text"
              className="block w-full mt-2 text-gray-800 bg-gray-100 p-2 border rounded"
              value={updatedSupplier.name}
              onChange={(e) =>
                setUpdatedSupplier({ ...updatedSupplier, name: e.target.value })
              }
              placeholder="Name"
            />
            <input
              type="text"
              className="block w-full mt-2 text-gray-800 bg-gray-100 p-2 border rounded"
              value={updatedSupplier.address}
              onChange={(e) =>
                setUpdatedSupplier({
                  ...updatedSupplier,
                  address: e.target.value,
                })
              }
              placeholder="Address"
            />
            <input
              type="text"
              className="block w-full mt-2 text-gray-800 bg-gray-100 p-2 border rounded"
              value={updatedSupplier.contact_info}
              onChange={(e) =>
                setUpdatedSupplier({
                  ...updatedSupplier,
                  contact_info: e.target.value,
                })
              }
              placeholder="Contact Info"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowUpdatePopup(false)}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg text-red-500 font-bold">Confirm Delete</h2>
            <p className="text-gray-700">
              Are you sure you want to delete this supplier?
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierCard;
