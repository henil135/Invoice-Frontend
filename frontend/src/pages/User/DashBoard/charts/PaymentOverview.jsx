import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data for received and due amounts
const data = {
  weekly: [
    { week: "Week 1", received: 200, due: 150 },
    { week: "Week 2", received: 250, due: 200 },
    { week: "Week 3", received: 300, due: 250 },
    { week: "Week 4", received: 350, due: 300 },
  ],
  monthly: [
    { month: "Jan", received: 1000, due: 900 },
    { month: "Feb", received: 1200, due: 1100 },
    { month: "Mar", received: 1300, due: 1200 },
    { month: "Apr", received: 1400, due: 1300 },
    { month: "May", received: 1500, due: 1400 },
    { month: "Jun", received: 1600, due: 1500 },
  ],
  yearly: [
    { year: "2020", received: 15000, due: 13000 },
    { year: "2021", received: 16000, due: 14000 },
    { year: "2022", received: 17000, due: 15000 },
    { year: "2023", received: 18000, due: 16000 },
  ],
};

const PaymentOverview = () => {
  const [view, setView] = useState("monthly"); // Default view is monthly
  const [currentData, setCurrentData] = useState(data.monthly); // Set default data to monthly

  // Handle view change (Weekly, Monthly, Yearly)
  const handleViewChange = (e) => {
    setView(e.target.value);
    setCurrentData(data[e.target.value]);
  };

  // Calculate total received and due amount
  const totalReceived = currentData.reduce((acc, item) => acc + item.received, 0);
  const totalDue = currentData.reduce((acc, item) => acc + item.due, 0);

  return (
    <div className="w-full max-w-2xl text-center mx-auto p-4"> {/* Increased max-width */}
      {/* Grid for Header and Dropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Payment Overview</h3>

        {/* Dropdown for view selection */}
        <div className="flex justify-end items-center">
          <label className="block font-medium mr-2">Select View:</label>
          <select
            value={view}
            onChange={handleViewChange}
            className="w-1/2 sm:w-1/3 px-2 py-2 border rounded-lg"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={currentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={view === "weekly" ? "week" : view === "monthly" ? "month" : "year"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="received"
            stroke="#82ca9d"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="due"
            stroke="#8884d8"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary */}
      <div className="mt-6 flex justify-center space-x-6">
        <div className="text-center">
          <h4 className="font-semibold">Received Amount</h4>
          <p className="text-lg">${totalReceived.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <h4 className="font-semibold">Due Amount</h4>
          <p className="text-lg">${totalDue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverview;
