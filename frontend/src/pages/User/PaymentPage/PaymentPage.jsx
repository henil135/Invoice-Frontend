import React, { useState, useEffect } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const initialCustomers = [
      {
        id: 1,
        name: "John Doe",
        date: "2024-12-15",
        companyname: "ABC Corp",
        email: "john@example.com",
        workphone: "123-456-7890",
        receivables: "$200",
        unusedcredits: "$50",
        payment: "Payment1",
        type: "Invoice Payment",
        referenceNumber: "12345",
        invoice: "INV001",
        mode: "Cash",
        amount: "$250",
      },
      {
        id: 2,
        name: "Jane Smith",
        date: "2024-12-15",
        companyname: "XYZ Ltd",
        email: "jane@example.com",
        workphone: "987-654-3210",
        receivables: "$300",
        unusedcredits: "$100",
        payment: "Payment2",
        type: "Retainer Payment",
        referenceNumber: "67890",
        invoice: "INV002",
        mode: "Card",
        amount: "$400",
      },
    ];
    setCustomers(initialCustomers);
  }, []);

  const deleteCustomer = (id) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter((customer) => customer.id !== id)
    );
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.companyname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.workphone.includes(searchTerm)
  );

  return (
    <div className="bg-[#F6F8FB] p-3">
      <div className="bg-white rounded-lg p-2 shadow-lg">
        <div className="top flex justify-between items-center p-2 pb-5 flex-wrap">
          <div className="heading font-bold text-[20px] new-lg:text-xl new-xl:text-[26px] w-full sm:w-auto">
            <select className="p-2 mt-2 w-full sm:w-auto border-2 border-gray-200 rounded-md">
              <option value="all-payments">All Payments</option>
              <option value="all-customers">All Customers</option>
              <option value="all-invoices">All Invoices</option>
              <option value="all-retainer">All Retainer Payments</option>
            </select>
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
                  Date
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Payment
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Type
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Reference Number
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Customer Name
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Invoice#
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Mode
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Amount
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Unused Credits
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold rounded-tr-xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t text-center">
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.date}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.payment}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.type}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.referenceNumber}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.name}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.invoice}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.mode}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.amount}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.unusedcredits}
                    </div>
                  </td>
                  <td className="flex text-left py-2 px-2 ">
                    <div className="w-8 h-8 text-[#0EABEB] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm mx-2">
                      <FaEye
                        onClick={() => navigate(`/user/view-payment/${customer.id}`)}
                      />
                    </div>

                    <div
                      className="w-8 h-8 text-[#E11D29] bg-[#f6f8fb] rounded-md flex items-center justify-center text-lg"
                      onClick={() => deleteCustomer(customer.id)}
                    >
                      <MdDelete />
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

export default PaymentPage;
