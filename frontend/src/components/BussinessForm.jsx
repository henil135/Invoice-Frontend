import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select"; // Import Select from react-select
import Swal from "sweetalert2";


export const BussinessForm = () => {
  const [bussnessformData, setbussnessFormData] = useState({
    companyName: "",
    companyAddress: "",
    email: "",
    number: "",
    companyCategory: "",
    prefix: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  // Fallback for formData if not found in state
  const formData = state?.formData || {}; // Use empty object if formData is not available

  // Fetch country data for select input
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);
  const currencyOptions = [
    { value: "AED", label: "د.إ - AED" },
    { value: "AFN", label: "؋ - AFN" },
    { value: "ALL", label: "L - ALL" },
    { value: "AMD", label: "֏ - AMD" },
    { value: "ANG", label: "ƒ - ANG" },
    { value: "AOA", label: "Kz - AOA" },
    { value: "ARS", label: "$ - ARS" },
    { value: "AUD", label: "$ - AUD" },
    { value: "AWG", label: "ƒ - AWG" },
    { value: "AZN", label: "₼ - AZN" },
    { value: "BAM", label: "KM - BAM" },
    { value: "BBD", label: "$ - BBD" },
    { value: "BDT", label: "৳ - BDT" },
    { value: "BGN", label: "лв - BGN" },
    { value: "BHD", label: ".د.ب - BHD" },
    { value: "BIF", label: "Fr - BIF" },
    { value: "BMD", label: "$ - BMD" },
    { value: "BND", label: "$ - BND" },
    { value: "BOB", label: "Bs - BOB" },
    { value: "BRL", label: "R$ - BRL" },
    { value: "BSD", label: "$ - BSD" },
    { value: "BTN", label: "Nu. - BTN" },
    { value: "BWP", label: "P - BWP" },
    { value: "BYN", label: "Br - BYN" },
    { value: "BZD", label: "$ - BZD" },
    { value: "CAD", label: "$ - CAD" },
    { value: "CDF", label: "Fr - CDF" },
    { value: "CHF", label: "Fr - CHF" },
    { value: "CLP", label: "$ - CLP" },
    { value: "CNY", label: "¥ - CNY" },
    { value: "COP", label: "$ - COP" },
    { value: "CRC", label: "₡ - CRC" },
    { value: "CUP", label: "$ - CUP" },
    { value: "CVE", label: "$ - CVE" },
    { value: "CZK", label: "Kč - CZK" },
    { value: "DJF", label: "Fdj - DJF" },
    { value: "DKK", label: "kr - DKK" },
    { value: "DOP", label: "RD$ - DOP" },
    { value: "DZD", label: "د.ج - DZD" },
    { value: "EGP", label: "ج.م - EGP" },
    { value: "ERN", label: "Nfk - ERN" },
    { value: "ETB", label: "Br - ETB" },
    { value: "EUR", label: "€ - EUR" },
    { value: "FJD", label: "$ - FJD" },
    { value: "FKP", label: "£ - FKP" },
    { value: "GBP", label: "£ - GBP" },
    { value: "GEL", label: "₾ - GEL" },
    { value: "GHS", label: "₵ - GHS" },
    { value: "GIP", label: "£ - GIP" },
    { value: "GMD", label: "D - GMD" },
    { value: "GNF", label: "Fr - GNF" },
    { value: "GTQ", label: "Q - GTQ" },
    { value: "GYD", label: "$ - GYD" },
    { value: "HKD", label: "$ - HKD" },
    { value: "HNL", label: "L - HNL" },
    { value: "HRK", label: "kn - HRK" },
    { value: "HTG", label: "G - HTG" },
    { value: "HUF", label: "Ft - HUF" },
    { value: "IDR", label: "Rp - IDR" },
    { value: "ILS", label: "₪ - ILS" },
    { value: "INR", label: "₹ - INR" },
    { value: "IQD", label: "ع.د - IQD" },
    { value: "IRR", label: "﷼ - IRR" },
    { value: "ISK", label: "kr - ISK" },
    { value: "JMD", label: "$ - JMD" },
    { value: "JOD", label: "د.ا - JOD" },
    { value: "JPY", label: "¥ - JPY" },
    { value: "KES", label: "KSh - KES" },
    { value: "KGS", label: "с - KGS" },
    { value: "KHR", label: "៛ - KHR" },
    { value: "KPW", label: "₩ - KPW" },
    { value: "KRW", label: "₩ - KRW" },
    { value: "KWD", label: "د.ك - KWD" },
    { value: "KYD", label: "$ - KYD" },
    { value: "KZT", label: "₸ - KZT" },
    { value: "LAK", label: "₭ - LAK" },
    { value: "LBP", label: "ل.ل - LBP" },
    { value: "LKR", label: "Rs - LKR" },
    { value: "LRD", label: "$ - LRD" },
    { value: "LSL", label: "L - LSL" },
    { value: "LYD", label: "ل.د - LYD" },
    { value: "MAD", label: "د.م. - MAD" },
    { value: "MDL", label: "L - MDL" },
    { value: "MGA", label: "Ar - MGA" },
    { value: "MKD", label: "ден - MKD" },
    { value: "MMK", label: "K - MMK" },
    { value: "MNT", label: "₮ - MNT" },
    { value: "MOP", label: "P - MOP" },
    { value: "MRU", label: "UM - MRU" },
    { value: "MUR", label: "Rs - MUR" },
    { value: "MVR", label: "Rf - MVR" },
    { value: "MWK", label: "MK - MWK" },
    { value: "MXN", label: "$ - MXN" },
    { value: "MYR", label: "RM - MYR" },
    { value: "MZN", label: "MT - MZN" },
    { value: "NAD", label: "$ - NAD" },
    { value: "NGN", label: "₦ - NGN" },
    { value: "NIO", label: "C$ - NIO" },
    { value: "NOK", label: "kr - NOK" },
    { value: "NPR", label: "Rs - NPR" },
    { value: "NZD", label: "$ - NZD" },
    { value: "OMR", label: "ر.ع. - OMR" },
    { value: "PAB", label: "B/. - PAB" },
    { value: "PEN", label: "S/. - PEN" },
    { value: "PGK", label: "K - PGK" },
    { value: "PHP", label: "₱ - PHP" },
    { value: "PKR", label: "Rs - PKR" },
    { value: "PLN", label: "zł - PLN" },
    { value: "PYG", label: "₲ - PYG" },
    { value: "QAR", label: "ر.ق - QAR" },
    { value: "RON", label: "lei - RON" },
    { value: "RSD", label: "дин - RSD" },
    { value: "RUB", label: "₽ - RUB" },
    { value: "RWF", label: "Fr - RWF" },
    { value: "SAR", label: "ر.س - SAR" },
    { value: "SBD", label: "$ - SBD" },
    { value: "SCR", label: "₨ - SCR" },
    { value: "SDG", label: "ج.س - SDG" },
    { value: "SEK", label: "kr - SEK" },
    { value: "SGD", label: "$ - SGD" },
    { value: "SHP", label: "£ - SHP" },
    { value: "SLL", label: "Le - SLL" },
    { value: "SOS", label: "S - SOS" },
    { value: "SRD", label: "$ - SRD" },
    { value: "SSP", label: "£ - SSP" },
    { value: "STN", label: "Db - STN" },
    { value: "SVC", label: "$ - SVC" },
    { value: "SZL", label: "E - SZL" },
    { value: "THB", label: "฿ - THB" },
    { value: "TJS", label: "ЅМ - TJS" },
    { value: "TMT", label: "m - TMT" },
    { value: "TND", label: "د.ت - TND" },
    { value: "TOP", label: "T$ - TOP" },
    { value: "TRY", label: "₺ - TRY" },
    { value: "TTD", label: "$ - TTD" },
    { value: "TWD", label: "$ - TWD" },
    { value: "TZS", label: "TSh - TZS" },
    { value: "UAH", label: "₴ - UAH" },
    { value: "UGX", label: "USh - UGX" },
    { value: "USD", label: "$ - USD" },
    { value: "UYU", label: "$ - UYU" },
    { value: "UZS", label: "лв - UZS" },
    { value: "VES", label: "Bs.S - VES" },
    { value: "VND", label: "₫ - VND" },
    { value: "VUV", label: "Vt - VUV" },
    { value: "WST", label: "T - WST" },
    { value: "XAF", label: "Fr - XAF" },
    { value: "XCD", label: "$ - XCD" },
    { value: "XOF", label: "Fr - XOF" },
    { value: "XPF", label: "Fr - XPF" },
    { value: "YER", label: "ر.ي - YER" },
    { value: "ZAR", label: "R - ZAR" },
    { value: "ZMW", label: "ZK - ZMW" },
    { value: "ZWL", label: "Z$ - ZWL" },
  ];

  const handleChange = (event) => {
    const { id, value } = event.target;
    setbussnessFormData({
      ...bussnessformData,
      [id]: value,
    });
  };

  const handlePrefixChange = (selectedOption) => {
    setbussnessFormData({
      ...bussnessformData,
      prefix: selectedOption.value,
    });
  };

  const categoryOptions = [
    { value: "construction", label: "Construction,Trades and Home Services" },
    { value: "Professionals", label: "Creative Professionals" },
    { value: "marketing", label: "Marketing,Communications & Media" },
    { value: "IT", label: "Development & Programming" },
    { value: "consulting", label: "Management Consulting" },
    { value: "finance", label: "Accounting and Finance" },
    { value: "transport", label: "Automotive and Transport" },
    { value: "Health", label: "Health and wellness" },
    { value: "Food", label: "Food Services" },
    { value: "Other", label: "Other..." },
  ];

  const handleCategoryChange = (selectedOption) => {
    setbussnessFormData({
      ...bussnessformData,
      companyCategory: selectedOption ? selectedOption.value : "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!bussnessformData.companyName)
      newErrors.companyName = "Company Name is required";
    if (!bussnessformData.companyAddress)
      newErrors.companyAddress = "Company Address is required";
    if (!bussnessformData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(bussnessformData.email))
      newErrors.email = "Email is invalid";
    if (!bussnessformData.number) newErrors.number = "Phone Number is required";
    else if (!/^\+?[1-9]\d{1,14}$/.test(bussnessformData.number))
      newErrors.number = "Phone Number is invalid";
    if (!bussnessformData.companyCategory)
      newErrors.companyCategory = "Company Category is required";
    if (!bussnessformData.prefix) newErrors.prefix = "Prefix is required";

    return newErrors;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      try {
        // Step 1: Submit Business API
        const businessResponse = await fetch(
          "http://localhost:8001/api/business/registerBusiness",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              companyName: bussnessformData.companyName,
              companyAddress: bussnessformData.companyAddress,
              email: bussnessformData.email,
              number: bussnessformData.number,
              companyCategory: bussnessformData.companyCategory,
              prefix: bussnessformData.prefix,
            }),
          }
        );

        if (!businessResponse.ok) {
          throw new Error("Failed to submit business information");
        }

        const businessData = await businessResponse.json();
        const businessId = businessData.data._id;

        // Step 2: Submit User Registration API
        const registerResponse = await fetch(
          "http://localhost:8001/api/user/registerUser",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              BusinessId: businessId,
              Name: formData.Name,
              email: formData.email,
              phoneNumber: formData.phone,
              age: formData.age,
              country: formData.country,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              Category: formData.category,
              password: formData.password,
            }),
          }
        );

        if (!registerResponse.ok) {
          throw new Error("Failed to register user information");
        }

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Business and User registration completed successfully!",
          confirmButtonText: "OK",
        }).then(() => navigate("/")); // Navigate after confirmation
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "An error occurred while submitting the form.",
        });
      } finally {
        setLoading(false);
      }
    } 
  };

  return (
    <div className="min-h-screen flex ">
    <div className="flex flex-col md:flex-row w-full max-w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Form Section */}
      <div className="w-full md:w-1/2 h-full p-6 md:p-10 flex flex-col justify-center items-center relative">
        {/* Logo in the top-left corner */}
        <img
          src="/img/logo.png"
          alt="Logo"
          className="absolute top-6 left-6 h-12 sm:h-14"
        />
  
        <div className="md:w-[60%] w-full mt-20 md:mt-0 bg-white shadow-lg p-6 rounded-lg">
          <h1 className="mb-6 text-3xl sm:text-4xl font-extrabold text-center text-bgprimary">
            Business Information
          </h1>
          <form>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dynamic Input Fields */}
              {[
                { id: "companyName", label: "Company Name" },
                { id: "companyAddress", label: "Company Address" },
                { id: "email", label: "Email", type: "email" },
                { id: "number", label: "Phone Number" },
              ].map(({ id, label, type = "text" }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-gray-700 font-bold mb-2"
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={id}
                    value={bussnessformData[id]}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-grey rounded-md focus:outline-none ${
                      errors[id]
                        ? "border-red-500"
                        : "focus:ring-2 focus:ring-bgprimary"
                    }`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                  {errors[id] && (
                    <p className="text-red-500 text-sm">{errors[id]}</p>
                  )}
                </div>
              ))}
  
              {/* Dropdown for Company Category */}
              <div>
                <label
                  htmlFor="companyCategory"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Company Category
                </label>
                <Select
                  options={categoryOptions}
                  onChange={handleCategoryChange}
                  value={categoryOptions.find(
                    (option) =>
                      option.value === bussnessformData.companyCategory
                  )}
                  isClearable
                />
                {errors.companyCategory && (
                  <p className="text-red-500 text-sm">
                    {errors.companyCategory}
                  </p>
                )}
              </div>
  
              {/* Currency Prefix Dropdown */}
              <div>
                <label
                  htmlFor="prefix"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Prefix
                </label>
                <Select
                  options={currencyOptions}
                  onChange={handlePrefixChange}
                  placeholder="Select a currency prefix"
                  className={`${errors.prefix ? "border-red-500" : ""}`}
                />
                {errors.prefix && (
                  <p className="text-red-500 text-sm">{errors.prefix}</p>
                )}
              </div>
            </div>
  
            {/* Submit Button */}
            <div className="my-3 text-center w-full">
              {successMessage && (
                <p className="text-green-500 mb-4">{successMessage}</p>
              )}
              <button
                onClick={handleSubmit}
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 text-sm font-semibold text-white bg-bgprimary rounded-lg hover:bg-black focus:ring-2 focus:ring-bgprimary focus:outline-none"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      {/* Image Section */}
      <div className="bg-[#438A7A] hidden md:flex md:w-1/2 h-full mx-auto p-10 relative">
        {/* Image Container with full coverage */}
        <div className="absolute inset-0 z-10">
          <div className="bg-[#356759] h-full opacity-40 relative">
            <img
              src="/img/img.jpg" // Replace with your image path
              alt="Login Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
  
        {/* Content (text, quote, etc.) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 text-center text-white p-6">
          <blockquote className="text-lg italic">
            "I feel confident imposing on myself"
          </blockquote>
          <p className="text-sm mt-4">
            Vestibulum auctor orci sit amet risus iaculis consequat. Sed tempus
            in elementum augue.
          </p>
        </div>
      </div>
    </div>
  </div>
  

  );
};