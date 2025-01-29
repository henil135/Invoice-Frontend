import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

function InvoiceReport() {
  const [invoices, setInvoices] = useState([]);
  const [items, setItems] = useState([]); // Store items from the `getallitem` API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
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


  // Fetch invoices and items on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/invoice/viewAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          const resinvoice = await response.json();
          const formattedInvoices = resinvoice.invoices.map((invoice) => ({
            ...invoice,
            createdAt: formatDate(invoice.createdAt),
            invoiceDate: formatDate(invoice.invoiceDate),
            dueDate: formatDate(invoice.dueDate),
          }));
          setInvoices(formattedInvoices || []);
        } else {
          setError("Failed to fetch invoices");
        }
      } catch (error) {
        setError("An error occurred while fetching invoices");
      }
    };
  
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/item/getallitem", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          const itemsData = await response.json();
          setItems(itemsData || []);
        } else {
          setError("Failed to fetch items");
        }
      } catch (error) {
        setError("An error occurred while fetching items");
      }
    };
  
    fetchInvoices();
    fetchItems();
    setLoading(false);
  }, [token]); // Dependencies: runs when the token changes
  

  const calculateProfitLoss = (invoice) => {
    let totalProfitLoss = 0;

    invoice.items.forEach((invoiceItem) => {
      const matchingItem = items.find((item) => item._id === invoiceItem.item);

      if (matchingItem) {
        const costPrice = matchingItem.price; // Item price from `getallitem`
        const invoicePrice = invoiceItem.price; // Item price from the invoice

        const difference = (invoicePrice - costPrice) * invoiceItem.quantity;

        totalProfitLoss += difference;
      }
    });

    return totalProfitLoss;
  };

  const filteredInvoices = invoices
    .filter((invoice) => invoice.userId === userId)
    .filter((invoice) => {
      const profitLoss = calculateProfitLoss(invoice);
      if (filter === "profit") return profitLoss > 0;
      if (filter === "loss") return profitLoss < 0;
      return true;
    })
    .filter((invoice) => {
      if (monthFilter === "all") return true;
      return new Date(invoice.invoiceDate).getMonth() + 1 === parseInt(monthFilter);
    })
    .map((invoice) => ({
      ...invoice,
      profitLoss: calculateProfitLoss(invoice),
    }));

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
          "Profit/Loss",
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
        invoice.profitLoss > 0
          ? `Profit: ₹${invoice.profitLoss}`
          : `Loss: ₹${Math.abs(invoice.profitLoss)}`,
      ]),
    });
    doc.save("Invoice_Report.pdf");
  };

  const generateCSV = () => {
    const headers =
      "Date,Invoice Number,Customer Name,Salesperson Name,Start Date,Due Date,Amount,Profit/Loss";
    const rows = filteredInvoices.map(
      (invoice) =>
        `${invoice.createdAt},${invoice.invoiceNumber},${invoice.customerName},${invoice.salespersonName},${invoice.invoiceDate},${invoice.dueDate},₹${invoice.total},${
          invoice.profitLoss > 0
            ? `Profit: ₹${invoice.profitLoss}`
            : `Loss: ₹${Math.abs(invoice.profitLoss)}`
        }`
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

  
  const handlePrint = () => {
    window.print();
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded md:p-6 p-2">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="font-bold text-[26px]">Invoices</h1>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">All</option>
              <option value="profit">Profit</option>
              <option value="loss">Loss</option>
            </select>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="btn bg-[#438A7A] text-white rounded-lg px-4 py-3"
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
          <div className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <table className="min-w-full table-layout">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Invoice Number</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Salesperson Name</th>
                
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Profit/Loss</th>
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
                      
                      <td className="p-3">{invoice.dueDate}</td>
                      <td className="p-3">₹{invoice.total}</td>
                      <td
                        className={`p-3 ${
                          invoice.profitLoss > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {invoice.profitLoss > 0
                          ? `Profit: ₹${invoice.profitLoss}`
                          : `Loss: ₹${Math.abs(invoice.profitLoss)}`}
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

export default InvoiceReport;
