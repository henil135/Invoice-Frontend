import React, { useEffect, useState } from "react";
import { TbListDetails } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";

export const ItemsDetails = () => {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch item data by ID
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch(`http://localhost:8001/api/item/getitembyitemid/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }
        const data = await response.json();
        setItemData(data[0]);
      } catch (error) {
        console.error("Error fetching item details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-5 rounded-lg mx-auto sm:w-[70%] w-[90%] mt-8 text-center">
        <h2 className="text-lg font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">No item data found for this ID.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 sm:w-[70%] w-[90%] mx-auto mt-10">
      <h1 className="text-3xl font-normal mb-3">
        Item Details
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 border space-y-2">
          <h2 className="text-xl font-semibold mb-4 border-b text-xl font-semibold pb-2">Basic Information</h2>
          <p className="text-base">
            <strong className="text-base font-semibold">Name:</strong> {itemData.item || "N/A"}
          </p>
          <p className="text-base">
            <strong className="text-base font-semibold">SKU:</strong> {itemData.sku || "N/A"}
          </p>
          <p className="text-base">
            <strong className="text-base font-semibold">Rate:</strong> {itemData.price || "N/A"}
          </p>
          <p className="text-base">
            <strong className="text-base font-semibold">Stock:</strong> {itemData.stock || "N/A"}
          </p>
          <p className="text-base">
            <strong className="text-base font-semibold">Unit:</strong> {itemData.unit || "N/A"}
          </p>
        </div>

        <div className="border p-5 space-y-2">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Additional Details</h2>
          <p className="text-base">
            <strong className="text-base font-semibold">Item Type:</strong> {itemData.type || "N/A"}
          </p>
          <p className="text-base">
            <strong className="text-base font-semibold">Description:</strong> {itemData.description || "N/A"}
          </p>
          <p className="text-base">
            <strong className="text-base font-semibold">Default Tax Rate:</strong> {itemData.defaultTaxRates || "N/A"}
          </p>
          <p className="text-base">
            <strong className="text-base font-semibold">Tax Preference:</strong> {itemData.taxPreference || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/user/items")}
          className="mt-4 bg-[#438A7A] text-white rounded px-4 py-2"
        >
          Back to Items
        </button>
      </div>
    </div>
  );
};
