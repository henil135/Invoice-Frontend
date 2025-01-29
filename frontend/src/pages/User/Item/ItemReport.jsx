import { FaBars, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const ItemReport = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token not found");
          return;
        }

        const response = await fetch("http://localhost:8001/api/item/getallitem", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        const filteredItems = data.filter((item) => item.userId === userId);
        setItems(filteredItems);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to fetch items");
      }
    };

    fetchItems();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const filteredItems = items.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchString) ||
      item.type?.toLowerCase().includes(searchString) ||
      item.price?.toString().includes(searchString)
    );
  });

  const handleViewItem = (itemId) => {
    navigate(`/user/viewitemreport/${itemId}`);
  };


  const generateCSV = () => {
    const headers = "Name,Type,Description,Stock,Rate";
    const rows = filteredItems.map(
      (item) => `${item.name},${item.type},${item.description},${item.stock},₹${item.price}`
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
      head: [["Name", "Type", "Description", "Stock", "Rate"]],
      body: filteredItems.map((item) => [
        item.name,
        item.type,
        item.description,
        item.stock,
        `₹${item.price}`,
      ]),
    });
    doc.save("Item_Report.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="bg-[#F6F8FB] p-3 h-[97%]">
        {error && <p className="text-red-500">{error}</p>}
        <div className="bg-white rounded-lg p-2 shadow-lg">
          <div className="top flex justify-between items-center p-2 pb-5">
            <div className="heading font-bold text-xl sm:text-2xl lg:text-xl xl:text-2xl">
              <h3>All Items</h3>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 w-80 hidden sm:flex">
                <div className="text-xl text-gray-700">
                  <CiSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search Items"
                  className="bg-transparent pl-2 text-lg outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
          <div
            className="h-[100%] overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <table className="min-w-full table-layout-fixed">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base rounded-tl-xl">
                    Name
                  </th>
                  <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                    Type
                  </th>
                  <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                    Description
                  </th>
                  <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                    Stock
                  </th>
                  <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                    Rate
                  </th>
                  <th className="p-3 text-[#030229] font-semibold text-sm sm:text-base rounded-tr-xl">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr className="border-t text-left" key={item._id}>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3">{item.stock}</td>
                    <td className="p-3">{item.price}</td>
                    <td className="p-3 flex justify-center">
                    <div className="w-8 h-8 text-[#0EABEB] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm mx-2">
                      <button
                        onClick={() => handleViewItem(item._id)}
                        className="text-blue-500"
                      >
                        <FaEye />
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
    </>
  );
};
