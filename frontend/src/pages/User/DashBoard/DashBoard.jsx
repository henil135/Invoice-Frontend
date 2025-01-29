import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PaymentChart from "./charts/PaymentChart";
import PaymentSummaryChart from "./charts/PaymentSummaryChart";
import PaymentOverview from "./charts/PaymentOverview";

export const DashBoard = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salespersons, setSalespersons] = useState([]);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch invoices data
        const invoicesResponse = await fetch("http://localhost:8001/api/invoice/viewAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const invoicesDataRes = await invoicesResponse.json();
        const invoicesData = invoicesDataRes.invoices;
        const filteredInvoicesData = invoicesData.filter(invoice => invoice.userId == userId);
        setInvoices(filteredInvoicesData);

        // Fetch customers data
        const customersResponse = await fetch("http://localhost:8001/api/customer/viewCustomers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const customersData = await customersResponse.json();
        const filteredCustomersData = customersData.filter(customer => customer.userId == userId);
        setCustomers(filteredCustomersData);

        // Fetch items data
        const itemsResponse = await fetch("http://localhost:8001/api/item/getallitem", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const itemsData = await itemsResponse.json();
        const filteredItems = itemsData.filter(item => item.userId == userId);
        setItems(filteredItems);

        // Fetch salespersons data
        const salespersonsResponse = await fetch("http://localhost:8001/api/salespersons/getallsalespersone", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const salespersonsData = await salespersonsResponse.json();
        const filteredSalespersons = salespersonsData.filter(salesperson => salesperson?.userId?._id == userId);
        setSalespersons(filteredSalespersons);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="p-3 text-red-500">{error}</div>;
  }

  return (
    <div className="p-3">
      <div className="grid sm:grid-cols-2 grid-cols-1 justify-between items-center gap-4">
        {/* Left Section */}
        <div className="flex items-start mb-6 md:mb-0 bg-white shadow-md rounded-lg p-6">
          {isLoading ? (
            <Skeleton height={120} width="100%" />
          ) : (
            <div className="w-[70%]">
              <h2 className="text-xl font-semibold text-gray-800">
                Professional Invoices Made Easy.
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Quickly understand who your best customers are and their motivation to pay their bills.
              </p>
            </div>
          )}
          <div className="flex items-center justify-center">
            {isLoading ? (
              <Skeleton circle={true} height={100} width={100} />
            ) : (
              <img src="/img/Dashboard.png" alt="invoice" className="w-[44%]" />
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col bg-white shadow-md rounded-lg p-4">
          {isLoading ? (
            <Skeleton height={200} width="100%" />
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                This Week's Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-[24px] font-bold text-[#495057]">
                    {invoices.length}
                  </div>
                  <p className="text-zinc-500 text-[16px] font-semibold mt-2 mb-0">
                    Total Invoices
                  </p>
                  <p className="text-sm text-[#0f0f12bf] rounded mt-1">
                    <span className="bg-blue-400 text-white px-2 py-1 rounded me-1">
                      2.35%
                    </span>{" "}
                    since last week
                  </p>
                </div>
                <div className="flex flex-col items-center border-x">
                  <div className="text-[24px] font-bold text-[#495057]">
                    {customers.length}
                  </div>
                  <p className="text-zinc-500 text-[16px] font-semibold mt-2 mb-0">
                    Total Customers
                  </p>
                  <p className="text-sm text-[#0f0f12bf] rounded mt-1">
                    <span className="bg-green-400 text-white px-2 py-1 rounded me-1">
                      1.85%
                    </span>{" "}
                    since last week
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[24px] font-bold text-[#495057]">
                    {items.length}
                  </div>
                  <p className="text-zinc-500 text-[16px] font-semibold mt-2 mb-0">
                    Total Items
                  </p>
                  <p className="text-sm text-[#0f0f12bf] rounded mt-1">
                    <span className="bg-red-400 text-white px-2 py-1 rounded me-2">
                      -0.45%
                    </span>{" "}
                    since last week
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row my-3 gap-4">
        {/* Chart */}
        <div className="w-full md:w-[60%] bg-white rounded-lg">
          {isLoading ? <Skeleton height={350} /> : <PaymentChart />}
        </div>
        <div className="w-full md:w-[40%] bg-white rounded-lg p-5">
          {isLoading ? <Skeleton height={350} /> : <PaymentSummaryChart />}
        </div>
      </div>

      <div className="flex flex-col md:flex-row my-3 gap-4">
        {/* Chart */}
        <div className="w-full md:w-[50%] bg-white rounded-lg p-5">
          {isLoading ? <Skeleton height={350} /> : <PaymentOverview />}
        </div>
        <div className="w-full md:w-[50%] bg-white rounded-lg p-5">
          {isLoading ? (
            <Skeleton height={200} width="100%" />
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b font-medium text-left">
                    Salesperson Name
                  </th>
                  <th className="px-4 py-2 border-b font-medium text-right">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {salespersons.map((person) => (
                  <tr key={person.id}>
                    <td className="px-4 py-2 border-b">{person.name}</td>
                    <td className="px-4 py-2 border-b text-right">{person.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
