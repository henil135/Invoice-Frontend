import React from "react";
import { useNavigate } from "react-router-dom";

const Template3 = ({
  color,
  font,
  colorClasses,
  clientData,
  items,
  totalAmount,
  invoiceNumber,
  selectedTemplate
}) => {
  const navigate = useNavigate();
  const handleTemplateClick = () => {
    navigate("/user/invoiceForm", { state: { selectedTemplate, color, font } });
  };

  return (
    <div
      className={`p-6 sm:p-12 ${font} bg-gradient-to-r from-${color}-50 via-${color}-100 to-${color}-200 rounded-3xl overflow-hidden cursor-pointer`}
      onClick={handleTemplateClick}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div
          style={{
            backgroundColor: colorClasses[color]?.value,
          }}
          className="text-right pe-20 py-3"
        >
          <h1 className="text-3xl font-bold text-white">Invoice</h1>
        </div>
        <div className="justify-end items-center flex">
          <div>
            <p className="text-xl font-bold">Invoice #</p>
            <span>{invoiceNumber}000 </span>
          </div>
          <div
            className="w-10 h-10 ms-3"
            style={{ backgroundColor: colorClasses[color]?.value }}
          ></div>
        </div>
      </div>
      {/* Header Section */}
      <div className="text-left mb-12 w-full md:w-[30%]">
        <div className={`border-b pb-3 `}>
          <h2 className="text-lg font-extrabold text-gray-800">
            {clientData.name}
          </h2>
        </div>
        <h3 className="font-semibold text-lg py-3">Billing To :</h3>
        <p className="text-sm">{clientData.billingName}</p>
        <p className="text-sm py-1">{clientData.billingAddress}</p>
        <p className="text-sm">Date: {clientData.date}</p>
        <p className="text-sm pt-1">Due Date: {clientData.dueDate}</p>
      </div>

      {/* Items Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-8">
          <thead
            style={{
              backgroundColor: colorClasses[color]?.value,
              color: "#ffffff", // Optional: Ensure text contrast
            }}
          >
            <tr>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Quantity</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-right">{item.price}</td>
                <td className="p-3 text-right">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Section */}
      <div className={` justify-end font-bold text-lg flex`}>
        <p className={`text-${color}-600`} style={{ letterSpacing: "2px" }}>
          TOTAL:{" "}
        </p>
        <p>{totalAmount}</p>
      </div>

      <div className="mt-6 flex items-center ">
        <div
          className="w-10 h-10 me-4 hidden md:block"
          style={{ backgroundColor: colorClasses[color]?.value }}
        ></div>
        <div>
          <h3 className="font-semibold text-gray-700">Terms & Conditions</h3>
          <p className="text-sm text-gray-600">
            Payment is due within 30 days. A late fee of 5% will apply after the
            due date. For any inquiries, please contact us at info@company.com.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div
        className="p-3 bg-gray-800 mt-6"
        style={{ backgroundColor: colorClasses[color]?.value }}
      >
        <div className="text-center text-white">
          <p className="text-base">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default Template3;