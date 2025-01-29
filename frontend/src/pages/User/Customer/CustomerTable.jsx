import { useState, useEffect } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";  // Import SweetAlert2
import { Upload } from "lucide-react";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/customer/viewCustomers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Log the full response to inspect

        // Correctly map the data and filter by userId
        const filteredData = data
          .filter((customer) => customer.userId === userId) // Filter customers by userId
          .map((customer) => ({
            id: customer._id,
            name: customer.displayName,
            companyname: customer.companyName,
            email: customer.email,
            workphone: customer.phoneNumber,
            receivables: customer.otherDetails?.[0]?.paymentTerms || "N/A",
            unusedcredits: customer.otherDetails?.[0]?.remarks || "N/A",
          }));

        console.log("Filtered Data:", filteredData); // Ensure the filtered data is correct
        setCustomers(filteredData); // Set the filtered data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [userId, file]); // Dependency on userId to refetch data if userId changes

  const deleteCustomer = async (id) => {
    // SweetAlert confirmation before deleting
    Swal.fire({
      title: "Are you sure?",
      text: "This customer will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8001/api/customer/deleteCustomer?id=${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete customer");
          }

          const result = await response.json();
          console.log("Delete Response:", result);

          // Update the UI after successful deletion
          const updatedCustomers = customers.filter(
            (customer) => customer.id !== id
          );
          setCustomers(updatedCustomers);

          Swal.fire(
            "Deleted!",
            result.message || "Customer deleted successfully",
            "success"
          );
        } catch (error) {
          console.error("Error deleting customer:", error.message);
          Swal.fire("Error", "Failed to delete customer. Please try again.", "error");
        }
      }
    });
  };

  const viewCustomer = async (_id) => {
    try {
      const response = await fetch(
        `http://localhost:8001/api/customer/viewCustomers/${_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customer details");
      }
      const customer = await response.json();
      setSelectedCustomer(customer);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    return (
      customer.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      customer.companyname.toLowerCase().includes(lowerCaseSearchTerm) ||
      customer.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      customer.workphone.includes(lowerCaseSearchTerm)
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
        "http://localhost:8001/api/customer/Customercsv",
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

  const goToCustomerForm = () => {
    navigate("/user/customers/customer-form");
  };

  const editCustomer = (id) => {
    navigate(`/user/customers/customer-form/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-[#F6F8FB] p-3">
      <div className="bg-white rounded-lg p-2 shadow-lg">
        <div className="top flex md:flex-row flex-col justify-between md:items-center p-2 pb-5">
          <div className="heading font-bold text-[26px]">
            <h3>All Customers</h3>
          </div>
          <div className="flex flex-wrap items-center space-x-2">
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 w-80 hidden sm:flex">
              <div className="text-xl text-gray-700">
                <CiSearch />
              </div>
              <input
                type="text"
                placeholder="Search Customer"
                className="bg-transparent pl-2 text-lg outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-4 py-2 ml-2"
              onClick={goToCustomerForm}
            >
              <MdAdd className="text-white rounded text-xl mr-2" />
              <h3>New</h3>
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
        </div>
        <div
          className="h-[100%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <table className="min-w-full table-layout table-auto">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold rounded-tl-xl">
                  Name
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Company Name
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Email
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Work Phone
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Receivables
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Unused Credits
                </th>
                <th className="p-3 text-[#030229] text-center font-semibold rounded-tr-xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-t text-center">
                    <td className="flex items-center p-3">
                      <h3 className="text-[#4F4F4F] text-base font-semibold">
                        {customer.name}
                      </h3>
                    </td>
                    <td className="p-3">
                      <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                        {customer.companyname}
                      </h3>
                    </td>
                    <td className="p-3">
                      <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                        {customer.email}
                      </h3>
                    </td>
                    <td className="p-3">
                      <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                        {customer.workphone}
                      </h3>
                    </td>
                    <td className="time p-3">
                      <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                        {customer.receivables}
                      </h3>
                    </td>
                    <td className="time p-3">
                      <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                        {customer.unusedcredits}
                      </h3>
                    </td>
                    <td className="flex items-center justify-center py-2 px-2">
                      <div
                        className="w-8 h-8 text-[#39973D] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm"
                        onClick={() => editCustomer(customer.id)}
                      >
                        <FaEdit />
                      </div>
                      <div
                        className="w-8 h-8 text-[#0EABEB] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm mx-2"
                        onClick={() =>
                          navigate(`/user/customers/view/${customer.id}`)
                        }
                      >
                        <FaEye />
                      </div>
                      <div
                        className="w-8 h-8 text-[#E11D29] bg-[#f6f8fb] rounded-md flex items-center justify-center text-lg"
                        onClick={() => deleteCustomer(customer.id)}
                      >
                        <MdDelete />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No customers found
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

export default CustomerTable;
