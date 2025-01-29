import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; 
const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    receiptImage: null,
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      const fetchExpense = async () => {
        try {
          const response = await fetch(
            `http://localhost:8001/api/expenses/expenses/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch expense data");
          }

          const json = await response.json();
          const data = json.expense;
          setFormData({
            description: data.description || "",
            amount: data.amount || "",
            date: data.date ? data.date.split("T")[0] : "",
            category: data.category || "",
            // receiptImage: null,
            receiptImageURL: data.receiptImage || "",
          });
        } catch (error) {
          console.error("Error fetching expense:", error);
        }
      };

      fetchExpense();
    }
  }, [id, token]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleImageChange = (e) => {
    setFormData({ ...formData, receiptImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("amount", formData.amount);
    formDataToSubmit.append("date", formData.date);
    formDataToSubmit.append("category", formData.category);
    if (formData.receiptImage) {
      formDataToSubmit.append("receiptImage", formData.receiptImage);
    }
    
  
    // Debugging FormData
    for (let pair of formDataToSubmit.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    try {
      const url = id
      ? `http://localhost:8001/api/expenses/expenses/${id}`
        : "http://localhost:8001/api/expenses/addexpenceimage";
      const method = id ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit expense");
      }
  
      Swal.fire({
        title: id ? "Expense updated successfully" : "Expense added successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => navigate("/user/expenses"));
    } catch (error) {
      console.error("Error submitting expense:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to submit expense. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  

  return (
    <div className="bg-[#F6F8FB] flex justify-center items-center py-9 px-4 h-full">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
        {/* Title */}
        <div className="mb-6 text-center">
          <h2 className="text-[26px] text-[#030229] font-bold">
            {id ? "Update Expense Details" : "Add Expense Details"}
          </h2>
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
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#0F0F12] outline-none placeholder:text-[#BDBDBD] focus:ring-2 focus:ring-[#438A7A]"
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
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#0F0F12] outline-none placeholder:text-[#BDBDBD] focus:ring-2 focus:ring-[#438A7A]"
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
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#0F0F12] outline-none placeholder:text-[#BDBDBD] focus:ring-2 focus:ring-[#438A7A]"
              required
            />
          </div>

          {/* Category Field */}
          <div>
            <label
              htmlFor="category"
              className="block text-[16px] text-[#0F0F12] font-semibold mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#0F0F12] outline-none placeholder:text-[#BDBDBD] focus:ring-2 focus:ring-[#438A7A]"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Image Field */}
          <div>
            <label
              htmlFor="receiptImage"
              className="block text-[16px] text-[#0F0F12] font-semibold mb-2"
            >
              Receipt Image
            </label>
            {id && formData.receiptImageURL && (
              <div className="mb-4">
                <p className="text-sm text-[#555] mb-2">
                  Current Receipt Image :-
                </p>
                <img
                  src={formData.receiptImageURL}
                  alt="Current Receipt"
                  className="w-20 rounded-lg"
                />
              </div>
            )}
            <input
              type="file"
              id="receiptImage"
              name="receiptImage"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#0F0F12] outline-none focus:ring-2 focus:ring-[#438A7A]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#438A7A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#397867] transition focus:ring-2 focus:ring-[#0F0F12]"
            >
              {id ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
