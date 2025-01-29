import React from "react";
import { Outlet, useLocation } from "react-router-dom"; // Step 1: Import useLocation
import CustomerTable from "./CustomerTable";

const Customers = () => {
  const location = useLocation(); // Step 2: Access the current location

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-greyLightest">
      {/* Step 3: Conditionally render the CustomerTable */}
      {location.pathname !== "/user/customers/customer-form" && <CustomerTable />}
    </div>
  );
};

export default Customers;
