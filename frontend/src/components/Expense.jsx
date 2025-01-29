import React, { useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete, MdAdd } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Navigate, useNavigate } from "react-router-dom";

const Expenses = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expenses, setExpenses] = useState([
        {
            id: 1,
            date: "2024-12-15",
            description: "Office Supplies",
            amount: "₹500",
        },
        {
            id: 2,
            date: "2024-11-20",
            description: "Travel Expenses",
            amount: "₹750",
        },
        {
            id: 3,
            date: "2024-10-10",
            description: "Client Meeting Lunch",
            amount: "₹200",
        },
    ]);
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };
    const navigte = useNavigate();

    const filteredExpenses = expenses.filter((expense) =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteExpense = (id) => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
    };

    const handleExpenseform = () => {
        navigte('/expenses/expense-form')
    };

    return (
        <div className="bg-[#F6F8FB] p-3">
            <div className="bg-white rounded-lg p-2 shadow-lg">
                {/* Header Section */}
                <div className="top flex flex-wrap justify-between items-center p-2 pb-5">
                    <div className="heading font-bold text-[26px] text-[#030229]">
                        <h3>Expenses</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Search Bar */}
                        <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 w-80 hidden sm:flex">
                            <div className="text-xl text-gray-700">
                                <CiSearch />
                            </div>
                            <input
                                type="text"
                                placeholder="Search Description"
                                className="bg-transparent pl-2 text-lg outline-none w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Add Button */}
                        <button
                            className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-4 py-2 ml-2"
                            onClick={() => handleExpenseform()}
                        >
                            <div className="text-white text-xl mr-2">
                                <MdAdd />
                            </div>
                            <div className="font-semibold text-base">
                                <h3>Add Expense</h3>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Expenses Table */}
                <div
                    className="h-[100%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
                    style={{ maxHeight: "calc(100vh - 180px)" }}
                >
                    <table className="min-w-full table-auto">
                        <thead className="sticky top-0 bg-gray-100 z-10">
                            <tr>
                                <th className="p-3 text-[#030229] text-left font-semibold rounded-tl-xl">
                                    Date
                                </th>
                                <th className="p-3 text-[#030229] text-left font-semibold">
                                    Description
                                </th>
                                <th className="p-3 text-[#030229] text-left font-semibold">
                                    Amount
                                </th>
                                <th className="p-3 text-[#030229] text-center font-semibold rounded-tr-xl">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="border-t">
                                    <td className="p-3">
                                        <div className="text-[#4F4F4F] text-base font-semibold text-left">
                                            <h3>{formatDate(expense.date)}</h3>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="text-[#4F4F4F] text-base font-semibold text-left">
                                            <h3>{expense.description}</h3>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="text-[#4F4F4F] text-base font-semibold text-left">
                                            <h3>{expense.amount}</h3>
                                        </div>
                                    </td>
                                    <td className="flex items-center justify-center py-2 px-2">
                                        <div
                                            className="w-8 h-8 text-[#39973D] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm"
                                        >
                                            <FaEdit />
                                        </div>
                                        <div
                                            className="w-8 h-8 text-[#0EABEB] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm mx-2"
                                        >
                                            <FaEye />
                                        </div>
                                        <div
                                            className="w-8 h-8 text-[#E11D29] bg-[#f6f8fb] rounded-md flex items-center justify-center text-lg"
                                            onClick={() => deleteExpense(expense.id)}
                                        >
                                            <MdDelete />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
