import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const BusinessInformationForm = () => {
  const [formData, setFormData] = useState({});
  const [customFields, setCustomFields] = useState([
    { id: "companyName", label: "Company Name", required: true },
    { id: "companyAddress", label: "Company Address", required: true },
    { id: "email", label: "Email", required: true },
    { id: "number", label: "Phone Number", required: true },
    {
      id: "companyCategory",
      label: "Company Category",
      required: false,
      options: [
        "construction",
        "Professionals",
        "marketing",
        "IT",
        "consulting",
        "finance",
        "transport",
        "healthcare",
        "food",
      ],
    },
    {
      id: "prefix",
      label: "Prefix",
      required: false,
      options: ["USD", "EUR", "INR", "GBP", "AUD", "CAD", "JPY", "CNY"], 
    },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?.businessId;

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8001/api/business/getBusinessByID/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error("Failed to fetch business information");
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message ||
            "An error occurred while fetching business information.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [userId, token]);

  const validateForm = () => {
    const newErrors = {};
    customFields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
      if (
        field.id === "email" &&
        formData[field.id] &&
        !/\S+@\S+\.\S+/.test(formData[field.id])
      ) {
        newErrors.email = "Email is invalid";
      }
    });
    return newErrors;
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSaveClick = async () => {
    setLoading(true);
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8001/api/business/updateBusiness/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok)
        throw new Error("Failed to update business information");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Business information updated successfully!",
      });
      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message ||
          "An error occurred while updating business information.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setErrors({});
  };

  if (loading && !isEditing) {
    return <div>Loading business information...</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Business Information</h1>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-[#438A7A] text-white rounded-lg"
          >
            Edit
          </button>
        )}
      </div>

      {!isEditing ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customFields.map((field) => (
              <div key={field.id}>
                <h2 className="text-sm font-semibold text-gray-500">
                  {field.label}
                </h2>
                <p className="text-lg text-gray-700 border rounded-lg p-2">
                  {formData[field.id] || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {customFields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              {field.options ? (
                <select
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg 
                     ${errors[field.id] ? "border-red-500" : ""}`}
                >
                  {field.id === "prefix"
                    ? field.options.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))
                    : field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                </select>
              ) : (
                <input
                  type="text"
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors[field.id] ? "border-red-500" : ""
                  }`}
                />
              )}
              {errors[field.id] && (
                <p className="text-red-500 text-sm">{errors[field.id]}</p>
              )}
            </div>
          ))}
          <div className="col-span-2 flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleSaveClick}
              className="px-4 py-2 bg-[#438A7A] text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BusinessInformationForm;


