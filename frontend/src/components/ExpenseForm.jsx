import React, { useState } from "react";

const ExpenseForm = () => {
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        date: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        // Clear form after submission
        setFormData({ description: "", amount: "", date: "" });
    };

    return (
        <div className="bg-[#F6F8FB] flex justify-center items-center py-9 px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                {/* Title */}
                <div className="mb-6 text-center">
                    <h2 className="text-[26px] text-[#030229] font-bold">Add Expense Details</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Description Field */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-[16px] text-[#0F0F12] font-semibold mb-2"
                        >
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-[#F5F5F5] rounded-lg p-3 text-[#0F0F12] outline-none placeholder:text-[#BDBDBD] focus:ring-2 focus:ring-[#438A7A]"
                            placeholder="Enter expense description"
                            required
                        />
                    </div>

                    {/* Amount Field */}
                    <div>
                        <label
                            htmlFor="amount"
                            className="block text-[16px] text-[#0F0F12] font-semibold mb-2"
                        >
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full bg-[#F5F5F5] rounded-lg p-3 text-[#0F0F12] outline-none placeholder:text-[#BDBDBD] focus:ring-2 focus:ring-[#438A7A]"
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    {/* Date Field */}
                    <div>
                        <label
                            htmlFor="date"
                            className="block text-[16px] text-[#0F0F12] font-semibold mb-2"
                        >
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-[#F5F5F5] rounded-lg p-3 text-[#0F0F12] outline-none placeholder:text-[#BDBDBD] focus:ring-2 focus:ring-[#438A7A]"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-[#438A7A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#397867] transition focus:ring-2 focus:ring-[#0F0F12]"
                        >
                            Add Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;
