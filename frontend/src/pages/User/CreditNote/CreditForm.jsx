import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CreditForm = () => {
  const [creditData, setCreditData] = useState({
    date: new Date().toISOString().split("T")[0], // Set today's date
    customername: "",
    invoice: "",
    invoiceDate: "",
    salesperson: "",
    items: [],
  });

  const [invoices, setInvoices] = useState([]); // Initialize as an empty array
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all invoices from the API
    const token = localStorage.getItem("token"); // Get the Bearer token from local storage
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null; // Get the logged-in user's ID
  
    axios
      .get("http://localhost:8001/api/invoice/viewAll", {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token here
        },
      })
      .then((response) => {
        // Ensure the response contains the invoices array
        if (response.data && Array.isArray(response.data.invoices)) {
          const userInvoices = response.data.invoices.filter(
            (invoice) => invoice.userId === userId // Only include invoices for the logged-in user
          );
          setInvoices(userInvoices);
        } else {
          console.error(
            "API response does not contain invoices array:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  
    if (id) {
      const savedCredits = JSON.parse(localStorage.getItem("credits"));
      const creditToEdit = savedCredits.find(
        (credit) => credit.id === parseInt(id)
      );
      if (creditToEdit) {
        setCreditData(creditToEdit);
      }
    }
  }, [id]);
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleInvoiceChange = (e) => {
    const selectedInvoiceId = e.target.value;
    const selectedInvoice = invoices.find(
      (invoice) => invoice._id === selectedInvoiceId
    );

    if (selectedInvoice) {
      // Convert ISO date to yyyy-MM-dd format for the input field
      const formattedDate = selectedInvoice.invoiceDate.split("T")[0];

      setCreditData((prevData) => ({
        ...prevData,
        invoice: selectedInvoice._id, // Use the invoice's _id as invoiceID
        invoiceDate: formattedDate, // Use the formatted date
        customername: selectedInvoice.customerName, // Set customerName from the API
        salesperson: selectedInvoice.salespersonName, // Use salespersonName from the API
        items: selectedInvoice.items.map((item) => ({
          id: item.item, // Use the item's item field as itemID
          details: item.name,
          quantity: item.quantity,
          rate: item.price,
          discount: 0,
          tax: item.tax,
          amount: item.total,
        })),
      }));
    }
  };

  const handleItemChange = (index, name, value) => {
    const updatedItems = [...creditData.items];
    const item = updatedItems[index];
    item[name] =
      name === "quantity" ||
      name === "rate" ||
      name === "discount" ||
      name === "tax"
        ? parseFloat(value) || 0
        : value;

    // Recalculate amount for the row
    const discountAmount = (item.rate * item.quantity * item.discount) / 100;
    const taxAmount =
      ((item.rate * item.quantity - discountAmount) * item.tax) / 100;
    item.amount = item.rate * item.quantity - discountAmount + taxAmount;

    setCreditData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  const calculateSubTotal = () => {
    return creditData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    return subTotal;
  };

  const calculateBalance = () => {
    const total = calculateTotal();
    const payments = creditData.payments || 0;
    return total - payments;
  };

  const addNewRow = () => {
    setCreditData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          id: prevData.items.length + 1,
          details: "",
          quantity: 1,
          rate: 0,
          discount: 0,
          tax: 0,
          amount: 0,
        },
      ],
    }));
  };

  const removeRow = (index) => {
    const updatedItems = creditData.items.filter((_, i) => i !== index);
    setCreditData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!creditData.date) errors.date = "Date is required.";
    if (!creditData.customername)
      errors.customername = "Customer Name is required.";
    if (!creditData.invoice) errors.invoice = "Invoice number is required.";

    creditData.items.forEach((item, index) => {
      if (!item.details)
        errors[`item_${index}_details`] = "Item details are required.";
      if (item.quantity <= 0)
        errors[`item_${index}_quantity`] = "Quantity must be greater than 0.";
      if (item.rate < 0)
        errors[`item_${index}_rate`] = "Rate cannot be negative.";
      if (item.discount < 0 || item.discount > 100)
        errors[`item_${index}_discount`] =
          "Discount must be between 0 and 100.";
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      const token = localStorage.getItem("token"); // Get the Bearer token from local storage
      const apiData = {
        invoiceID: creditData.invoice,
        returnedItems: creditData.items.map((item) => ({
          itemID: item.id,
          quantity: item.quantity,
        })),
      };
  
      console.log("API Data:", apiData); // Log API data before sending
      console.log("Token:", token); // Log token to ensure it's available
  
      try {
        const response = await axios.post(
          "http://localhost:8001/api/creditNotes/create",
          apiData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the Bearer token in the request headers
              "Content-Type": "application/json", // Ensure proper Content-Type
            },
          }
        );
  
        console.log("Response:", response); // Log successful response
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Credit note created successfully.",
        }).then(() => {
          navigate("/user/credits");
        });
      } catch (error) {
        console.error("Error during API call:", error.response || error.message);
  
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Error creating credit note.",
        });
      }
    }
  };
  
  
  return (
    <div className="p-4">
      <div className="max-w-full p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Credit" : "Add New Credit"}
      </h2>
        <form onSubmit={handleSubmit}>
          {/* Credit Details Section */}
          <div className="mb-3 p-5 rounded-lg border">
            <h2 className="block text-lg font-medium mb-4">Credit Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Render Input Fields */}
              <div>
                <label className="block font-medium pb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={creditData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date}</p>
                )}
              </div>
              <div>
                <label className="block font-medium pb-1">Customer Name</label>
                <input
                  type="text"
                  name="customername"
                  value={creditData.customername}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                {errors.customername && (
                  <p className="text-red-500 text-sm">{errors.customername}</p>
                )}
              </div>
              <div>
                <label className="block font-medium pb-1">Invoice #</label>
                <select
                  name="invoice"
                  value={creditData.invoice}
                  onChange={handleInvoiceChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Select Invoice --</option>
                  {invoices.map((invoice) => (
                    <option key={invoice._id} value={invoice._id}>
                      {invoice.invoiceNumber} {/* Display invoiceNumber */}
                    </option>
                  ))}
                </select>
                {errors.invoice && (
                  <p className="text-red-500 text-sm">{errors.invoice}</p>
                )}
              </div>
              <div>
                <label className="block font-medium pb-1">Invoice Date</label>
                <input
                  type="date"
                  name="invoiceDate"
                  value={creditData.invoiceDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                {errors.invoiceDate && (
                  <p className="text-red-500 text-sm">{errors.invoiceDate}</p>
                )}
              </div>
              <div>
                <label className="block font-medium pb-1">Salesperson</label>
                <input
                  type="text"
                  name="salesperson"
                  value={creditData.salesperson}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                {errors.salesperson && (
                  <p className="text-red-500 text-sm">{errors.salesperson}</p>
                )}
              </div>
            </div>
          </div>

          {/* Item Table Section */}
          <div className="mb-3 rounded-lg border p-5">
            <h2 className="block text-lg font-medium mb-4">Item Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2">Item Details</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Rate</th>
                    <th className="border p-2">Discount (%)</th>
                    <th className="border p-2">Tax (%)</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {creditData.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item.details}
                          onChange={(e) =>
                            handleItemChange(index, "details", e.target.value)
                          }
                          className="w-full p-1"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          className="w-full p-1"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(index, "rate", e.target.value)
                          }
                          className="w-full p-1"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            handleItemChange(index, "discount", e.target.value)
                          }
                          className="w-full p-1"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) =>
                            handleItemChange(index, "tax", e.target.value)
                          }
                          className="w-full p-1"
                        />
                      </td>
                      <td className="border p-2 text-right">
                        {item.amount.toFixed(2)}
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="text-red-500"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={addNewRow}
              className="mt-4 p-2 text-white rounded bg-[#438A7A]"
            >
              Add Row
            </button>
          </div>

      {/* Summary Section */}
<div className="mb-5 p-5 rounded-lg border">
  <h2 className="block text-lg font-medium mb-4 text-right">Summary</h2>
  <div className="flex justify-end">
    <div className="text-right">
      <h3>Subtotal: ₹{calculateSubTotal().toFixed(2)}</h3>
      <h3>Total: ₹{calculateTotal().toFixed(2)}</h3>
      <h3>Balance: ₹{calculateBalance().toFixed(2)}</h3>
    </div>
  </div>
</div>


          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-300 text-black rounded-lg px-4 py-2"
              onClick={() => navigate("/user/credits")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white py-2 px-6 rounded-lg bg-[#438A7A]"
            >
              {id ? "Update Credit" : "Add Credit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditForm;
