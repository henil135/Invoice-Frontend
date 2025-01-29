import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoPrintSharp } from "react-icons/io5";
import { MdEditDocument } from "react-icons/md";
import Swal from "sweetalert2";
export const PurchaseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState({});
  const [invoiceData, setInvoiceData] = useState({
    itemID: "",
    unit: "",
    price: "",
    total: "",
    quantity: "",
  });
  const [items, setItems] = useState([]);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  const token = localStorage.getItem("token");

  // Define available units
  const units =  ["DOZEN", "BOX", "GRAMS", "KILOGRAMS", "METERS", "TABLETS", "UNITS","PIECES","PAIRS"];

  // Fetching item data and invoice data (if editing)
  useEffect(() => {
    fetch("http://localhost:8001/api/item/getallitem")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filteredItems = data.filter((item) => item.userId === userId);
          setItems(filteredItems);
        } else {
          console.error("Expected an array of items from the API");
        }
      })
      .catch((error) => console.error("Error fetching items:", error));

    if (id) {
      fetch(`http://localhost:8001/api/purchaseInvoice/getsinglepurchaseinvoice/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const editData = data.purchaseinvoice;
          setInvoiceData(editData); // Pre-fill form with the existing invoice data
        })
        .catch((error) => console.error("Error fetching invoice data:", error));
    }
  }, [id, token, userId]);

  // Handling input changes and updating state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevError) => ({
      ...prevError,
      [name]: "",
    }));
  };

  // Validating the form fields
  const invoiceValidation = () => {
    const newErrors = {};
    if (!invoiceData.itemID) newErrors.itemID = "Please select an item";
    if (!invoiceData.unit) newErrors.unit = "Please select a unit";
    if (!invoiceData.price) newErrors.price = "Please enter price";
    if (!invoiceData.quantity) newErrors.quantity = "Please enter quantity";
    return newErrors;
  };

  // Handling changes to price and quantity, and calculating total
  const handlePriceQuantityChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (updatedData.price && updatedData.quantity) {
        updatedData.total = updatedData.price * updatedData.quantity;
      }
      return updatedData;
    });
  };

  // Handling form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = invoiceValidation();
    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
        const invoicePayload = {
            ...invoiceData,
            total: parseFloat(invoiceData.total), // Ensure total is a number
            itemID: invoiceData.itemID,
            quantity: parseInt(invoiceData.quantity, 10), // Ensure quantity is a number
        };

        const apiUrl = id
            ? `http://localhost:8001/api/purchaseInvoice/updatepurchaseinvoice/${id}`
            : "http://localhost:8001/api/purchaseInvoice/creatpurchaseinvoice";

        fetch(apiUrl, {
            method: id ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(invoicePayload),
        })
            .then((response) => response.json())
            .then(() => {
                Swal.fire({
                    title: "Success!",
                    text: "Invoice saved successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    navigate("/user/purchaseinvoice");
                });
            })
            .catch((error) => {
                console.error("Error saving invoice:", error);
                Swal.fire({
                    title: "Error!",
                    text: "There was an error saving the invoice.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            });
    }
};


  // Rendering input fields with error handling
  const renderInputFields = (label, name, type, options = [], readOnly = false) => (
    <div className="mb-4 space-y-1">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {options.length > 0 ? (
        <select
          name={name}
          value={invoiceData[name]}
          onChange={handleInputChange}
          className={`w-full rounded-md border ${error[name] ? "border-red-500" : ""} sm:text-sm p-2`}
        >
          <option value="">Select {label}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={invoiceData[name]}
          name={name}
          onChange={handleInputChange}
          onInput={handlePriceQuantityChange}
          readOnly={readOnly}
          className={`w-full rounded-md border ${error[name] ? "border-red-500" : ""} sm:text-sm p-2`}
        />
      )}
      {error[name] && <p className="text-red-500 text-xs italic">{error[name]}</p>}
    </div>
  );

  // Item selection dropdown and redirect to add a new item if needed
  const handleItemChange = (e) => {
    if (e.target.value === "addItem") {
      navigate("/user/itemsForm");
    } else {
      handleInputChange(e);
    }
  };

  return (
    <div className="w-full max-w-[20rem] sm:max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 my-20">
      <div className="border-b pb-3 text-lg font-bold text-gray-800">
        <h3>{id ? "Edit Invoice" : "Create New Invoice"}</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2 pt-4">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Item Name</label>
          <select
            name="itemID"
            value={invoiceData.itemID}
            onChange={handleItemChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Item</option>
            {Array.isArray(items) &&
              items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            <option value="addItem">Add Item</option>
          </select>
          {error.itemID && <p className="text-red-500 text-xs italic">{error.itemID}</p>}
        </div>

        {renderInputFields("Unit", "unit", "text", units)} {/* Updated to dropdown */}

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          {renderInputFields("Quantity", "quantity", "number")}
          {renderInputFields("Price", "price", "number")}
        </div>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          {renderInputFields("Total", "total", "number", [], true)} {/* Read-only field */}
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 pb-2">NOTES</label>
          <textarea
            className="min-h-[100px] w-full rounded-md border border-[#B9DFFA] bg-[#DCEFFD] text-[#204661] p-2 text-[90%]"
            placeholder="All accounts are to be paid within 7 days from receipt of invoice..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="sm:w-[30%] w-[50%] bg-[#397568] text-white rounded-md py-2 sm:px-1 flex items-center justify-center text-lg"
          >
            {id ? (
              <>
                <MdEditDocument className="mr-2" /> Update
              </>
            ) : (
              <>
                <IoPrintSharp className="mr-2" /> Save
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
