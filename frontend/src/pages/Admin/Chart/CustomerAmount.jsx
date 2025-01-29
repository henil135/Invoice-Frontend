import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const CustomerAmount = () => {
  // Define state for timePeriod (dropdown control) and chart data
  const [timePeriod, setTimePeriod] = useState("week"); // Default value set to 'week'

  // Sample data for Due Amount and Receivable Amount (for each time period)
  const data = {
    week: {
      dueAmount: [50, 30, 45, 60],
      receivableAmount: [60, 40, 70, 85],
      categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    },
    month: {
      dueAmount: [50, 30, 45, 60, 55, 80, 90, 70, 85, 95, 100, 120],
      receivableAmount: [60, 40, 70, 85, 90, 100, 120, 110, 130, 140, 150, 160],
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    year: {
      dueAmount: [500, 600, 700, 800, 1000],
      receivableAmount: [600, 700, 800, 900, 1100],
      categories: ["2020", "2021", "2022", "2023", "2024"],
    },
  };

  // Set data and categories based on selected timePeriod
  const currentData = data[timePeriod];

  // Set title dynamically based on the selected timePeriod
  const title =
    timePeriod === "week"
      ? "Due Amount & Receivable Amount (Weekly)"
      : timePeriod === "month"
      ? "Due Amount & Receivable Amount (Monthly)"
      : "Due Amount & Receivable Amount (Yearly)";

  // Summary calculations
  const totalDueAmount = currentData.dueAmount.reduce(
    (acc, curr) => acc + curr,
    0
  );
  const totalReceivableAmount = currentData.receivableAmount.reduce(
    (acc, curr) => acc + curr,
    0
  );

  const options = {
    series: [
      { name: "Due Amount", data: currentData.dueAmount },
      { name: "Receivable Amount", data: currentData.receivableAmount },
    ],
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.5,
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#397568", "#285249"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: title,
      align: "left",
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    markers: {
      size: 1,
    },
    xaxis: {
      categories: currentData.categories,
      title: {
        text: timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1),
      },
    },
    yaxis: {
      title: {
        text: "Amount",
      },
      min: 0,
      max:
        Math.max(...currentData.dueAmount, ...currentData.receivableAmount) +
        50, // Dynamic max value
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="p-4 max-w-2xl mx-auto">
        {/* Dropdown for selecting Time Period */}
        <div className="flex items-center justify-end space-x-4 mb-6">
          <label className="font-medium">Select:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)} // Update timePeriod state on selection change
            className="px-3 py-2 border rounded-lg"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>

        <ReactApexChart
          options={options}
          series={options.series}
          type="line"
          height={350}
        />

        {/* Summary Section */}
        <div className="mt-6 text-lg flex justify-between">
          <p>
            <strong>Total Due Amount: </strong>${totalDueAmount}
          </p>
          <p>
            <strong>Total Receivable Amount: </strong>${totalReceivableAmount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerAmount;
