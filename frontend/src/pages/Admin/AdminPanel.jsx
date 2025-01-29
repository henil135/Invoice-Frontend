import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminDashboard } from "./AdminDashboard";
import Review from "./Review";
import ReviewSummary from "./ReviewSummary";
import { AdminComplain } from "./AdminComplain";


export const AdminPanel = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/complain" element={<AdminComplain />} />
      <Route path="/reviewreports" element={<ReviewSummary />} />
    </Routes>
  );
};
