import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Invoicegenerator = () => {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: "INV-001",
      customerName: "John Doe",
      dueDate: "2024-12-25",
      amount: "$500.00",
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      customerName: "Jane Smith",
      dueDate: "2024-12-30",
      amount: "$750.00",
    },
    {
      id: 3,
      invoiceNumber: "INV-003",
      customerName: "Alice Brown",
      dueDate: "2024-12-28",
      amount: "$320.00",
    },
  ]);

  const navigate = useNavigate();

  return (
    <div className="w-full">
      <h1 className="text-lg sm:text-xl font-semibold pb-3">
        Customer Invoice Generator
      </h1>
      <div
        className="overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 overflow-x-auto sm:h-[540px]"
        // style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <table className="w-full table-auto text-sm sm:text-base">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              <th className="p-2 sm:p-3 text-[#030229] text-left font-semibold rounded-tl-xl">
                Customer
              </th>
              <th className="p-2 sm:p-3 text-[#030229] text-left font-semibold">
                Invoice #
              </th>
              <th className="p-2 sm:p-3 text-[#030229] text-left font-semibold">
                Due Date
              </th>
              <th className="p-2 sm:p-3 text-[#030229] text-left font-semibold rounded-tr-xl">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b">
                <td className="p-2 sm:p-3 text-[#4F4F4F] font-semibold text-left">
                  {invoice.customerName}
                </td>
                <td className="p-2 sm:p-3 text-[#4F4F4F] font-semibold text-left">
                  {invoice.invoiceNumber}
                </td>
                <td className="p-2 sm:p-3 text-[#4F4F4F] font-semibold text-left">
                  {invoice.dueDate}
                </td>
                <td className="p-2 sm:p-3 text-[#4F4F4F] font-semibold text-left">
                  {invoice.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
