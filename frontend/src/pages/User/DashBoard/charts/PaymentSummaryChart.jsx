import React, { useState } from "react";
import Chart from "react-apexcharts";
import { CgEditBlackPoint } from "react-icons/cg";

const PaymentSummaryChart = () => {
  const initialData = {
    weekly: { Paid: 70, Unpaid: 20, "Partly Paid": 10 },
    monthly: { Paid: 300, Unpaid: 50, "Partly Paid": 50 },
    yearly: { Paid: 4000, Unpaid: 500, "Partly Paid": 300 },
  };

  const [view, setView] = useState("weekly"); 
  const [chartData, setChartData] = useState(initialData);

  const series = Object.values(chartData[view]);
  const total = series.reduce((acc, val) => acc + val, 0);

  const options = {
    labels: Object.keys(chartData[view]), 
    chart: {
      type: "donut",
    },
    colors: ["#397568", "#285249", "#395075"], 
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) => {
          const percentage = ((val / total) * 100).toFixed(2);
          return `${val} (${percentage}%)`;
        },
      },
    },
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };


  const handleViewChange = (e) => {
    setView(e.target.value);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Payment Summary</h1>
        <div className="flex items-center">
          <label className="block font-medium mr-2">Sort:</label>
          <select
            value={view}
            onChange={handleViewChange}
            className="w-full px-2 py-2 border rounded-lg"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="items-center">
        {/* Chart */}
        <div className="flex justify-center">
          <Chart options={options} series={series} type="donut" width="350" />
        </div>

        {/* Summary */}
        <div className="mt-3 px-4 rounded-lg">
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(chartData[view]).map(([category, value]) => {
              const percentage = ((value / total) * 100).toFixed(2);
              return (
                <li
                  key={category}
                  className=" flex justify-between border-b border-gray-200 py-2 text-sm"
                >
                  <span className=" flex items-center"><CgEditBlackPoint className="mr-2 text-[#397568]"/>{category}:</span> {value} (
                  {percentage}%)
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryChart;
