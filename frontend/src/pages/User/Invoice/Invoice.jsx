import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { Upload } from "lucide-react";

function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

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
        const response = await fetch(
          "http://localhost:8001/api/invoice/viewAll",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const resinvoice = await response.json();
          const data = resinvoice.invoices;

          if (Array.isArray(data)) {
            const formattedInvoices = data.map((invoice) => ({
              ...invoice,
              createdAt: formatDate(invoice.createdAt),
              invoiceDate: formatDate(invoice.invoiceDate),
              dueDate: formatDate(invoice.dueDate),
            }));
            setInvoices(formattedInvoices);
          } else {
            setError("Received data is not in an expected format");
          }
        } else {
          setError("Failed to fetch invoices");
        }
      } catch (error) {
        setError("An error occurred while fetching invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [token, file]);

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
        "http://localhost:8001/api/invoice/bulkupload",
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

  const deleteInvoice = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will delete the invoice permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `http://localhost:8001/api/invoice/deleteById/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          Swal.fire("Deleted!", "The invoice has been deleted.", "success");
          setInvoices(invoices.filter((invoice) => invoice._id !== id));
        } else {
          Swal.fire("Error!", "Failed to delete the invoice.", "error");
        }
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "An error occurred while deleting the invoice.",
        "error"
      );
    }
  };

  const handleEditInvoice = (id) => {
    navigate(`/user/invoiceForm/${id}`);
  };

  const handleViewInvoice = (invoice) => {
    navigate(`/user/view-invoice/${invoice._id}`, { state: { invoice } });
  };

  const filteredInvoices = invoices.filter(
    (invoice) => invoice.userId === userId
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [
        [
          "Date",
          "Invoice Number",
          "Customer Name",
          "Salesperson Name",
          "Start Date",
          "Due Date",
          "Amount",
        ],
      ],
      body: filteredInvoices.map((invoice) => [
        invoice.createdAt,
        invoice.invoiceNumber,
        invoice.customerName,
        invoice.salespersonName,
        invoice.invoiceDate,
        invoice.dueDate,
        `₹${invoice.total}`,
      ]),
    });
    doc.save("Invoice_Report.pdf");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  const handlePrint = () => {
    window.print();
  };

  const generateCSV = () => {
    const headers =
      "Date,Invoice Number,Customer Name,Salesperson Name,Start Date,Due Date,Amount";
    const rows = filteredInvoices.map(
      (invoice) =>
        `${invoice.createdAt},${invoice.invoiceNumber},${invoice.customerName},${invoice.salespersonName},${invoice.invoiceDate},${invoice.dueDate},₹${invoice.total}`
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Invoice_Report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded p-6">
      <div className="flex md:flex-row flex-col justify-between md:items-center mb-6">
          <h1 className="font-bold text-[26px]">Invoices</h1>
          <div className="flex md:items-center space-x-1">
            <button className="bg-[#438A7A] text-white rounded-lg md:px-4 py-2 px-1">
              <Link to="/user/invoicetemp">New Invoice</Link>
            </button>
            <div className="btn flex items-center bg-[#438A7A] text-white rounded-lg md:px-4 px-1 py-2 md:ml-2">
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
                className="bg-[#438A7A] px-2 rounded md:mx-2"
                onClick={uploadCSV}
              >
                <Upload />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="btn bg-[#438A7A] text-white rounded-lg px-3 py-3"
              >
                <FaBars />
              </button>
              {dropdownOpen && (
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

        {loading ? (
          <div>Loading invoices...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div
            className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <table className="min-w-full table-layout">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Invoice Number</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Salesperson Name</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="border-b text-center">
                      <td className="p-3">{invoice.createdAt}</td>
                      <td className="p-3">{invoice.invoiceNumber}</td>
                      <td className="p-3">{invoice.customerName}</td>
                      <td className="p-3">{invoice.salespersonName}</td>
                      <td className="p-3">{invoice.invoiceDate}</td>
                      <td className="p-3">{invoice.dueDate}</td>
                      <td className="p-3">₹{invoice.total}</td>

                      <td className="p-3 flex items-center justify-center gap-2">
                        <div
                          className="w-8 h-8 text-[#39973D] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm cursor-pointer"
                          onClick={() => handleEditInvoice(invoice._id)}
                        >
                          <FaEdit />
                        </div>
                        <div
                          className="w-8 h-8 text-[#0EABEB] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm mx-2 cursor-pointer"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <FaEye />
                        </div>
                        <div
                          className="w-8 h-8 text-[#E11D29] bg-[#f6f8fb] rounded-md flex items-center justify-center text-lg cursor-pointer"
                          onClick={() => deleteInvoice(invoice._id)}
                        >
                          <MdDelete />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-3">
                      No invoices available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Invoice;
