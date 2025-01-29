import React from "react";
import ActiveCustomerChart from "./Chart/ActiveCustomerChart";
import { Invoicegenerator } from "./Invoicegenerator";
import CustomerReview from "./Chart/CustomerReview";
import CustomerAmount from "./Chart/CustomerAmount";

export const AdminDashboard = () => {
  return (
    <div className="p-3">
      {/* First Row: Charts */}
      <div className="flex flex-col md:flex-row gap-4 my-3">
        <div className="w-full md:w-1/2 bg-white rounded-lg p-3">
          <ActiveCustomerChart />
        </div>
        <div className="w-full md:w-1/2 bg-white rounded-lg p-3">
          <CustomerAmount />
        </div>
      </div>

      {/* Second Row: Invoice Generator and Customer Review */}
      <div className="flex flex-col md:flex-row gap-4 my-3">
        <div className="w-full md:w-3/5 bg-white rounded-lg p-3">
          <Invoicegenerator />
        </div>
        <div className="w-full md:w-2/5 bg-white rounded-lg p-3">
          <CustomerReview />
        </div>
      </div>
    </div>
  );
};
