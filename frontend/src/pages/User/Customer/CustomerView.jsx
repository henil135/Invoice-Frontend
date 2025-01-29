import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaBuilding,
  FaCreditCard,
  FaMapMarkerAlt,
  FaUsers,
  FaRegCalendarAlt,
  FaInfoCircle,
  FaPlus,
  FaMinus,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
} from "react-icons/fa";

const CustomerView = () => {
  const { id } = useParams(); // Get customer ID from URL
  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // State for active tab
  const [accordionOpen, setAccordionOpen] = useState({
    invoice: false,
    creditNote: false,
  });
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  //Fetch customer details from localStorage
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/api/customer/viewCustomers/${id}`
        );
        setCustomer(response.data);
        console.log(response);
        // Update state with fetched customer data
      } catch (error) {
        console.error("Error fetching customer data:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Status code:", error.response.status);
          console.error("Headers:", error.response.headers);
        }
      }
    };

    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/invoice/viewAll",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const resinvoice = await response.json();
        const data = resinvoice.invoices;
        const filteredData = data.filter((invoice) => invoice.customer === id);
        setInvoices(filteredData);
      } catch (error) {
        console.error("Error fetching invoices:", error.message);
        if (error.response?.status === 404) {
          console.warn("No invoices found for this customer.");
          setInvoices([]);
        }
      }
    };

    const fetchCreditNotes = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/creditNotes/viewall",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const dataRes = await response.json();
        const data = dataRes.notes;
        const filteredData = data.filter((notes) => notes?.invoiceDetails?.customer === id);
        setCreditNotes(filteredData);
      } catch (error) {
        console.error("Error fetching credit notes:", error.message);
        if (error.response?.status === 404) {
          console.warn("No credit notes found for this customer.");
          setCreditNotes([]);
        }
      }
    };

    fetchCustomer();
    fetchInvoices();
    fetchCreditNotes();
  }, [id]);

  const toggleAccordion = (section) => {
    setAccordionOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="bg-[#F6F8FB] p-4">
      <div className=" p-4 ">
        <h1 className="text-2xl font-bold mb-4">
          {customer ? customer.name : "Customer Details"}
        </h1>
        <div className="tabs flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${activeTab === "overview"
              ? " bg-[#438A7A] text-white"
              : "bg-gray-200"
              }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "transaction"
              ? " bg-[#438A7A] text-white"
              : "bg-gray-200"
              }`}
            onClick={() => setActiveTab("transaction")}
          >
            Transaction
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "overview" && (
            <div>
              {customer ? (
                <div className="bg-white p-8 rounded-lg shadow-lg w-full mx-auto">
                  <h1 className="text-3xl font-normal mb-3">
                    Customer Details
                  </h1>
                  <p className="text-2xl font-bold  mb-6">{customer.name}</p>
                  <div className="space-y-6">
                    {/* Company & Financial Info side by side */}
                    <div className="flex gap-6 mb-6">
                      {/* Company Info & Financial Info in one line */}
                      <div className="flex flex-wrap w-full justify-between gap-6 border p-5">
                        {/* Company Name */}
                        <div className="md:w-1/5 w-full">
                          <div className="flex items-center mb-4 mt-6">
                            <FaBuilding className="text-2xl text-blue-600 mr-4" />
                            <h3 className="text-xl font-semibold">
                              Company Name
                            </h3>
                          </div>
                          <p>{customer.companyName}</p>
                        </div>

                        {/* Email */}
                        <div className="md:w-1/5 w-full">
                          <div className="flex items-center mb-4 mt-6">
                            <FaEnvelope className="text-2xl text-blue-600 mr-4" />
                            <h3 className="text-xl font-semibold">Email</h3>
                          </div>
                          <p>{customer.email}</p>
                        </div>

                        {/* Work Phone */}
                        <div className="md:w-1/5 w-full">
                          <div className="flex items-center mb-4 mt-6">
                            <FaPhoneAlt className="text-2xl text-green-600 mr-4" />
                            <h3 className="text-xl font-semibold">
                              Work Phone
                            </h3>
                          </div>
                          <p>{customer.phoneNumber}</p>
                        </div>

                        {/* Receivables */}
                        <div className="md:w-1/5 w-full">
                          <div className="flex items-center mb-4 mt-6">
                            <FaCreditCard className="text-2xl text-yellow-600 mr-4" />
                            <h3 className="text-xl font-semibold">
                              Receivables
                            </h3>
                          </div>
                          <p>{customer.displayName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Address Info */}
                    <div className="pb-6">
                      {/* Billing Address, Shipping Address, and Additional Information side by side */}
                      <div className="flex grid grid-cols-1 sm:grid-cols-2 gap-12 mb-6">
                        {/* Billing Address */}
                        <div className="space-y-6">
                          {/* Check if addresses array exists */}
                          {customer.addresses &&
                            customer.addresses.length > 0 && (
                              <div className="pb-6">
                                {/* Billing Address */}
                                <div className="mb-6 border p-8">
                                  <div className="flex items-center mb-4 border-b pb-2">
                                    <h3 className="text-xl font-semibold">
                                      Billing Address
                                    </h3>
                                  </div>
                                  {customer.addresses[0].billingAddress ? (
                                    <ul className="space-y-2">
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          Attention :
                                        </strong>
                                        {customer.addresses[0].billingAddress
                                          .attention || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          Address:
                                        </strong>{" "}
                                        {customer.addresses[0].billingAddress
                                          .address || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          City:
                                        </strong>{" "}
                                        {customer.addresses[0].billingAddress
                                          .city || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          State:
                                        </strong>{" "}
                                        {customer.addresses[0].billingAddress
                                          .state || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          Pin Code:
                                        </strong>{" "}
                                        {customer.addresses[0].billingAddress
                                          .pinCode || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          Country/Region:
                                        </strong>{" "}
                                        {customer.addresses[0].billingAddress
                                          .countryRegion || "N/A"}
                                      </li>
          
                                    </ul>
                                  ) : (
                                    <p>Billing address not available.</p>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Shipping Address */}
                        <div className="space-y-6">
                          {/* Check if addresses array exists */}
                          {customer.addresses &&
                            customer.addresses.length > 0 && (
                              <div className="pb-6">
                                {/* Shipping Address */}
                                <div className="mb-6 border p-8">
                                  <div className="flex items-center mb-4 border-b pb-2">
                                    <h3 className="text-xl font-semibold">
                                      Shipping Address
                                    </h3>
                                  </div>
                                  {customer.addresses[0].shippingAddress ? (
                                    <ul className="space-y-2">
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          Attention:
                                        </strong>{" "}
                                        {customer.addresses[0].shippingAddress
                                          .attention || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          Address:
                                        </strong>{" "}
                                        {customer.addresses[0].shippingAddress
                                          .address || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          City:
                                        </strong>{" "}
                                        {customer.addresses[0].shippingAddress
                                          .city || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          State:
                                        </strong>{" "}
                                        {customer.addresses[0].shippingAddress
                                          .state || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          Pin Code:
                                        </strong>{" "}
                                        {customer.addresses[0].shippingAddress
                                          .pinCode || "N/A"}
                                      </li>
                                      <li className="text-base">
                                        <strong className="text-base font-semibold">
                                          Country/Region:
                                        </strong>{" "}
                                        {customer.addresses[0].shippingAddress
                                          .countryRegion || "N/A"}
                                      </li>
                                    </ul>
                                  ) : (
                                    <p>Shipping address not available.</p>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading customer data...</p>
              )}
            </div>
          )}
          {activeTab === "transaction" && (
            <div>
              <h2 className="text-xl font-semibold">Transaction</h2>

              <div>
                {/* Invoice Accordion */}
                <div className="border-b mb-4">
                  <button
                    className="w-full text-left p-4 bg-gray-100 hover:bg-gray-300 flex items-center gap-3"
                    onClick={() => toggleAccordion("invoice")}
                  >
                    {accordionOpen.invoice ? (
                      <FaChevronDown className="text-sm" />
                    ) : (
                      <FaChevronRight className="text-sm" />
                    )}
                    <h3 className="text-lg font-semibold">Invoices</h3>
                  </button>
                  {accordionOpen.invoice && (
                    <div className="p-4">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 border-b text-left">
                              Invoice Date
                            </th>
                            <th className="px-4 py-2 border-b text-left">
                              Invoice Number{" "}
                            </th>
                            <th className="px-4 py-2 border-b text-left">
                              Customer Name{" "}
                            </th>
                            <th className="px-4 py-2 border-b text-left">
                              Due Date
                            </th>
                            <th className="px-4 py-2 border-b text-left">
                              Amount{" "}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                              <tr key={invoice.id}>
                                <td className="px-4 py-2 border-b text-left">
                                  {formatDate(invoice.invoiceDate) || "N/A"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {invoice.invoiceNumber || "N/A"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {invoice.customerName || "N/A"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {formatDate(invoice.dueDate) || "N/A"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  ₹{invoice.total}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={6}
                                className="text-center py-4 text-gray-500"
                              >
                                No invoices found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                    </div>

                  )}

                </div>

                {/* Credit Notes Accordion */}
                <div className="border-b mb-4">
                  {/* Credit Notes Accordion */}
                  <button
                    className="w-full text-left p-4 bg-gray-100 hover:bg-gray-300 flex items-center gap-3"
                    onClick={() => toggleAccordion("creditNote")}
                  >
                    {accordionOpen.creditNote ? (
                      <FaChevronDown className="text-sm" />
                    ) : (
                      <FaChevronRight className="text-sm" />
                    )}
                    <h3 className="text-lg font-semibold">Credit Notes</h3>
                  </button>
                  {accordionOpen.creditNote && (
                    <div className="p-4">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 border-b text-left">
                              Date
                            </th>
                            <th className="px-4 py-2 border-b text-left">Customer Name</th>
                            <th className="px-4 py-2 border-b text-left">Credit Note Number</th>
                            <th className="px-4 py-2 border-b text-left">Invoice Number</th>
                            <th className="px-4 py-2 border-b text-left">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {creditNotes.length > 0 ? (
                            creditNotes.map((creditNote) => (
                              <tr key={creditNote.creditNoteID || creditNote.id}>
                                <td className="px-4 py-2 border-b">
                                  {formatDate(creditNote?.invoiceDetails?.createdAt) || "N/A"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {creditNote?.invoiceDetails?.customerName || "N/A"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {creditNote.creditNoteID || "N/A"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  {creditNote?.invoiceDetails?.invoiceNumber || "N/A"}
                                </td>
                                <td className="px-4 py-2 border-b">
                                  ₹{creditNote?.invoiceDetails?.total || "N/A"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-4 text-gray-500">
                                No credit notes found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={() => navigate("/user/customers")}
            className="mt-4 bg-[#438A7A] text-white rounded px-4 py-2"
          >
            Back to customer
          </button>
        </div>
      </div>

    </div>
  );
};

export default CustomerView;