import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CreditView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credit, setCredit] = useState(null);

  useEffect(() => {
    // Fetch credit details from the API
    const fetchCreditDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from local storage
        const response = await axios.get(
          `http://localhost:8001/api/creditNotes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
          }
        );
        if (response.data && response.data.notes) {
          setCredit(response.data.notes);
        } else {
          console.error(
            "API response does not contain credit note details:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching credit details:", error);
        alert("Failed to fetch credit details.");
      }
    };

    if (id) {
      fetchCreditDetails();
    }
  }, [id]);

  if (!credit) {
    return (
      <div className="p-5 text-center">
        <h2 className="text-xl font-bold text-red-500">Credit not found</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 bg-[#F6F8FB] min-h-screen flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-4xl">
        <section className="mb-6">
          <div className="flex justify-between items-start">
            <div>
             <div>
             <h2 className="text-gray-800 font-bold">BILL TO</h2>
              <p className="text-gray-600">
                {credit.invoiceDetails?.customerName || "N/A"}
              </p>
             </div>
             <div>
              <h2 className="text-gray-800 font-bold">Invoice</h2>
              <p className="text-gray-600">
                {credit.invoiceDetails?.invoiceNumber || "N/A"}
              </p>
             </div>
            </div>
            <div className="text-right">
              <h2 className="text-gray-800 font-bold">CREDIT NOTE</h2>
              <p className="text-gray-600">
                Credit Note#: {credit.creditNoteID || "N/A"}
              </p>
              <p className="text-gray-600">
                Date:{" "}
                {new Date(
                  credit.invoiceDetails?.invoiceDate
                ).toLocaleDateString() || "N/A"}
              </p>
              <p className="text-gray-600 font-bold text-lg">
                Total: ${credit.invoiceDetails?.total?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Terms</th>
                <th className="border border-gray-300 p-2 text-right">
                  Salesperson
                </th>
                <th className="border border-gray-300 p-2 text-right">
                  Due Date
                </th>
                <th className="border border-gray-300 p-2 text-right">
                  Recurring
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  {credit.invoiceDetails?.terms || "N/A"}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {credit.invoiceDetails?.salespersonName || "N/A"}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {new Date(
                    credit.invoiceDetails?.dueDate
                  ).toLocaleDateString() || "N/A"}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {credit.invoiceDetails?.recurring ? "Yes" : "No"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className=" border-t-2 border-gray-300 pt-4 flex justify-between items-center">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Payment Options:</p>
            <p className="text-sm text-gray-500">Check or Credit Card</p>
            <p className="text-sm text-gray-500">Payment Terms</p>
            <p className="text-sm text-gray-500">30 days from receipt</p>
          </div>
          <div className="flex flex-col justify-end items-end">
            <p className="font-bold text-gray-500 text-3xl mt-2">THANK</p>
            <p className="font-bold text-gray-500 text-3xl mt-2">YOU</p>
            <div className="border-t-4 border-gray-500 w-40 mt-4"></div>
          </div>
        </footer>
        <div className="pt-7 flex justify-end">
          <button
            className="mt-5 px-4 py-2 bg-[#438A7A] text-white rounded"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditView;
