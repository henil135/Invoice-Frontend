import React, { useEffect, useState } from "react";
import { FaBars, FaEdit, FaEye } from "react-icons/fa";
import { MdAdd, MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Upload } from "lucide-react";

export const PurchaseInvoice = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token not found");
          return;
        }

        const response = await fetch(
          `http://localhost:8001/api/purchaseInvoice/getallpurchaseinvoice`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch invoices");
        const datares = await response.json();
        const data = datares.purchaseinvoices.map((invoice) => ({
          ...invoice,
          date: formatDate(invoice.createdAt), // Format createdAt
        }));
        const filteredInvoices = data.filter(
          (invoice) => invoice.userId === userId
        );
        setInvoiceData(filteredInvoices);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices");
      }
    };

    fetchInvoices();
  }, [userId, file]);

  const filteredItems = invoiceData?.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    const invoiceNumber = item.invoiceNumber?.toLowerCase();
    const productName = item.productName?.toLowerCase();
    const price = item.price?.toString() || "";
    return (
      invoiceNumber?.includes(searchString) ||
      productName?.includes(searchString) ||
      price?.includes(searchString)
    );
  });
  const handlePrint = () => {
    window.print();
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
        "http://localhost:8001/api/purchaseInvoice/purchaseinvoices/import",
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

  const editInvoice = (id) => {
    navigate(`/user/purchaseForm/${id}`);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:8001/api/purchaseInvoice/deletepurchaseinvoice/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to delete invoice");
          const updatedInvoices = invoiceData.filter((item) => item._id !== id);
          setInvoiceData(updatedInvoices);
          Swal.fire("Deleted!", "Your invoice has been deleted.", "success");
        } catch (err) {
          console.error("Error deleting invoice:", err);
          setError("Failed to delete invoice");
          Swal.fire(
            "Error!",
            "Something went wrong while deleting the invoice.",
            "error"
          );
        }
      }
    });
  };

  const handleAddInvoice = () => {
    navigate("/user/purchaseForm");
  };
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Purchase Invoice Report", 14, 10);
    
    doc.autoTable({
      startY: 20,
      head: [
        ["Invoice Number", "Date", "Item Name", "Quantity", "Unit", "Price", "Total"],
      ],
      body: filteredItems.map((item) => {
        const itemName = item.itemID ? item.itemID.name : 'N/A';  // Handle missing item names
        return [
          item.invoiceNumber || "N/A",
          item.date || "N/A",  // Ensure date is formatted
          itemName,
          item.quantity || 0,
          item.unit || "N/A",
          item.price || 0,
          item.total || 0
        ];
      }),
    });
    
    doc.save("Purchase_Invoice_Report.pdf");
  };
  
  const generateCSV = () => {
    const headers = "Invoice Number,Date,Item Name,Quantity,Unit,Price,Total";
    const rows = filteredItems.map((item) => {
      const dateFormatted = item.date || 'N/A';  // Ensure date is not undefined or null
      const itemName = item.itemID ? item.itemID.name : 'N/A';  // Fallback for missing item names
      return `${item.invoiceNumber},${dateFormatted},${itemName},${item.quantity},${item.unit},${item.price},${item.total}`;
    });
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Purchase_Invoice_Report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  
  return (
    <div className="bg-[#F6F8FB] p-3 h-[97%]">
      {error && <p className="text-red-500">{error}</p>}
      <div className="bg-white rounded-lg p-2 shadow-lg">
        <div className="top flex flex-col md:flex-row justify-between md:items-center p-2 pb-5">
          <div className="heading font-bold text-xl sm:text-2xl lg:text-xl xl:text-2xl">
            <h3>Purchase Invoices</h3>
          </div>
          <div className="flex  md:items-center space-y-2 sm:space-y-0 space-x-1">
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 w-80 hidden sm:flex">
              <div className="text-xl text-gray-700">
                <CiSearch />
              </div>
              <input
                type="text"
                placeholder="Search Invoices"
                className="bg-transparent pl-2 text-lg outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddInvoice}
              className="btn flex items-center bg-[#438A7A] text-white rounded-lg md:px-4 px-1 py-2 text-sm sm:text-base lg:text-lg"
            >
              <div className="text-white text-lg mr-2">
                <MdAdd />
              </div>
              <h3>Add Invoice</h3>
            </button>
            <div className="btn flex items-center bg-[#438A7A] text-white rounded-lg md:px-4 px-1 py-2.5 md:ml-2">
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
                className="bg-[#438A7A] px-3 rounded md:mx-2"
                onClick={uploadCSV}
              >
                <Upload />
              </button>
            </div>
            <div className="relative">
              {/* FaBars Button */}
              <button
                onClick={toggleDropdown} // Toggle dropdown
                className="btn bg-[#438A7A] text-white rounded-lg px-3 py-3"
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
          className="h-[100%] overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 z-10"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <table className="min-w-full table-layout">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Date
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base rounded-tl-xl">
                  Invoice Number
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Item Name
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Quantity
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Unit
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Price
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Total
                </th>
                <th className="p-3 text-[#030229] font-semibold text-sm sm:text-base rounded-tr-xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems?.map((item) => (
                <tr className="border-t text-left" key={item._id}>
                  <td className="p-3 text-sm sm:text-base font-semibold">
                    {item.date || "N/A"}
                  </td>
                  <td className="p-3 text-sm sm:text-base font-semibold">
                    {item.invoiceNumber || "N/A"}
                  </td>
                  <td className="p-3 text-sm sm:text-base font-semibold">
                    {item?.itemID?.name}
                  </td>
                  <td className="p-3 text-sm sm:text-base font-semibold">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-sm sm:text-base font-semibold">
                    {item.unit}
                  </td>
                  <td className="p-3 text-sm sm:text-base font-semibold">
                    {item.price}
                  </td>
                  <td className="p-3 text-sm sm:text-base font-semibold">
                    {item.total}
                  </td>
                  <td className="flex items-center justify-center py-2 px-2">
                    <div className="w-8 h-8 text-[#39973D] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm">
                      <button onClick={() => editInvoice(item._id)}>
                        <FaEdit />
                      </button>
                    </div>
                    <div className="w-8 h-8 text-[#0EABEB] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm mx-2">
                      <Link to={`/user/purchaseView/${item._id}`}>
                        <FaEye />
                      </Link>
                    </div>
                    <div className="w-8 h-8 text-[#E11D29] bg-[#f6f8fb] rounded-md flex items-center justify-center text-lg">
                      <button onClick={() => handleDelete(item._id)}>
                        <MdDelete />
                      </button>
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

export default PurchaseInvoice;
