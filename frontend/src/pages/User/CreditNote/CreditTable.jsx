import React, { useState, useEffect } from "react";
import { FaBars, FaEye } from "react-icons/fa";
import { MdDelete, MdAdd } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Upload } from "lucide-react";

const CreditTable = () => {
  const [credits, setCredits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Fetch data from the API
  useEffect(() => {
    axios
      .get("http://localhost:8001/api/creditNotes/viewall", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.notes)) {
          const userCredits = response.data.notes.filter(
            (credit) => credit.userId === userId
          );
          setCredits(userCredits);
        } else {
          console.error(
            "API response does not contain notes array:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching credit notes:", error);
      });
  }, [token, userId, file]);

  const deleteCredit = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:8001/api/creditNotes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedCredits = credits.filter((credit) => credit._id !== id);
        setCredits(updatedCredits);

        await Swal.fire(
          "Deleted!",
          "The credit note has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting credit note:", error);
        await Swal.fire(
          "Error!",
          "There was an issue deleting the credit note.",
          "error"
        );
      }
    }
  };

  const filteredCredits = credits.filter(
    (credit) =>
      (credit.invoiceDetails?.customerName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (credit.creditNoteID?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (credit.invoiceDetails?.invoiceNumber?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

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
        "http://localhost:8001/api/creditNotes/creditnotes/import",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const goToCreditForm = () => {
    navigate("/user/credits/credit-form");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Credit Notes Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [
        ["Invoice Date", "Credit Note#", "Customer Name", "Invoice#", "Amount"],
      ],
      body: filteredCredits.map((credit) => [
        new Date(credit.invoiceDetails.invoiceDate).toLocaleDateString(),
        credit.creditNoteID,
        credit.invoiceDetails.customerName,
        credit.invoiceDetails.invoiceNumber,
        credit.invoiceDetails.total.toFixed(2),
      ]),
    });
    doc.save("Credit_Notes_Report.pdf");
  };

  // Generate CSV
  const generateCSV = () => {
    const headers = "Invoice Date,Credit Note#,Customer Name,Invoice#,Amount";
    const rows = filteredCredits.map(
      (credit) =>
        `${new Date(credit.invoiceDetails.invoiceDate).toLocaleDateString()},${credit.creditNoteID
        },${credit.invoiceDetails.customerName},${credit.invoiceDetails.invoiceNumber
        },${credit.invoiceDetails.total.toFixed(2)}`
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Credit_Notes_Report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  
  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="bg-[#F6F8FB] p-3">
      <div className="bg-white rounded-lg md:p-2 shadow-lg">
        <div className="top flex md:flex-row flex-col justify-between md:items-center p-2 pb-5">
          <div className="heading font-bold text-[26px] new-lg:text-xl new-xl:text-[26px]">
            <h3>All Credits</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 w-80 hidden md:flex">
              <div className="text-xl text-gray-700">
                <CiSearch />
              </div>
              <input
                type="text"
                placeholder="Search credit"
                className="bg-transparent pl-2 text-lg new-lg:text-base new-xl:text-lg outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-4 py-2 ml-2"
              onClick={goToCreditForm}
            >
              <div className="text-white rounded text-xl mr-2">
                <MdAdd />
              </div>
              <div className="font-semibold text-base new-lg:text-base new-xl:text-lg">
                <h3>New</h3>
              </div>
            </button>
            <div className="btn flex items-center bg-[#438A7A] text-white rounded-lg md:px-4 px-1 py-2 ml-2">
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
                className="bg-[#438A7A] md:px-3 rounded md:mx-2 mx-1"
                onClick={uploadCSV}
              >
                <Upload />
              </button>
            </div>
            <div className="relative">
              {/* FaBars Button */}
              <button
                onClick={toggleDropdown} // Toggle dropdown
                className="btn bg-[#438A7A] text-white rounded-lg px-4 py-3"
              >
                <FaBars />
              </button>
              {/* Dropdown */}
              {dropdownOpen && ( // Conditionally render dropdown
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md z-50">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={generatePDF}
                  >
                    PDF
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={generateCSV}
                  >
                    CSV
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handlePrint}
                  >
                    PRINT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="h-[100%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <table className="min-w-full table-layout table-auto">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold rounded-tl-xl">
                  Invoice Date
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Credit Note#
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Customer Name
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Invoice#
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Amount
                </th>
                <th className="p-3 text-[#030229] text-center font-semibold rounded-tr-xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCredits.map((credit) => (
                <tr key={credit._id} className="border-t text-center">
                  <td className="flex items-center p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold">
                      <h3>
                        {new Date(
                          credit.invoiceDetails.invoiceDate
                        ).toLocaleDateString()}
                      </h3>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{credit.creditNoteID}</h3>
                    </div>
                  </td>
                  <td className="time p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{credit.invoiceDetails.invoiceNumber}</h3>
                    </div>
                  </td>
                  <td className="time p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{credit.invoiceDetails.invoiceNumber}</h3>
                    </div>
                  </td>
                  <td className="p-2 text-sm sm:text-base font-semibold">
                    <h3 className="bg-gray-100 text-[#718EBF] rounded-full py-1 px-1 w-[70%] text-center">
                      {credit.invoiceDetails.total.toFixed(2)}
                    </h3>
                  </td>
                  <td className="flex items-center justify-center py-2 px-2">
                    <div
                      className="w-8 h-8 text-[#0EABEB] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm mx-2"
                      onClick={() => navigate(`/user/credits/view/${credit._id}`)}
                    >
                      <FaEye />
                    </div>
                    <div
                      className="w-8 h-8 text-[#E11D29] bg-[#f6f8fb] rounded-md flex items-center justify-center text-lg"
                      onClick={() => deleteCredit(credit._id)}
                    >
                      <MdDelete />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreditTable;
