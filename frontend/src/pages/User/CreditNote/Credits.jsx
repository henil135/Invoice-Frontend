import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CreditTable from "./CreditTable";

const Credits = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-greyLightest">
      {/* Render CreditTable only if the path is exactly /credits */}
      {location.pathname === "/user/credits/credit-form" && <CreditTable />}
   
    </div>
  );
};

export default Credits;
