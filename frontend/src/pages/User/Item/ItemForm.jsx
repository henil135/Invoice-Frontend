import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { IoMdArrowDropdown, IoMdCreate } from "react-icons/io";
import { IoPrintSharp } from "react-icons/io5";
import { MdEditDocument } from "react-icons/md";
import Swal from "sweetalert2";

export const ItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [itemData, setItemData] = useState({
    type: "",
    name: "",
    sku: "",
    unit: "",
    item: "",
    taxPreference: "",
    price: "",
    stock: "",
    description: "",
    defaultTaxRates: "",
    openingStock: ''
  });
  const [itemType, setItemType] = useState("");
  const [error, setError] = useState({});
  const [userId, setUserId] = useState(null);

  // Add unit options for dropdown
  const unitOptions = ["DOZEN", "BOX", "GRAMS", "KILOGRAMS", "METERS", "TABLETS", "UNITS", "PIECES", "PAIRS"];

  useEffect(() => {
    // Decode token to get userId
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      // Fetch existing item data for editing
      fetch(`http://localhost:8001/api/item/getitembyuserid/${id}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch item data");
          return response.json();
        })
        .then((data) => {
          setItemData({
            type: data[0].type || "",
            name: data[0].name || "",
            sku: data[0].sku || "",
            unit: data[0].unit || "",
            item: data[0].item || "",
            taxPreference: data[0].taxPreference || "",
            price: data[0].price || "",
            stock: data[0].stock || "",
            description: data[0].description || "",
            defaultTaxRates: data[0].defaultTaxRates || "",
          });
          setItemType(data[0].type || "");
        })
        .catch((error) => {
          console.error("Error fetching item data:", error);
          navigate("/user/items");
        });
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevItemData) => ({
      ...prevItemData,
      [name]: value,
    }));
    setError((prevError) => ({
      ...prevError,
      [name]: "",
    }));
  };

  const renderInput = (label, name, type) => (
    <div className="mb-4 space-y-1">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={itemData[name]}
        name={name}
        onChange={handleInputChange}
        className={`w-full rounded-md border ${error[name] ? "border-red-500" : ""
          } sm:text-sm p-2`}
      />
      {error[name] && (
        <p className="text-red-500 text-xs italic">{error[name]}</p>
      )}
    </div>
  );

  const handleRadioChange = (e) => {
    setItemType(e.target.value);
    setItemData((prevItemData) => ({
      ...prevItemData,
      type: e.target.value,
    }));
    setError((prevError) => ({
      ...prevError,
      type: "",
    }));
  };

  const validation = () => {
    const newErrors = {};
    if (!itemData.name.trim()) newErrors.name = "Please enter name";
    if (!itemData.sku.trim()) newErrors.sku = "Please enter SKU";
    if (!itemData.unit.trim()) newErrors.unit = "Please select unit";
    if (!itemData.item.trim()) newErrors.item = "Please enter item";
    if (!itemData.stock || isNaN(parseInt(itemData.stock, 10)))
      newErrors.stock = "Please enter valid stock";
    if (!itemData.description.trim())
      newErrors.description = "Please enter description";
    if (
      !itemData.defaultTaxRates ||
      isNaN(parseFloat(itemData.defaultTaxRates))
    ) {
      newErrors.defaultTaxRates = "Please enter valid default tax rate";
    }
    if (!itemData.taxPreference)
      newErrors.taxPreference = "Please select tax preference";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validation();
    setError(errors);

    if (Object.keys(errors).length === 0) {
      const payload = {
        ...itemData,
        type: itemType,
        stock: parseInt(itemData.stock, 10),
        openingStock: parseInt(itemData.stock, 10),
        price: parseFloat(itemData.price) || 0,
        defaultTaxRates: parseFloat(itemData.defaultTaxRates),
        userId,
      };

      console.log("Final payload before sending:", payload);

      try {
        const response = await fetch(
          id
            ? `http://localhost:8001/api/item/updateitem/${id}`
            : `http://localhost:8001/api/item/creatitem`,
          {
            method: id ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          console.log("Error Response Body:", text);
          throw new Error("Failed to submit form");
        }

        const responseData = await response.json();
        console.log("API Response:", responseData);

        // Success popup using SweetAlert
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: id ? "Item updated successfully!" : "Item added successfully!",
          confirmButtonText: "OK",
        });

        navigate("/user/items");
      } catch (error) {
        console.error("Error submitting form:", error);
        // Error popup using SweetAlert
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred while submitting the form. Please try again.",
          confirmButtonText: "Retry",
        });
      }
    } else {
      console.log("Validation Errors:", errors);
    }
  };


  return (
    <div className="w-full max-w-[20rem] sm:max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <div className="border-b pb-3 text-lg font-bold text-gray-800">
        <h3>{id ? "Edit Items" : "Add New Items"}</h3>
      </div>
      <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
        <div className="space-y-2 border-b pb-3 text-lg font-bold text-gray-800">
          <label className="block text-sm font-medium text-gray-700">
            Item Type
          </label>
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="Goods"
                name="type"
                value="Goods"
                checked={itemType === "Goods"}
                onChange={handleRadioChange}
              />
              <label
                htmlFor="Goods"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Goods
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="Service"
                name="type"
                value="Service"
                checked={itemType === "Service"}
                onChange={handleRadioChange}
              />
              <label
                htmlFor="Service"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Service
              </label>
            </div>
          </div>
          {error.type && (
            <p className="text-red-500 text-xs italic mt-1">{error.type}</p>
          )}
        </div>
        {renderInput("Name", "name", "text")}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 space-x-0 sm:space-x-2">
          {renderInput("SKU", "sku", "text")}
          {renderInput("Price", "price", "number")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 space-x-0 sm:space-x-2">
          {renderInput("Stock", "stock", "number")}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select
              name="unit"
              value={itemData.unit}
              onChange={handleInputChange}
              className="w-full rounded-md border sm:text-sm p-2"
            >
              <option value="">Select unit</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {error.unit && (
              <p className="text-red-500 text-xs italic">{error.unit}</p>
            )}
          </div>
          {renderInput("Item", "item", "text")}
        </div>
        {renderInput("Description", "description", "text")}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-x-0 sm:space-x-2">
          <div className="space-y-1">
            <label
              htmlFor="tax-preference"
              className="block text-sm font-medium text-gray-700"
            >
              Tax Preference
            </label>
            <div className="relative">
              <select
                id="tax-preference"
                name="taxPreference"
                value={itemData.taxPreference}
                onChange={handleInputChange}
                className="block w-full appearance-none rounded-md bg-[#F5F5F5] bg-white p-2 text-sm text-gray-700 border"
              >
                <option value="">Select tax preference</option>
                <option value="taxable">Taxable</option>
                <option value="non-taxable">Non-taxable</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <IoMdArrowDropdown />
              </div>
            </div>
          </div>
          {renderInput("Default Tax Rate (%)", "defaultTaxRates", "number")}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="sm:w-[30%] w-[50%] bg-[#397568] text-white rounded-md py-2 sm:px-1 px-1 flex items-center justify-center sm:text-lg text-base"
          >
            {id ? (
              <>
                <MdEditDocument className="mr-2" /> Update Items
              </>
            ) : (
              <>
                <IoPrintSharp className="mr-2" /> Save Items
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
