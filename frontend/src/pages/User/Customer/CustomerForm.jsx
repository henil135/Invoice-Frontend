import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { Country, State, City } from "country-state-city";
const CustomerForm = () => {
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    mobileNumber: "",
    currency: "",
    otherDetails: [
      {
        paymentTerms: "",
        remarks: "",
      },
    ],
    addresses: [
      {
        billingAddress: {
          attention: "",
          country: "",
          address: "",
          city: "",
          state: "",
          pinCode: "",
          phone: "",
        },
        shippingAddress: {
          attention: "",
          country: "",
          address: "",
          city: "",
          state: "",
          pinCode: "",
          phone: "",
        },
      },
    ],
  });
  const currencyOptions = ["USD", "EUR", "INR", "GBP", "AUD"];
  const paymentTermsOptions = [
    "Net 30",
    "Net 60",
    "Cash on Delivery",
    "Prepaid",
  ];
  const [customerType, setCustomerType] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [billingStates, setBillingStates] = useState([]);
  const [billingCities, setBillingCities] = useState([]);
  const [shippingStates, setShippingStates] = useState([]);
  const [shippingCities, setShippingCities] = useState([]);
  const handleDropdownChange = (value, addressType, key) => {
    setCustomerData((prevData) => {
      const updatedAddresses = prevData.addresses.map((address, index) => {
        if (index === 0) {
          const updatedAddress = { ...address };
          updatedAddress[addressType][key] = value;
          return updatedAddress;
        }
        return address;
      });
      return { ...prevData, addresses: updatedAddresses };
    });

    if (key === "countryRegion") {
      const states =
        addressType === "billingAddress"
          ? State.getStatesOfCountry(value)
          : State.getStatesOfCountry(value);

      if (addressType === "billingAddress") {
        setBillingStates(states);
        setBillingCities([]);
      } else {
        setShippingStates(states);
        setShippingCities([]);
      }
    } else if (key === "state") {
      const cities =
        addressType === "billingAddress"
          ? City.getCitiesOfState(
              customerData.addresses[0][addressType].countryRegion,
              value
            )
          : City.getCitiesOfState(
              customerData.addresses[0][addressType].countryRegion,
              value
            );

      if (addressType === "billingAddress") {
        setBillingCities(cities);
      } else {
        setShippingCities(cities);
      }
    }
  };

  const renderDropdown = (label, addressType, key, options) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold pb-1">{label}</label>
      <select
        value={customerData.addresses[0][addressType][key] || ""}
        onChange={(e) => handleDropdownChange(e.target.value, addressType, key)}
        className="w-full p-2 border rounded"
      >
        {options.map((option) => (
          <option key={option.isoCode} value={option.isoCode}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );

  // Decode user ID from JWT token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.id || decoded.userId;
      } catch (err) {
        console.error("Error decoding token:", err.message);
      }
    }
    return null;
  };

  // Fetch customer data if editing
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (id) {
        try {
          const response = await fetch(
            `http://localhost:8001/api/customer/viewCustomers/?id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch customer data");
          }

          const data = await response.json();

          const filteredData = data.find((customer) => customer._id === id);
          console.log(filteredData);
          if (filteredData) {
            setCustomerData(filteredData);
            setCustomerType(filteredData.customerType || "");
          } else {
            console.error("No customer found with the provided ID");
          }
        } catch (error) {
          console.error("Error fetching customer data:", error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleNestedInputChange = (e, parentKey, index, subKey = null) => {
    const { name, value } = e.target;

    setCustomerData((prevData) => ({
      ...prevData,
      [parentKey]: prevData[parentKey].map((item, idx) =>
        idx === index
          ? subKey
            ? { ...item, [subKey]: { ...item[subKey], [name]: value } }
            : { ...item, [name]: value }
          : item
      ),
    }));
  };

  const handleRadioChange = (e) => {
    setCustomerType(e.target.value);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!customerType) newErrors.customerType = "Customer Type is required";
    if (!customerData.firstName) newErrors.firstName = "First Name is required";
    if (!customerData.companyName)
      newErrors.companyName = "Company Name is required";
    if (!customerData.email || !/\S+@\S+\.\S+/.test(customerData.email))
      newErrors.email = "Valid email is required";
    if (!customerData.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required";
    if (!customerData.currency) newErrors.currency = "Currency is required";

    if (Array.isArray(customerData.addresses)) {
      customerData.addresses.forEach((address, index) => {
        const billing = address.billingAddress;
        const shipping = address.shippingAddress;

        if (
          !billing.city ||
          !billing.state ||
          !billing.pinCode ||
          !billing.address
        ) {
          newErrors[`addresses[${index}].billingAddress`] =
            "All Billing Address fields are required";
        }

        if (
          !shipping.city ||
          !shipping.state ||
          !shipping.pinCode ||
          !shipping.address
        ) {
          newErrors[`addresses[${index}].shippingAddress`] =
            "All Shipping Address fields are required";
        }
      });
    } else {
      console.error("addresses is not an array or is undefined");
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          Swal.fire({
            icon: "error",
            title: "Authentication Error",
            text: "Invalid user authentication. Please log in again.",
          });
          navigate("/login");
          return;
        }

        const customerPayload = {
          ...customerData,
          customerType,
          userId,
          addresses: customerData.addresses.map((address) => ({
            billingAddress: {
              ...address.billingAddress,
              countryRegion: address.billingAddress.countryRegion,
            },
            shippingAddress: {
              ...address.shippingAddress,
              countryRegion: address.shippingAddress.countryRegion,
            },
          })),
        };

        const apiUrl = id
          ? `http://localhost:8001/api/customer/updateCustomer?id=${id}`
          : "http://localhost:8001/api/customer/createCustomer";

        const method = id ? "PUT" : "POST";

        const response = await fetch(apiUrl, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include Authorization header
          },
          body: JSON.stringify(customerPayload),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: id
              ? "Customer Updated Successfully!"
              : "Customer Added Successfully!",
            text: result.message || "Operation completed successfully.",
          }).then(() => {
            navigate("/user/customers");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.message || "Error saving customer.",
          });
        }
      } catch (error) {
        console.error("Error submitting customer:", error.message);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "An error occurred. Please try again.",
        });
      }
    }
  };

  // Updated Dropdown in Render
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {renderDropdown(
      "Billing Country",
      "billingAddress",
      "countryRegion",
      Country.getAllCountries()
    )}
    {renderDropdown(
      "Shipping Country",
      "shippingAddress",
      "countryRegion",
      Country.getAllCountries()
    )}
  </div>;

  const renderInputField = (
    label,
    name,
    type = "text",
    parentKey = null,
    index = null,
    subKey = null,
    options = [] // options for dropdown
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold pb-1">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={
            index !== null && parentKey
              ? customerData[parentKey]?.[index]?.[subKey]?.[name] || ""
              : customerData[name] || ""
          }
          onChange={(e) =>
            index !== null
              ? handleNestedInputChange(e, parentKey, index, subKey)
              : handleInputChange(e)
          }
          className={`w-full p-2 border rounded ${
            errors[name] ? "border-red-500" : ""
          }`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={
            index !== null && parentKey
              ? customerData[parentKey]?.[index]?.[subKey]?.[name] || ""
              : customerData[name] || ""
          }
          onChange={(e) =>
            index !== null
              ? handleNestedInputChange(e, parentKey, index, subKey)
              : handleInputChange(e)
          }
          className={`w-full p-2 border rounded ${
            errors[name] ? "border-red-500" : ""
          }`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="p-4">
      <div className="max-w-full p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">
          {id ? "Edit Customer" : "Add New Customer"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Customer Type Section */}
          <div className="mb-3 p-4 rounded-lg border">
            <label className="block text-lg font-medium mb-4">
              Customer Type
            </label>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              <label className="flex items-center gap-2 text-lg">
                <input
                  type="radio"
                  value="business"
                  checked={customerType === "business"}
                  onChange={handleRadioChange}
                  className="w-5 h-5"
                />
                Business
              </label>
              <label className="flex items-center gap-2 text-lg">
                <input
                  type="radio"
                  value="individual"
                  checked={customerType === "individual"}
                  onChange={handleRadioChange}
                  className="w-5 h-5"
                />
                Individual
              </label>
            </div>
            {errors.customerType && (
              <p className="text-red-500 text-sm">{errors.customerType}</p>
            )}
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border p-4 rounded-lg">
            {renderInputField("First Name", "firstName")}
            {renderInputField("Last Name", "lastName")}
            {renderInputField("Company Name", "companyName")}
            {renderInputField("Display Name", "displayName")}
            {renderInputField("Email", "email", "email")}
            {renderInputField("Phone Number", "phoneNumber")}
            {renderInputField("Mobile Number", "mobileNumber")}
            {renderInputField(
              "Currency",
              "currency",
              "select",
              null,
              null,
              null,
              currencyOptions
            )}
          </div>

          {/* Addresses */}
          <div className="mt-4 border rounded-lg p-4">
            {/* <h3 className="text-lg font-medium mb-4">Addresses</h3> */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {renderInputField(
                "Billing Attention",
                "attention",
                "text",
                "addresses",
                0,
                "billingAddress"
              )}

              {renderInputField(
                "Billing Address",
                "address",
                "text",
                "addresses",
                0,
                "billingAddress"
              )}
              {renderInputField(
                "Billing PinCode",
                "pinCode",
                "text",
                "addresses",
                0,
                "billingAddress"
              )}
              {renderDropdown(
                "Billing Country",
                "billingAddress",
                "countryRegion",
                Country.getAllCountries()
              )}
              {renderDropdown(
                "Billing State",
                "billingAddress",
                "state",
                billingStates
              )}
              {renderDropdown(
                "Billing City",
                "billingAddress",
                "city",
                billingCities
              )}
              {renderInputField(
                "Shipping Attention",
                "attention",
                "text",
                "addresses",
                0,
                "shippingAddress"
              )}
              {renderInputField(
                "Shipping Address",
                "address",
                "text",
                "addresses",
                0,
                "shippingAddress"
              )}
              {renderInputField(
                "Shipping PinCode",
                "pinCode",
                "text",
                "addresses",
                0,
                "shippingAddress"
              )}
              {renderDropdown(
                "Shipping Country",
                "shippingAddress",
                "countryRegion",
                Country.getAllCountries()
              )}
              {renderDropdown(
                "Shipping State",
                "shippingAddress",
                "state",
                shippingStates
              )}
              {renderDropdown(
                "Shipping City",
                "shippingAddress",
                "city",
                shippingCities
              )}
            </div>
          </div>

          {/* Other Details */}
          <div className="mt-3 border rounded-lg p-4">
            {/* <h3 className="text-lg font-medium mb-4">Other Details</h3> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderInputField(
                "Payment Terms",
                "paymentTerms",
                "select",
                "otherDetails",
                0,
                null,
                paymentTermsOptions
              )}
              {renderInputField(
                "Remarks",
                "remarks",
                "text",
                "otherDetails",
                0
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="bg-gray-300 text-black rounded-lg px-4 py-2"
              onClick={() => navigate("/user/customers")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#438A7A] text-white rounded-lg px-4 py-2"
            >
              {id ? "Update Customer" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
