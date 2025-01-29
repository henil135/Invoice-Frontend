import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useParams } from "react-router-dom";

 const ViewItemReport = () => {
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("stock");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);

  // Fetch data from API

  const { id } = useParams(); // Extract the ID from the URL parameters

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/api/item/getitembyitemid/${id}` // Use the extracted ID
        );
        const result = await response.json();
  
        if (response.ok) {
          const fetchedItem = result[0]; // Assuming response is an array
          console.log("Fetched Item:", fetchedItem); // Verify the fetched item
          calculateStockMovements(fetchedItem); // Process stock movements
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching data: " + err.message);
      }
    };
  
    fetchData();
  }, []);

  const calculateStockMovements = (item) => {
    console.log("Fetched Item:", item); // Log the fetched item to verify the structure
  
    const movements = [];
    let currentStock = item.openingStock || 0;
  
    // Add opening stock
    movements.push({
      action: "Opening Stock",
      quantity: item.openingStock || 0,
      remainingStock: currentStock,
      date: "N/A",
    });
  
    // Process invoice history (sales)
    if (item.invoiceHistory && Array.isArray(item.invoiceHistory)) {
      item.invoiceHistory.forEach((invoice) => {
        const soldQuantity = invoice.items
          ? invoice.items.reduce((sum, i) => sum + (i.quantity || 0), 0)
          : 0;
        currentStock -= soldQuantity;
        movements.push({
          action: "Sold",
          quantity: -soldQuantity,
          remainingStock: currentStock,
          date: invoice.invoiceDate
            ? new Date(invoice.invoiceDate).toLocaleDateString()
            : "Unknown Date",
        });
      });
    }
  
    // Process purchase invoices
    if (item.purchaseInvoices && Array.isArray(item.purchaseInvoices)) {
      item.purchaseInvoices.forEach((purchase) => {
        const purchasedQuantity = purchase.quantity || 0;
        currentStock += purchasedQuantity;
        movements.push({
          action: "Purchased",
          quantity: purchasedQuantity,
          remainingStock: currentStock,
          date: purchase.date
            ? new Date(purchase.date).toLocaleDateString()
            : "Unknown Date",
        });
      });
    }
  
    // Process credit notes (returns)
    if (item.creditNote && Array.isArray(item.creditNote)) {
      item.creditNote.forEach((credit) => {
        const returnedQuantity = credit.items
          ? credit.items.reduce((sum, i) => sum + (i.quantity || 0), 0)
          : 0;
        currentStock += returnedQuantity;
        movements.push({
          action: "Returned",
          quantity: returnedQuantity,
          remainingStock: currentStock,
          date: credit.date
            ? new Date(credit.date).toLocaleDateString()
            : "Unknown Date",
        });
      });
    }
  
    console.log("Calculated Movements:", movements); // Log the movements to verify
    setStockMovements(movements);
  };
   

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const generateCSV = () => {
    const headers = "Action,Quantity,Remaining Stock,Date";
    const rows = stockMovements.map(
      (movement) =>
        `${movement.action},${movement.quantity},${movement.remainingStock},${movement.date}`
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Stock_Movement_Report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Movement Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [["Action", "Quantity", "Remaining Stock", "Date"]],
      body: stockMovements.map((movement) => [
        movement.action,
        movement.quantity,
        movement.remainingStock,
        movement.date,
      ]),
    });
    doc.save("Stock_Movement_Report.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F6F8FB] p-3 h-[97%]">
      {error && <p className="text-red-500">{error}</p>}
      <div className="bg-white rounded-lg p-2 shadow-lg">
        <div className="top flex sm:flex-row flex-col justify-between md:items-center p-2 pb-5">
          <div className="heading font-bold text-xl sm:text-2xl lg:text-xl xl:text-2xl">
            <h3>Stock Movement Report</h3>
          </div>
          <div className="flex gap-2">
            <div className="flex justify-end p-2">
              <select
                value={sortCriteria}
                onChange={handleSortChange}
                className="p-2 border rounded-md bg-white shadow-sm text-sm font-medium"
              >
                <option value="stock">By Stock</option>
                <option value="amount">By Amount</option>
              </select>
            </div>
            <div className="relative mt-2">
              <button
                onClick={toggleDropdown}
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
        <div
          className="h-[100%] overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <table className="min-w-full table-layout-fixed">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Action
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Quantity
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Remaining Stock
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.length > 0 ? (
                stockMovements.map((movement, index) => (
                  <tr key={index} className="border-t text-left">
                    <td className="p-3 text-[#4F4F4F] text-sm sm:text-base font-semibold">
                      {movement.action}
                    </td>
                    <td className="p-3 text-sm sm:text-base font-semibold">
                      {movement.quantity}
                    </td>
                    <td className="p-3 text-sm sm:text-base font-semibold">
                      {movement.remainingStock}
                    </td>
                    <td className="p-3 text-sm sm:text-base font-semibold">
                      {movement.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No stock movement data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewItemReport