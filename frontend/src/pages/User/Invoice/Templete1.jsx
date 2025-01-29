import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { IoMailUnread } from "react-icons/io5";
import { LuEarth } from "react-icons/lu";

const Template1 = ({
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
    <div className={`${font} rounded-lg`} onClick={handleTemplateClick}>
      {/* Header Section */}
      <div className={`rounded-t-lg flex flex-col md:flex-row mx-4 md:mx-10 border-b border-[${colorClasses[color]?.value}]`}>
        <div
          style={{
            backgroundColor: colorClasses[color]?.value,
            padding: "10px",
          }} className="w-full md:w-[30%]"
        >
          <h2 className="text-3xl font-extrabold text-white">Company logo</h2>
        </div>
        <div className="w-[70%] text-center p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex md:block items-center">
              <FaPhoneSquareAlt
                className={`text-${color}-600 flex me-2 md:m-auto text-xl`}
              />
              <span className="text-sm">(123) 456-7890</span>
            </div>
            <div className="flex md:block md:border-x border-0 px-0 md:px-12">
              <IoMailUnread
                className={`text-${color}-600 flex me-2 md:m-auto text-xl`}
              />
              <span className="text-sm">info@company.com</span>
            </div>
            <div className="flex md:block items-center">
              <LuEarth className={`text-${color}-600 flex me-2 md:m-auto text-xl`} />
              <span className="text-sm"> www.company.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="mx-4 md:mx-14  rounded-lg">
        <div className="flex flex-col md:flex-row flex-col-reverse  justify-between items-center pb-5">
          <div className="w-full md:w-[60%]">
            <div className="space-y-2 md:border-b-2 border-0 py-3">
              <h3 className="font-semibold text-lg text-gray-700">Bill To:</h3>
              <p className="text-sm ">{clientData.name}</p>
              <p className="text-sm">{clientData.address}</p>
              <p className="text-sm">
                {clientData.city}, {clientData.state}, {clientData.zip}
              </p>
            </div>
            <div className="space-y-2 pt-3">
              <p className="text-lg font-semibold">
                Invoice #: {invoiceNumber}
              </p>
              <p className="text-sm text-gray-500">Date: {clientData.date}</p>
              <p className="text-sm text-gray-500">Due: {clientData.dueDate}</p>
            </div>
          </div>
          <div className="w-full md:w-[40%] ps-0 md:ps-10 text-right">
            <h2 className="text-4xl font-normal text-black pb-5">INVOICE</h2>
            <div>
              <p className="text-xl font-normal text-black">Account Number:</p>
              <span>1234567890</span>
            </div>
          </div>
        </div>

        <div className="">
          {/* Table with Items */}
          <div className="mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 bg-white rounded-lg shadow-md">
            <table className="w-full border-collapse">
              <thead
                style={{
                  backgroundColor: colorClasses[color]?.value,
                  color: "#ffffff", // Optional: Ensure text contrast
                }}
                className="transition-all duration-300 ease-in-out hover:shadow-lg"
              >
                <tr>
                  <th className="text-left p-4 border-b">Description</th>
                  <th className="text-right p-4 border-b">Quantity</th>
                  <th className="text-right p-4 border-b">Price</th>
                  <th className="text-right p-4 border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-all duration-300 ease-in-out"
                  >
                    <td className="p-4 border-b">{item.description}</td>
                    <td className="p-4 text-right border-b">{item.quantity}</td>
                    <td className="p-4 text-right border-b">{item.price}</td>
                    <td className="p-4 text-right border-b">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="mt-4">
              <h3 className={`text-${color}-600 font-semibold text-lg mb-2`}>
                Payment Methods
              </h3>
              <ul className="text-gray-700 text-base">
                <li>Bank Transfer</li>
                <li>Credit Card</li>
                <li>PayPal</li>
              </ul>
            </div>
            <div className="mt-4 text-right">
              <p className="font-bold text-xl text-gray-900">
                Total: {totalAmount}
              </p>
            </div>
          </div>

          {/* Total Section */}
        </div>
        <div className="py-3 w-full md:w-[50%]">
          {/* Terms & Conditions */}
          <div className="mt-6 ">
            <h3 className="font-semibold text-gray-700">Terms & Conditions</h3>
            <p className="text-sm text-gray-600">
              Payment is due within 30 days. A late fee of 5% will apply after
              the due date. For any inquiries, please contact us at
              info@company.com.
            </p>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div
        className="p-4 bg-gray-800 mb-3"
        style={{ backgroundColor: colorClasses[color]?.value }}
      >
        <div className="text-center text-white">
          <p className="text-base">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default Template1;