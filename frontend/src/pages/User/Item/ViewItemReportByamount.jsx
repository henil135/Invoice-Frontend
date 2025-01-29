import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ViewItemReportByAmount = () => {
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("stock");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Get userId from localStorage
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token not found");
          return;
        }

        const response = await fetch(
          "http://localhost:8001/api/item/getallitem",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          const userSpecificItems = result.filter(
            (item) => item.userId == userId
          );
          processItemData(userSpecificItems);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching data: " + err.message);
      }
    };

    fetchData();
  }, [userId]);

  const processItemData = (items) => {
    const processedData = items.map((item) => {
      const totalSoldQuantity = item.invoiceHistory
        ? item.invoiceHistory.reduce(
            (sum, invoice) =>
              sum +
              invoice.items.reduce((itemSum, i) => itemSum + i.quantity, 0),
            0
          )
        : 0;

      const totalSoldAmount = item.invoiceHistory
        ? item.invoiceHistory.reduce(
            (sum, invoice) =>
              sum + invoice.items.reduce((itemSum, i) => itemSum + i.total, 0),
            0
          )
        : 0;

      return {
        itemName: item.name,
        stock: item.stock,
        totalSoldQuantity,
        totalSoldAmount,
        invoiceHistory: item.invoiceHistory,
      };
    });

    setData(processedData);
    setFilteredData(processedData);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      const filteredHistory = item.invoiceHistory?.filter((invoice) => {
        const invoiceDate = new Date(invoice.invoiceDate);
        return (
          invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate)
        );
      });

      if (filteredHistory?.length > 0) {
        return { ...item, invoiceHistory: filteredHistory };
      }

      return false;
    });

    setFilteredData(filtered);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortCriteria === "stock") {
      return b.totalSoldQuantity - a.totalSoldQuantity; // Sort by Total Sold Quantity
    } else if (sortCriteria === "amount") {
      return b.totalSoldAmount - a.totalSoldAmount; // Sort by Total Sold Amount
    }
    return 0;
  });

  const generateCSV = () => {
    const headers = "Item Name,Stock,Total Sold Quantity,Total Sold Amount";
    const rows = sortedData.map(
      (item) =>
        `${item.itemName},${item.stock},${item.totalSoldQuantity},₹${item.totalSoldAmount}`
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Item_Report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Item Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [
        ["Item Name", "Stock", "Total Sold Quantity", "Total Sold Amount"],
      ],
      body: sortedData.map((item) => [
        item.itemName,
        item.stock,
        item.totalSoldQuantity,
        `₹${item.totalSoldAmount}`,
      ]),
    });
    doc.save("Item_Report.pdf");
  };

  const handlePrint = () => {
    window.print();
  }
  return (
    <div className="bg-[#F6F8FB] p-3 h-[97%]">
      {error && <p className="text-red-500">{error}</p>}
      <div className="bg-white rounded-lg p-2 shadow-lg">
        <div className="top flex md:flex-row flex-col justify-between md:items-center p-2 pb-5">
          <div className="heading font-bold text-xl sm:text-2xl lg:text-xl xl:text-2xl">
            <h3>Items Report</h3>
          </div>
          <div className="flex md:flex-row flex-col  gap-2 md:items-center md:mt-0 mt-3">
            <div className="md:flex-row flex-row">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded-md bg-white shadow-sm text-sm font-medium"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded-md bg-white shadow-sm text-sm font-medium ml-2"
              />
              <button
                onClick={handleFilter}
                className="btn bg-[#438A7A] text-white rounded-lg px-4 py-2 ml-2 md:mt-0 mt-3"
              >
                Filter
              </button>
            </div>
            <div className="flex md:flex-row flex-row items-center md:ms-0 ms-0">
              <div className="flex md:justify-end p-2">
                <select
                  value={sortCriteria}
                  onChange={handleSortChange}
                  className="p-2 border rounded-md bg-white shadow-sm text-sm font-medium"
                >
                  <option value="stock">By Total Sold Quantity</option>
                  <option value="amount">By Total Sold Amount</option>
                </select>
              </div>
              <div className="relative">
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
        </div>
        <div className="h-[100%] overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          <table className="min-w-full table-layout-fixed">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Item Name
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Quantity (Stock)
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  By Stock (Total Sold Quantity)
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  By Amount (Total Sold Amount)
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length > 0 ? (
                sortedData.map((item, index) => (
                  <tr key={index} className="border-t text-left">
                    <td className="p-3 text-[#4F4F4F] text-sm sm:text-base font-semibold">
                      {item.itemName}
                    </td>
                    <td className="p-3 text-sm sm:text-base font-semibold">
                      {item.stock}
                    </td>
                    <td className="p-3 text-sm sm:text-base font-semibold">
                      {item.totalSoldQuantity}
                    </td>
                    <td className="p-3 text-sm sm:text-base font-semibold">
                      {item.totalSoldAmount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No data found
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

export default ViewItemReportByAmount;
