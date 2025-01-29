import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import axios from "axios"; // Axios for API calls
import Swal from "sweetalert2"; 
export const Complain = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  const [newRequest, setNewRequest] = useState({
    type: "",
    title: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch requests on component mount
  useEffect(() => {
    axios
      .get('http://localhost:8001/api/usercomplain/getallcomplain')
      .then((response) => {
        const data = response.data;
        const filteredData = data.filter((complain) => complain.userId === userId);
        setRequests(filteredData);
        setFilteredRequests(response.data);
        setSelectedRequest(response.data[0] || null);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
      });
  }, []);

  // Filter requests based on search and filters
  useEffect(() => {
    const filtered = requests.filter((request) => {
      const matchesSearchTerm = request.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType ? request.type === filterType : true;
      const matchesDate = filterDate
        ? request.date.split(" ")[0] === filterDate
        : true;
      const matchesStatus = filterStatus
        ? request.status === filterStatus
        : true;
      return matchesSearchTerm && matchesType && matchesDate && matchesStatus;
    });
    setFilteredRequests(filtered);
  }, [searchTerm, filterType, filterDate, filterStatus, requests]);

  // Handle modal open for adding or editing
  const handleAddRequestClick = () => {
    setIsEditing(false);
    setNewRequest({ type: "", title: "", description: "" });
    setIsModalOpen(true);
  };

  const handleEditRequestClick = () => {
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Populate newRequest when editing
  useEffect(() => {
    if (isEditing && selectedRequest) {
      setNewRequest({
        type: selectedRequest.type,
        title: selectedRequest.title,
        description: selectedRequest.description,
      });
    }
  }, [isEditing, selectedRequest]);

  // Save or update request
  const handleSaveRequest = () => {
    if (newRequest.type && newRequest.title && newRequest.description) {
      if (isEditing && selectedRequest) {
        // Update request
        axios
          .put(
            `http://localhost:8001/api/usercomplain/updatecomplain/${selectedRequest._id}`,
            {
              ...newRequest,
            }
          )
          .then((response) => {
            setRequests((prevRequests) =>
              prevRequests.map((request) =>
                request._id === selectedRequest._id
                  ? response.data
                  : request
              )
            );
            handleModalClose();
            Swal.fire("Success", "Request updated successfully!", "success");
          })
          .catch((error) => {
            console.error("Error updating request:", error);
            Swal.fire("Error", "Failed to update request.", "error");
          });
      } else {
        // Add new request
        axios
          .post("http://localhost:8001/api/usercomplain/creatusercomplain", {
            ...newRequest,
            status: "pending",
            userId,
          })
          .then((response) => {
            setRequests((prevRequests) => [...prevRequests, response.data]);
            handleModalClose();
            Swal.fire("Success", "Request added successfully!", "success");
          })
          .catch((error) => {
            console.error("Error adding request:", error);
            Swal.fire("Error", "Failed to add request.", "error");
          });
      }
    }
  };

  return (
    <div className="bg-gray-100 p-3">
    {/* Filter and search section */}
    <div className="p-4 flex flex-wrap gap-2 items-center justify-between bg-white rounded">
      <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
        <h1 className="text-lg font-semibold">Client Requests</h1>
        <input
          type="text"
          placeholder="Search by Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow md:flex-none w-full md:w-auto px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">Select Type</option>
          <option value="Customer">Customer</option>
          <option value="Items">Items</option>
          <option value="Invoice">Invoice</option>
          <option value="Expenses">Expenses</option>
          <option value="Credit">Credit</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-1.5 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Completed</option>
        </select>
      </div>
      <button
        className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-4 py-2 text-sm sm:text-base lg:text-lg mt-2 md:mt-0"
        onClick={handleAddRequestClick}
      >
        <h3>Add Request</h3>
      </button>
    </div>
  
    {/* Table and details */}
    <div className="flex flex-col md:flex-row gap-4 mt-3">
      {/* Table Section */}
      <div className="w-full md:w-[70%] bg-white rounded p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedRequest(request)}
              >
                <td className="px-4 py-2">{formatDate(request.date)}</td>
                <td className="px-4 py-2">{request.title}</td>
                <td className="px-4 py-2">{request.type}</td>
                <td
                  className={`px-4 py-2 ${request.status === "pending"
                    ? "text-yellow-600"
                    : "text-green-600"
                    }`}
                >
                  {request.status}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(request);
                      setNewRequest({
                        type: request.type,
                        title: request.title,
                        description: request.details,
                      });
                      setIsEditing(true);
                      setIsModalOpen(true);
                    }}
                    className="w-8 h-8 text-[#39973D] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Details Section */}
      <div className="w-full md:w-[30%] bg-white rounded p-5 shadow-md">
        {selectedRequest ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Request Detail</h2>
            </div>
            <hr className="my-2 border-gray-300" />
            <div>
              <div className="grid grid-cols-2 border-b border-dashed border-gray-300 py-3">
                <div>
                  <p className="text-sm text-gray-500 pb-1">Date</p>
                  <p className="font-normal text-base">
                    {formatDate(selectedRequest.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 pb-1">Request Type</p>
                  <p className="font-normal text-base">
                    {selectedRequest.type}
                  </p>
                </div>
              </div>
              <div className="border-b border-dashed border-gray-300 py-3">
                <p className="text-sm text-gray-500 pb-1">Request Details</p>
                <p className="font-normal text-base">
                  {selectedRequest.title}
                </p>
              </div>
              <div className="border-b border-dashed border-gray-300 py-3">
                <p className="text-sm text-gray-500 pb-1">Request Description</p>
                <p className="font-normal text-base">
                  {selectedRequest.description}
                </p>
              </div>
              <div className="border-b border-dashed border-gray-300 py-3">
                <p className="text-sm text-gray-500 pb-1">Response Details</p>
                <p className="font-normal text-base">
                  {selectedRequest.send || "No response yet."}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-dashed border-gray-300 py-3">
                <div>
                  <p className="text-sm text-gray-500 pb-1">Status</p>
                  <p
                    className={`font-normal text-base ${selectedRequest.status === "pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                      }`}
                  >
                    {selectedRequest.status}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">
            Select a request to view details.
          </p>
        )}
      </div>
    </div>

  

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditing ? "Edit Request" : "Add New Request"}
              </h3>
              <button onClick={handleModalClose}>
                <span className="text-gray-500 text-2xl">&times;</span>
              </button>
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <select
                value={newRequest.type}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, type: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Type</option>
                <option value="Customer">Customer</option>
                <option value="Items">Items</option>
                <option value="Invoice">Invoice</option>
                <option value="Expenses">Expenses</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input
                type="text"
                value={newRequest.title}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">
                Description
              </label>
              <textarea
                value={newRequest.description}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-[#438A7A] text-white py-2 px-4 rounded"
                onClick={handleSaveRequest}
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
