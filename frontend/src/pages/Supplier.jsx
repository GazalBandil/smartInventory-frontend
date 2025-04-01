import React, { useState, useEffect } from "react";
import axios from "axios";
import SupplierCard from "../components/SupplierCard.jsx";

const Supplier = () => {
  const [activeTab, setActiveTab] = useState("all-suppliers");
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({

    name: "",
    contact_info: "",
    address: "",
  });

  useEffect(() => {
    if (activeTab === "all-suppliers") {
      fetchSuppliers();
    }
  }, [activeTab]);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/supplier/all-supplier");
      setSuppliers(res.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
    }
  };

  const handleInputChange = (e) => {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/supplier/add-supplier", newSupplier);
      setSuppliers((prev) => [...prev, res.data]);
      setNewSupplier({ name: "", contact_info: "", address: "" });
      setActiveTab("all-suppliers");
      alert("Supplier added successfully!");
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  const handleUpdateSupplier = async (supplier_id, updatedData) => {
    try {
      await axios.put(`http://localhost:8080/supplier/update/${supplier_id}`, updatedData);
      setSuppliers((prev) => prev.map((supplier) => 
        supplier.supplier_id === supplier_id ? { ...supplier, ...updatedData } : supplier
      ));
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  const handleDeleteSupplier = async (supplier_id) => {
    try {
      await axios.delete(`http://localhost:8080/supplier/delete/${supplier_id}`);
      setSuppliers((prev) => prev.filter((supplier) => supplier.supplier_id !== supplier_id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <div className="fixed left-64 top-14 w-[calc(100%-64px)] h-[calc(100vh-14px)] p-6 overflow-scroll bg-gray-100">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            activeTab === "all-suppliers"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("all-suppliers")}
        >
          All Suppliers
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            activeTab === "new-supplier"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("new-supplier")}
        >
          Create New Supplier
        </button>
      </div>

      {activeTab === "all-suppliers" ? (
        <div className="space-y-4">
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <SupplierCard
                key={supplier.supplier_id}
                supplier={supplier}
                onUpdate={handleUpdateSupplier}
                onDelete={handleDeleteSupplier}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">No suppliers found.</p>
          )}
        </div>
      ) : (
        <form className="bg-white w-[50%] p-6 rounded-lg shadow-md space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium text-gray-900">Supplier Name</label>
            <input
              type="text"
              name="name"
              value={newSupplier.name}
              onChange={handleInputChange}
              className="w-full p-2 border text-gray-700 bg-gray-100 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-900">Contact Number</label>
            <input
              type="text"
              name="contact_info"
              value={newSupplier.contact_info}
              onChange={handleInputChange}
              className="w-full p-2 bg-slate-100 text-gray-700 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-900">Address</label>
            <input
              type="text"
              name="address"
              value={newSupplier.address}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-100 text-gray-700 border rounded-md"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Add Supplier
          </button>
        </form>
      )}
    </div>
  );
};

export default Supplier;