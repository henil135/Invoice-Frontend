import { jwtDecode } from "jwt-decode";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdAdd, MdDelete } from "react-icons/md";
import { Search } from "lucide-react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Swal from "sweetalert2";

import { Upload } from "lucide-react";

export const Items = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

 
  // Fetch items on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token not found");
          return;
        }

        // Fetch items based on the userId
        const response = await fetch(
          `http://localhost:8001/api/item/getallitem`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        const filteredItems = data.filter(
          (item) => item.userId == userId
        );
        setItems(filteredItems);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to fetch items");
      }
    };

    fetchItems();
  }, [file]);

  // Filtered items for search functionality
  const filteredItems = items?.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    const name = item.name.toLowerCase();
    const type = item.type?.toLowerCase();
    const rate = item.price?.toString() || "";
    return (
      name?.includes(searchString) ||
      type?.includes(searchString) ||
      rate?.includes(searchString)
    );
  });

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
        "http://localhost:8001/api/item/bulkupload",
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

  // Toggle search functionality
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Navigate to edit item form
  const editItem = (id) => {
    navigate(`/user/itemsForm/${id}`);
  };

  // Handle item deletion
  const handleDelete = async (id) => {
    // Show confirmation popup
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
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8001/api/item/deletitem/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to delete item");

        // Show success message
        await Swal.fire("Deleted!", "The item has been deleted.", "success");

        // Update state to remove item from list
        const updatedItems = items.filter((item) => item._id !== id);
        setItems(updatedItems);
      } catch (err) {
        console.error("Error deleting item:", err);
        setError("Failed to delete item");
        await Swal.fire(
          "Error!",
          "There was an issue deleting the item.",
          "error"
        );
      }
    }
  };

  const ViewItem = (id) => {
    navigate(`/user/itemsDetails/${id}`);
  };

  const handleAddItem = () => {
    navigate("/user/itemsForm");
  };


  return (
    <>
  
        <div className="bg-[#F6F8FB] p-3 h-[97%]">
          {error && <p className="text-red-500">{error}</p>}
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <div className="top flex md:flex-row flex-col justify-between md:items-center p-2 pb-5">
              <div className="heading font-bold text-xl sm:text-2xl lg:text-xl xl:text-2xl">
                <h3>All Items</h3>
              </div>
              <div className="flex md:items-center space-y-2 md:space-y-0 space-x-2">
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 w-80 hidden md:flex">
                  <div className="text-xl text-gray-700">
                    <CiSearch />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Items"
                    className="bg-transparent pl-2 text-lg new-lg:text-base new-xl:text-lg outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddItem}
                  className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-2 py-2 text-sm sm:text-base lg:text-lg "
                >
                  <div className="text-white text-lg mr-2">
                    <MdAdd />
                  </div>
                  <h3>Add Item</h3>
                </button>
                <div className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-4 py-2.5 md:ml-2">
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
            </div>

            <div
              className="h-[100%] overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              <table className="min-w-full table-layout-fixed">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base rounded-tl-xl w-[15%]">
                      Name
                    </th>
                    <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base w-[10%]">
                      Type
                    </th>
                    <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base w-[20%]">
                      Description
                    </th>
                    <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base w-[10%]">
                      Stock
                    </th>
                    <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base w-[10%]">
                      Rate
                    </th>
                    <th className="p-3 text-[#030229] font-semibold text-sm sm:text-base rounded-tr-xl w-[15%]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems?.map((item) => (
                    <tr className="border-t text-left" key={item._id}>
                      <td className="flex items-center p-3">
                        <h3 className="text-[#4F4F4F] text-sm sm:text-base font-semibold">
                          {item.name}
                        </h3>
                      </td>
                      <td>
                        <h3 className="text-[#4F4F4F] text-sm sm:text-base font-semibold">
                          {item.type}
                        </h3>
                      </td>
                      <td className="p-3">
                        <h3 className="text-[#4F4F4F] text-sm sm:text-base font-semibold">
                          {item.description}
                        </h3>
                      </td>
                      <td className="p-3">
                        <h3 className="text-[#4F4F4F] text-sm sm:text-base font-semibold">
                          {item.stock}
                        </h3>
                      </td>
                      <td className="p-3 text-sm sm:text-base font-semibold">
                        <h3 className="bg-gray-100 text-[#718EBF] rounded-full py-1 px-1 w-[50%] text-center">
                          {item.price}
                        </h3>
                      </td>
                      <td className="flex items-center justify-center py-2 px-2">
                        <div className="w-8 h-8 text-[#39973D] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm">
                          <button onClick={() => editItem(item._id)}>
                            <FaEdit />
                          </button>
                        </div>
                        <div className="w-8 h-8 text-[#0EABEB] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm mx-2">
                          <button onClick={() => ViewItem(item._id)}>
                            <FaEye />
                          </button>
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
     
    </>
  );
};
