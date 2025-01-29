import React from "react";
import { useNavigate } from "react-router-dom";

const Template2 = ({
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
    navigate("/user/invoiceForm", { state: { selectedTemplate,color,font } });
  };

  // Calculate subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  // Define tax rate (e.g., 10%)
  const taxRate = 0.1;
  const tax = subtotal * taxRate;

  return (
    <div className={` ${font}`} onClick={handleTemplateClick}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="px-10">
          <div
            className="w-full h-36 flex items-center justify-center text-white mb-4"
            style={{
              backgroundColor: colorClasses[color]?.value,
              color: "#ffffff", // Ensure text contrast
            }}
          >
            <span className="text-lg font-semibold">LOGO</span>
          </div>
          <h1 className="text-5xl font-semibold text-[#0D0D15] mt-20">Invoice</h1>
        </div>
        <div className="space-y-1 py-8 ps-20">
          <div className="ps-5 space-y-1">
            <p className="text-sm font-medium text-[#0D0D15]">123-456-7890</p>
            <p className="text-sm font-medium text-[#0D0D15]">you@gmail.com</p>
            <p className="text-sm font-medium text-[#0D0D15] pb-3 mx-0">
              www.betheme.com
            </p>
          </div>
          <div className="border-b-2 border-[#9D7F5D] flex items-center"></div>
          <div className="ps-5">
            <p className="text-sm font-medium text-[#0D0D15] pt-3 pb-1">
              Your Street Address here
            </p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#0D0D15]">
                NO: #{invoiceNumber}
              </p>
              <p className="text-sm font-medium text-[#0D0D15]">
                Date: {clientData.date}
              </p>
              <p className="text-sm font-medium text-[#0D0D15]">
                Due: {clientData.dueDate}
              </p>
              <p className="text-sm font-medium text-[#0D0D15]">
                Due USD - $11,446
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mx-auto px-10">
        <div className="w-full md:w-2/5">
          <div className="pb-5">
            <h3 className={`text-[#0D0D15] text-base`}>To:</h3>
            <p className="text-[#0D0D15] text-base text-lg font-semibold">
              {clientData.name}
            </p>
            <p className="text-[#0D0D15] text-base">{clientData.address}</p>
          </div>

          <div>
            <h3 className={`text-[#0D0D15] font-semibold text-lg mt-9 `}>
              Payment Methods
            </h3>
            <ul className="text-gray-700 text-base">
              <li>Bank Transfer</li>
              <li>Credit Card</li>
              <li>PayPal</li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-3/5 ">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 mb-8">
            <table className="w-full border-collapse shadow-lg">
              <thead
                style={{
                  backgroundColor: colorClasses[color]?.value,
                  color: "#ffffff", // Ensure text contrast
                }}
                className="text-sm uppercase tracking-wider"
              >
                <tr>
                  <th className="text-left py-5 px-3 border-b">Description</th>
                  <th className="text-right py-5 px-3 border-b">Qty</th>
                  <th className="text-right py-5 px-3 border-b">Price</th>
                  <th className="text-right py-5 px-3 border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="py-5 px-3 border-b">{item.description}</td>
                    <td className="py-5 px-3 text-right border-b">
                      {item.quantity}
                    </td>
                    <td className="py-5 px-3 text-right border-b">
                      {item.price}
                    </td>
                    <td className="py-5 px-3 text-right border-b">
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right">
            <h3 className={`text-gray-600 font-semibold text-lg mb-2`}>
              Subtotal: ${subtotal.toFixed(2)}
            </h3>
            <p className="text-gray-700 text-base"></p>
          </div>
          <div className="text-right">
            <h3 className={`text-gray-700 font-semibold text-lg mb-2`}>
              Tax: ${tax.toFixed(2)}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-5">
            <div
              className="text-right col-start-2 text-white p-2"
              style={{
                backgroundColor: colorClasses[color]?.value,
                color: "#ffffff",
              }}
            >
              <p className="font-semibold text-xl">Total: {totalAmount}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t pt-6 mx-auto pb-3 border-[#9D7F5D] px-10">
        <h3 className="font-semibold mb-2">Terms & Conditions</h3>
        <p className="text-sm text-gray-600">
          On the other hand, we denounce with righteous indignation and dislike
          men who are so beguiled and demoralized by the charms.
        </p>
      </div>
    </div>
  );
};

export default Template2;