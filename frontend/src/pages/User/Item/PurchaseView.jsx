import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const PurchaseView = () => {
  const { id } = useParams();
  const [purchaseData, setPurchaseData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token not found");
          return;
        }

        const response = await fetch(
          `http://localhost:8001/api/purchaseInvoice/getsinglepurchaseinvoice/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch purchase data");
        }

        const dataRes = await response.json();
        const data = dataRes.purchaseinvoice;
        setPurchaseData(data);
      } catch (err) {
        console.error("Error fetching purchase data:", err);
        setError("Failed to fetch purchase data");
      }
    };

    fetchPurchaseData();
  }, [id]);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!purchaseData) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="">
      <div className="mx-auto max-w-4xl bg-white p-6 md:p-8 relative shadow-sm my-24">
        {/* Invoice Number */}
        <div className="mb-8">
          <h3 className="text-gray-600 font-medium">Invoice Number</h3>
          <p className="text-gray-500 text-sm">{purchaseData.invoiceNumber || "N/A"}</p>
        </div>

        {/* Invoice Title */}
        <div className="absolute top-8 right-8">
          <h1 className="text-4xl md:text-5xl font-light text-gray-200">INVOICE</h1>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-3 px-4">Item </th>
                <th className="text-right py-3 px-4">Qty</th>
                <th className="text-right py-3 px-4">Unit</th>
                <th className="text-right py-3 px-4">Rate</th>
                <th className="text-right py-3 px-4">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {
                <tr key={purchaseData._id}>
                  <td className="py-3 px-4">{purchaseData.itemID.name || "N/A"}</td>
                  <td className="py-3 px-4 text-right">{purchaseData.quantity || 0}</td>
                  <td className="py-3 px-4 text-right">{purchaseData.unit || 0}</td>
                  <td className="py-3 px-4 text-right">{purchaseData.price || 0}</td>
                  <td className="py-3 px-4 text-right">{purchaseData.total || 0}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t pt-4">
          <div className="flex justify-end text-sm">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-1 font-medium">
                <span className="text-gray-600">Total</span>
                <span>{purchaseData.total || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Invoice Text */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          This is a sample invoice PDF.
        </div>
        <button
          onClick={() => navigate("/user/purchaseinvoice")}
          className="mt-4 bg-[#438A7A] text-white rounded px-4 py-2"
        >
          Back to Invoices
        </button>
      </div>
    </div>
  );
};
