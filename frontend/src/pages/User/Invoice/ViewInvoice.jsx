import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { IoMailUnread } from "react-icons/io5";
import { LuEarth } from "react-icons/lu";

function ViewInvoice() {
  const { state } = useLocation();
  const invoice = state?.invoice;
  const navigate = useNavigate();
  const colorClasses = {
    purple: { value: "#6B46C1" },
  };
  const color = "purple";

  if (invoice.templateId == 1) {
    return (
      <div className="m-10 flex justify-center items-center">
        <div className="font-sans rounded-lg bg-white shadow rounded-lg">
          {/* Header Section */}
          <div className={`rounded-t-lg flex flex-col md:flex-row mx-4 md:mx-10 border-b border-[${colorClasses[color]?.value}]`}>
            <div
              style={{
                backgroundColor: colorClasses[color]?.value,
                padding: "10px",
              }}
              className="w-full md:w-[30%] flex justify-center items-center"
            >
              {invoice.image ? (
                <img
                  src={invoice.image}
                  alt="Company Logo"
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <h2 className="text-3xl font-extrabold text-white">Swiftrut Tec</h2>
              )}
            </div>

            <div className="w-[70%] text-center p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex md:block items-center">
                  <FaPhoneSquareAlt className={`text-${color}-600 flex me-2 md:m-auto text-xl`} />
                  <span className="text-sm">{invoice.contactPhone || "(91) 953264582"}</span>
                </div>
                <div className="flex md:block md:border-x border-0 px-0 md:px-12">
                  <IoMailUnread className={`text-${color}-600 flex me-2 md:m-auto text-xl`} />
                  <span className="text-sm">{invoice.contactEmail || "invoice@swiftrut.com"}</span>
                </div>
                <div className="flex md:block items-center">
                  <LuEarth className={`text-${color}-600 flex me-2 md:m-auto text-xl`} />
                  <span className="text-sm">{invoice.website || "Swiftrut Tech"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="mx-4 md:mx-14 rounded-lg">
            <div className="flex flex-col md:flex-row flex-col-reverse justify-between items-center pb-5">
              <div className="w-full md:w-[60%]">
                <div className="space-y-2 md:border-b-2 border-0 py-3">
                  <h3 className="font-semibold text-lg text-gray-700">Bill To:</h3>
                  <p className="text-sm">{invoice.customerName || "N/A"}</p>
                  <p className="text-sm">{invoice.salespersonName || "N/A"}</p>
                </div>
                <div className="space-y-2 pt-3">
                  <p className="text-lg font-semibold">Invoice #: {invoice.invoiceNumber || "N/A"}</p>
                  <p className="text-sm text-gray-500">Date: {invoice.invoiceDate || "N/A"}</p>
                  <p className="text-sm text-gray-500">Due: {invoice.dueDate || "N/A"}</p>
                </div>
              </div>
              <div className="w-full md:w-[40%] ps-0 md:ps-10 text-right">
                <h2 className="text-4xl font-normal text-black pb-5">INVOICE</h2>
                <div>
                  <p className="text-xl font-normal text-black">Account Number:</p>
                  <span>{invoice.invoiceNumber || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 bg-white rounded-lg shadow-md">
              <table className="w-full border-collapse">
                <thead
                  style={{
                    backgroundColor: colorClasses[color]?.value,
                    color: "#ffffff",
                  }}
                >
                  <tr>
                    <th className="text-left p-4 border-b">Name</th>
                    <th className="text-right p-4 border-b">Quantity</th>
                    <th className="text-right p-4 border-b">Price</th>
                    <th className="text-right p-4 border-b">Tax</th>
                    <th className="text-right p-4 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
                    invoice.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="p-4 border-b">{item.name || "N/A"}</td>
                        <td className="p-4 text-right border-b">{item.quantity || 0}</td>
                        <td className="p-4 text-right border-b">{item.price || 0}</td>
                        <td className="p-4 text-right border-b">{item.tax || 0}</td>
                        <td className="p-4 text-right border-b">{item.total || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-4 border-b">
                        No items available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>

              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-gray-900">Total: {invoice.total}</p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="my-6">
              <h3 className="font-semibold text-gray-700">Terms & Conditions</h3>
              <p className="text-sm text-gray-600">
                Payment is due within 30 days. A late fee of 5% will apply after the due date. For any inquiries, please contact us at info@company.com.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4" style={{ backgroundColor: colorClasses[color]?.value }}>
            <button className="text-center text-white w-full" onClick={() => navigate("/user/invoice")}>
              <p>Thank you for your business ! Go invoice</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (invoice.templateId == 2) {
    return (
      <div className="m-10 flex justify-center items-center">
        <div className='font-sans rounded-lg bg-white shadow rounded-lg'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="px-10">
              <div
                style={{
                  backgroundColor: colorClasses[color]?.value,
                  padding: "10px",
                }}
                className="w-full h-36 flex items-center justify-center text-white mb-4"
              >
                {invoice.image ? (
                  <img
                    src={invoice.image}
                    alt="Company Logo"
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  <h2 className="text-3xl font-extrabold text-white">Swiftrut Tec</h2>
                )}
              </div>
              <h1 className="text-5xl font-semibold text-[#0D0D15] mt-20">Invoice</h1>
            </div>
            <div className="space-y-1 py-8 ps-20">
              <div className="ps-5 space-y-1">
                <p className="text-sm font-medium text-[#0D0D15]">{invoice.contactPhone || "(91) 953264582"}</p>
                <p className="text-sm font-medium text-[#0D0D15]">{invoice.contactEmail || "invoice@swiftrut.com"}</p>
                <p className="text-sm font-medium text-[#0D0D15] pb-3 mx-0">
                  {invoice.website || "Swiftrut Tech"}
                </p>
              </div>
              <div className="border-b-2 border-[#9D7F5D] flex items-center"></div>
              <div className="ps-5">
                <div className="space-y-1 mt-4">
                  <p className="text-sm font-medium text-[#0D0D15]">
                    NO: #{invoice.invoiceNumber || "N/A"}
                  </p>
                  <p className="text-sm font-medium text-[#0D0D15]">
                    Date: {invoice.invoiceDate || "N/A"}
                  </p>
                  <p className="text-sm font-medium text-[#0D0D15]">
                    Due: {invoice.dueDate || "N/A"}
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
                  {invoice.customerName || "N/A"}
                </p>
                <p className="text-[#0D0D15] text-base">{invoice.salespersonName || "N/A"}</p>
              </div>

              <div>

              </div>
            </div>
            <div className="w-full md:w-3/5 ">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 mb-8">
                <table className="w-full border-collapse shadow-lg">
                  <thead
                    style={{
                      backgroundColor: colorClasses[color]?.value,
                      color: "#ffffff",
                    }}
                    className="text-sm uppercase tracking-wider"
                  >
                    <tr>
                      <th className="text-left p-4 border-b">Name</th>
                      <th className="text-right p-4 border-b">Quantity</th>
                      <th className="text-right p-4 border-b">Price</th>
                      <th className="text-right p-4 border-b">Tax</th>
                      <th className="text-right p-4 border-b">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
                      invoice.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="p-4 border-b">{item.name || "N/A"}</td>
                          <td className="p-4 text-right border-b">{item.quantity || 0}</td>
                          <td className="p-4 text-right border-b">{item.price || 0}</td>
                          <td className="p-4 text-right border-b">{item.tax || 0}</td>
                          <td className="p-4 text-right border-b">{item.total || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center p-4 border-b">
                          No items available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 mb-5">
                <div
                  className="text-right col-start-2 text-white p-2"
                  style={{
                    backgroundColor: colorClasses[color]?.value,
                    color: "#ffffff",
                  }}
                >
                  <p className="font-semibold text-xl">Total: {invoice.total}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 mx-auto pb-3 border-[#9D7F5D] px-10 mt-3">
            <h3 className="font-semibold mb-2">Terms & Conditions</h3>
            <p className="text-sm text-gray-600">
              On the other hand, we denounce with righteous indignation and dislike
              men who are so beguiled and demoralized by the charms.
            </p>
          </div>
          <div className="p-4" style={{ backgroundColor: colorClasses[color]?.value }}>
            <button className="text-center text-white w-full" onClick={() => navigate("/user/invoice")}>
              <p>Thank you for your business ! Go invoice</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-10 flex justify-center items-center">
      <div className="font-sans rounded-lg bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div
            style={{
              backgroundColor: colorClasses[color]?.value,
              padding: "10px",
            }}
            className="w-full md:w-[80%] flex justify-center items-center"
          >
            {invoice.image ? (
              <img
                src={invoice.image}
                alt="Company Logo"
                className="h-16 w-auto object-contain"
              />
            ) : (
              <h2 className="text-3xl font-extrabold text-white">Swiftrut Tec</h2>
            )}
          </div>
          <div className="justify-end items-center flex">
            <div>
              <p className="text-xl font-bold">Invoice #</p>
              <span>{invoice.invoiceNumber || "N/A"}</span>
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
              {invoice.customerName || "N/A"}
            </h2>
          </div>
          <h3 className="font-semibold text-lg py-3">Billing To :</h3>
          <p className="text-sm">{invoice.salespersonName || "N/A"}</p>
          <p className="text-sm">Date: {invoice.invoiceDate || "N/A"}</p>
          <p className="text-sm pt-1">Due Date: {invoice.dueDate || "N/A"}</p>
        </div>

        {/* Items Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-8">
            <thead
              style={{
                backgroundColor: colorClasses[color]?.value,
                color: "#ffffff",
              }}
            >
              <tr>
                <th className="text-left p-4 border-b">Name</th>
                <th className="text-right p-4 border-b">Quantity</th>
                <th className="text-right p-4 border-b">Price</th>
                <th className="text-right p-4 border-b">Tax</th>
                <th className="text-right p-4 border-b">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-4 border-b">{item.name || "N/A"}</td>
                    <td className="p-4 text-right border-b">{item.quantity || 0}</td>
                    <td className="p-4 text-right border-b">{item.price || 0}</td>
                    <td className="p-4 text-right border-b">{item.tax || 0}</td>
                    <td className="p-4 text-right border-b">{item.total || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 border-b">
                    No items available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className={` justify-end font-bold text-lg flex`}>
          <p className={`text-${color}-600`} style={{ letterSpacing: "2px" }}>
            TOTAL:{" "}
          </p>
          <p>{invoice.total}</p>
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
        <div className="p-4 mt-3" style={{ backgroundColor: colorClasses[color]?.value }}>
          <button className="text-center text-white w-full" onClick={() => navigate("/user/invoice")}>
            <p>Thank you for your business ! Go invoice</p>
          </button>
        </div>
      </div>
    </div >
  );
}

export default ViewInvoice;
