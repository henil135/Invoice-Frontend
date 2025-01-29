import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import Swal from "sweetalert2";

export const ProfileDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const fieldMappings = [
    { key: "Name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "age", label: "Age" },
    { key: "country", label: "Country" },
    { key: "state", label: "State" },
    { key: "city", label: "City" },
    { key: "address", label: "Address" },
    { key: "zipCode", label: "Zip Code" },
  ];

  const categories = [
    "freelancers",
    "consultants",
    "contractors",
    "smallBusinessOwner",
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8001/api/user/getuserbyid/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData(data); // Update the profileData state
        setFormData(data);    // Initialize formData with fetched data
      } catch (error) {
        Swal.fire("Error", error.message || "Error fetching profile data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId, token]);
  

  const handleEditClick = () => {
    setIsEditing(true);
    if (formData?.country) {
      const selectedStates = State.getStatesOfCountry(formData.country);
      setStates(selectedStates);
      if (formData?.state) {
        const selectedCities = City.getCitiesOfState(formData.country, formData.state);
        setCities(selectedCities);
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(profileData); // Reset formData to the original profile data
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8001/api/user/updateuser/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setProfileData(updatedData);
      setIsEditing(false);
      Swal.fire("Success", "Profile updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", error.message || "Error updating profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "country") {
      const selectedStates = State.getStatesOfCountry(value);
      setStates(selectedStates);
      setCities([]);
      setFormData((prevData) => ({
        ...prevData,
        state: "",
        city: "",
      }));
    }

    if (name === "state") {
      const selectedCities = City.getCitiesOfState(formData.country, value);
      setCities(selectedCities);
      setFormData((prevData) => ({
        ...prevData,
        city: "",
      }));
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile Dashboard</h1>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-[#438A7A] text-white rounded-lg"
          >
            Edit
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 text-red-500 font-semibold">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="mb-4 text-green-500 font-semibold">
          {successMessage}
        </div>
      )}

      {!isEditing ? (
        <div>
          {/* Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fieldMappings.map(({ key, label }) => (
              <div key={key}>
                <h2 className="text-sm font-semibold text-gray-500">{label}</h2>
                <p className="text-lg text-gray-700 border rounded-lg p-2">
                  {formData?.[key] || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Edit Form */}
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fieldMappings
              .filter(({ key }) => !["country", "state", "city"].includes(key))
              .map(({ key, label }) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    readOnly={key === "email"}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Country</option>
                {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <select
                id="state"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                disabled={!states.length}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <select
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                disabled={!cities.length}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

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
        </div>
      )}
    </div>
  );
};