import React, { useState } from "react";

function CalculateTotal() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [subTotal, setSubTotal] = useState(699.96);
  const [tax, setTax] = useState(44.99);
  const [discount, setDiscount] = useState(-53.99);
  const [shippingCharge, setShippingCharge] = useState(65.0);
  const [totalAmount, setTotalAmount] = useState(755.96);

  const calculateTotal = () => {
    const total = subTotal + tax + shippingCharge + discount;
    setTotalAmount(total);
  };

  return (
    <div
      className=""
    >
      <h2 className="text-2xl font-bold mb-4">Quick Invoice</h2>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <label
            htmlFor="customerName"
            className="block text-gray-700 font-bold mb-2"
          >
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div>
          <label
            htmlFor="customerEmail"
            className="block text-gray-700 font-bold mb-2"
          >
            Customer Email
          </label>
          <input
            type="email"
            id="customerEmail"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="companyAddress"
            className="block text-gray-700 font-bold mb-2"
          >
            Company Address
          </label>
          <input
            type="address"
            id="companyAddress"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            className="border border-gray-300 p-6 rounded w-full"
          />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold">Invoice Summary:</h3>
        <div className="flex justify-between">
          <p>Sub Total:</p>
          <p>${subTotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Estimated Tax (12.5%):</p>
          <p>${tax.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Discount (Invoika15):</p>
          <p>${discount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping Charge:</p>
          <p>${shippingCharge.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-bold">
          <h3>Total Amount:</h3>
          <h3>${totalAmount.toFixed(2)}</h3>
        </div>
      </div>
      <div className="mt-4 flex md:flex-row flex-col justify-between">
        <button className="bg-gray-200 text-balck p-2 rounded w-full">
          Add More Details
        </button>
        <button className="bg-[#438A7A] text-white p-2 rounded md:ml-2 w-full md:mt-0 mt-4">
          Send Money
        </button>
      </div>
    </div>
  );
}

export default CalculateTotal;
