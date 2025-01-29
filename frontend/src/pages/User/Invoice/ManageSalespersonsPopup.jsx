import { Upload } from "lucide-react";
import React, { useState, useEffect } from "react";

const ManageSalespersonsPopup = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [salespersons, setSalespersons] = useState([]);
  const [file, setFile] = useState(null);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Fetch salespersons from the API when the component mounts
  useEffect(() => {
    const fetchSalespersons = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/salespersons/getallsalespersone");
        if (!response.ok) {
          throw new Error("Failed to fetch salespersons");
        }
        const data = await response.json();
        const filteredSalespersons = data.filter(salesperson => salesperson?.userId?._id == userId);
        setSalespersons(filteredSalespersons);
      } catch (error) {
        console.error("Error fetching salespersons:", error);
      }
    };

    fetchSalespersons();
  }, [salespersons, file]);

  const handleAddNew = () => {
    setIsAdding(true);
  };

  const handleSave = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;

    if (name && email) {
      const newSalesperson = {
        name,
        email,
        userId: userId,
      };

      try {
        const response = await fetch("http://localhost:8001/api/salespersons/creatsalespersone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSalesperson),
        });

        if (!response.ok) {
          throw new Error("Failed to add salesperson");
        }

        const savedSalesperson = await response.json();
        setSalespersons([...salespersons, savedSalesperson]);
        setName("");
        setEmail("");
        setIsAdding(false);
      } catch (error) {
        console.error("Error saving salesperson:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Upload CSV file
  const uploadCSV = async () => {
    if (!file) {
      Swal.fire("Please upload a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:8001/api/salespersons/salespersonecsv",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        Swal.fire("Success!", "CSV file uploaded successfully", "success");
        setFile(null);
      } else {
        Swal.fire("Error!", "Failed to upload CSV file", "error");
      }
    } catch (error) {
      console.error("Error uploading CSV file:", error);
      Swal.fire("Error!", "An error occurred during upload", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg w-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Manage Salespersons</h2>
        <button onClick={onClose} className="text-gray-500 ">
          ✖
        </button>
      </div>

      {/* Add Salesperson Form */}
      {isAdding && (
        <div className="p-4 border-b">
          <div className="mb-4">
            <label className="block text-sm font-medium">Name*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-1 "
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-1 "
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#438A7A] text-white rounded-lg  mr-2"
            >
              Save and Select
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Salespersons List */}
      <div>
        <div className="p-4">
          {!isAdding && (
            <div className="flex">
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-[#438A7A] text-white rounded-lg "
              >
                + New Salesperson
              </button>
              <div className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-4 py-2 ml-2">
                <label htmlFor="csv-file" className="">
                  Select CSV
                </label>
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  className="bg-[#438A7A] px-3 rounded mx-2"
                  onClick={uploadCSV}
                >
                  <Upload />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 max-h-64 overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b font-medium text-left">
                  Salesperson Name
                </th>
                <th className="px-4 py-2 border-b font-medium text-left">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {salespersons.map((person) => (
                <tr key={person.id}>
                  <td className="px-4 py-2 border-b">
                    {person.name}
                  </td>
                  <td className="px-4 py-2 border-b">{person.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageSalespersonsPopup;
