import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ViewExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/api/expenses/expenses/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch expense data");
        const json = await response.json();
        const data = json.expense;
        console.log(data);

        setExpense(data);
      } catch (error) {
        console.error("Error fetching expense:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <h2>Loading expense details...</h2>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center mt-10">
        <h2>No expense details available.</h2>
        <button
          className="bg-[#438A7A] text-white px-6 py-3 rounded-lg font-semibold mt-4"
          onClick={() => navigate("/user/expenses")}
        >
          Back to Expenses
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-9 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-[26px] text-[#030229] font-bold">
            Expense Details
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex">
            <h3 className="font-bold text-[#0F0F12]">Description :-</h3>
            <p className="ms-2">{expense.description}</p>
          </div>
          <div className="flex">
            <h3 className="font-bold text-[#0F0F12]">Amount :-</h3>
            <p className="ms-2">₹{expense.amount}</p>
          </div>
          <div className="flex">
            <h3 className="font-bold text-[#0F0F12]">Date :-</h3>
            <p className="ms-2">{formatDate(expense.date)}</p>
          </div>
          <div className="flex">
            <h3 className="font-bold text-[#0F0F12]">Category :-</h3>
            <p className="ms-2">{expense.category}</p>
          </div>
          {expense.imageUrl && (
            <div className="flex flex-col mt-4">
              <h3 className="font-bold text-[#0F0F12] mb-2">Receipt :-</h3>
              <img
                src={expense.imageUrl}
                alt="Expense Receipt"
                className="w-full max-h-64 object-cover rounded-lg shadow"
              />
            </div>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#438A7A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#397867] transition focus:ring-2 focus:ring-[#0F0F12]"
            onClick={() => navigate("/user/expenses")}
          >
            Back to Expenses
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewExpense;
