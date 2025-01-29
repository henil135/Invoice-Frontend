import React, { useEffect, useState } from "react";

const SearchResults = ({ query }) => {
  const [customer, setCustomer] = useState([]);
  const [credit, setCredit] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [purchaseinvoice, setPurchaseinvoice] = useState([]);
  const [item, setItem] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Fetch data from APIs
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/customer/viewCustomers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const filteredData = data.filter((customer) => customer.userId === userId);
        setCustomer(filteredData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    const fetchCredit = async () => {
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
        const filteredData = data.filter((notes) => notes.userId === userId);
        setCredit(filteredData);
      } catch (error) {
        console.error("Error fetching credit data:", error);
      }
    };

    const fetchInvoice = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/invoice/viewAll",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const resinvoice = await response.json();
        const data = resinvoice.invoices;
        const filteredData = data.filter((invoice) => invoice.userId === userId);
        setInvoice(filteredData);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    const fetchPurchaseInvoice = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/api/purchaseInvoice/getallpurchaseinvoice`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const datares = await response.json();
        const data = datares.purchaseinvoices;
        const filteredData = data.filter((invoice) => invoice.userId === userId);
        setPurchaseinvoice(filteredData);
      } catch (error) {
        console.error("Error fetching purchase invoice data:", error);
      }
    };

    const fetchItem = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/api/item/getallitem`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const filteredData = data.filter(item => item?.userId?._id == userId);
        setItem(filteredData);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/expenses/expenses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataRes = await response.json();
        const data = dataRes.res;
        const filteredData = data.filter(expense => expense.userId == userId);
        setExpenses(filteredData);
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };


    fetchCustomer();
    fetchCredit();
    fetchInvoice();
    fetchPurchaseInvoice();
    fetchItem();
    fetchExpenses();
  }, []);

  const filteredCustomer = query ? customer.filter((c) => c.displayName.toLowerCase().includes(query.toLowerCase())) : customer;
  const filteredCredit = query ? credit.filter((c) => c.creditNoteID.toLowerCase().includes(query.toLowerCase())) : credit;
  const filteredInvoice = query ? invoice.filter((i) => i.invoiceNumber.toLowerCase().includes(query.toLowerCase())) : invoice;
  const filteredPurchaseInvoice = query ? purchaseinvoice.filter((p) => p.invoiceNumber.toLowerCase().includes(query.toLowerCase())) : purchaseinvoice;
  const filteredItem = query ? item.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())) : item;
  const filteredExpenses = query ? expenses.filter((e) => e.description.toLowerCase().includes(query.toLowerCase())) : expenses;

  return (
    <>
      {/* customer table */}
      <div className="p-6 bg-white shadow-lg rounded-lg mx-3 mt-2 h-[35%] overflow-y-auto">
        <div
          className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <div className="heading font-bold text-[26px]">
            <h3>All Customers</h3>
          </div>
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
                <th className="p-3 text-[#030229] text-left font-semibold rounded-tr-xl">
                  Unused Type
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomer.map((customer) => (
                <tr key={customer.id} className="border-b text-center">
                  <td className="flex items-center p-3">
                    <h3 className="text-[#4F4F4F] text-base font-semibold">
                      {customer.displayName}
                    </h3>
                  </td>
                  <td className="p-3">
                    <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.companyName}
                    </h3>
                  </td>
                  <td className="p-3">
                    <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.email}
                    </h3>
                  </td>
                  <td className="p-3">
                    <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.phoneNumber}
                    </h3>
                  </td>
                  <td className="time p-3">
                    <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                      {customer.customerType}
                    </h3>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* credit note table */}
      <div className="p-6 bg-white shadow-lg rounded-lg mx-3 mt-2 h-[35%] overflow-y-auto">
        <div
          className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <div className="heading font-bold text-[26px]">
            <h3>All Creditnote</h3>
          </div>
          <table className="min-w-full table-layout table-auto">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold rounded-tl-xl">
                  Invoice Date
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Credit Note#
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Customer Name
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Invoice#
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold rounded-tr-xl">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCredit.map((credit) => (
                <tr key={customer.id} className="border-b text-center">
                  <td className="flex items-center p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold">
                      <h3>
                        {new Date(
                          credit.invoiceDetails.invoiceDate
                        ).toLocaleDateString()}
                      </h3>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{credit.creditNoteID}</h3>
                    </div>
                  </td>
                  <td className="time p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{credit.invoiceDetails.customerName}</h3>
                    </div>
                  </td>
                  <td className="time p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{credit.invoiceDetails.invoiceNumber}</h3>
                    </div>
                  </td>
                  <td className="p-2 text-sm sm:text-base font-semibold">
                    <h3 className="text-[#4F4F4F] text-base font-semibold text-left">
                      {credit.invoiceDetails.total}
                    </h3>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* sale invoice table */}
      <div className="p-6 bg-white shadow-lg rounded-lg mx-3 mt-2 h-[35%] overflow-y-auto">
        <div
          className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <div className="heading font-bold text-[26px]">
            <h3>All Sale Invoice</h3>
          </div>
          <table className="min-w-full table-layout table-auto">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-sm sm:text-base font-semibold rounded-tl-xl">
                  Date
                </th>
                <th className="p-3 text-sm sm:text-base font-semibold">
                  Invoice Number
                </th>
                <th className="p-3 text-sm sm:text-base font-semibold">
                  Customer Name
                </th>
                <th className="p-3 text-sm sm:text-base font-semibold">
                  Salesperson Name
                </th>
                <th className="p-3 text-sm sm:text-base font-semibold">
                  Start Date
                </th>
                <th className="p-3 text-sm sm:text-base font-semibold">
                  Due Date
                </th>
                <th className="p-3 text-sm sm:text-base font-semibold rounded-tr-xl">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoice.map((invoice) => (
                <tr key={customer.id} className="border-b text-center">
                  <td className="p-3">{invoice.createdAt}</td>
                  <td className="p-3">{invoice.invoiceNumber}</td>
                  <td className="p-3">{invoice.customerName}</td>
                  <td className="p-3">{invoice.salespersonName}</td>
                  <td className="p-3">{invoice.invoiceDate}</td>
                  <td className="p-3">{invoice.dueDate}</td>
                  <td className="p-3">₹{invoice.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* purchase invoice table */}
      <div className="p-6 bg-white shadow-lg rounded-lg mx-3 mt-2 h-[35%] overflow-y-auto">
        <div
          className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <div className="heading font-bold text-[26px]">
            <h3>All Purchase Invoice</h3>
          </div>
          <table className="min-w-full table-layout table-auto">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base rounded-tl-xl">
                  Invoice Number
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Date
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Item Name
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Quantity
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Unit
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Price
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchaseInvoice.map((item) => (
                <tr key={customer.id} className="border-b text-left">
                  <td className="p-3 text-sm sm:text-base">
                    {item.invoiceNumber || "N/A"}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.createdAt || "N/A"}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.itemID.name}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.unit}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.price}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* item table */}
      <div className="p-6 bg-white shadow-lg rounded-lg mx-3 mt-2 h-[35%] overflow-y-auto">
        <div
          className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <div className="heading font-bold text-[26px]">
            <h3>All Item</h3>
          </div>
          <table className="min-w-full table-layout table-auto">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Date
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Item Name
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  description
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Unit
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold text-sm sm:text-base">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItem.map((item) => (
                <tr key={customer.id} className="border-b text-left">
                  <td className="p-3 text-sm sm:text-base">
                    {item.createdAt || "N/A"}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.name}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.description}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.unit}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expence table */}
      <div className="p-6 bg-white shadow-lg rounded-lg mx-3 mt-2 h-[35%] overflow-y-auto">
        <div
          className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <div className="heading font-bold text-[26px]">
            <h3>All Expenses</h3>
          </div>
          <table className="min-w-full table-layout table-auto">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold rounded-tl-xl">
                  Date
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Description
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Amount
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold rounded-tr-xl">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={customer.id} className="border-b text-left">
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{expense.date}</h3>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{expense.description}</h3>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{expense.amount}</h3>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[#4F4F4F] text-base font-semibold text-left">
                      <h3>{expense.category}</h3>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SearchResults;
