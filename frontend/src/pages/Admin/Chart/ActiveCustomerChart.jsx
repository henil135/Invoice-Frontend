import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const ActiveCustomerChart = () => {
  const [state, setState] = useState({
    series: [
      { name: "Active Customers", data: [] },
      { name: "Deactivated Customers", data: [] },
      { name: "Registered Customers", data: [] },
    ],
    options: {
      colors: ["#397568", "#285249", "#395075"],
      chart: { type: "bar", height: 350 },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "55%", borderRadius: 5 },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: { categories: [] },
      yaxis: { title: { text: "Number of Customers" } },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (val) => `${val} customers`,
        },
      },
    },
    timeRange: "monthly",
  });

  const calculateMonthlyData = (users) => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(2024, i, 1));
    const monthlyRegistered = Array(12).fill(0);
    const monthlyActive = Array(12).fill(0);
    const monthlyDeactivated = Array(12).fill(0);

    const today = new Date();

    users.forEach((user) => {
      const createdAt = new Date(user.createdAt);
      const lastLogin = new Date(user.lastLogin);
      const createdMonth = createdAt.getMonth();

      if (createdAt.getFullYear() === 2024) {
        monthlyRegistered[createdMonth]++;
      }

      if (lastLogin > new Date(today.setMonth(today.getMonth() - 1))) {
        monthlyActive[createdMonth]++;
      } else {
        monthlyDeactivated[createdMonth]++;
      }
    });

    return { monthlyRegistered, monthlyActive, monthlyDeactivated };
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/user/getalluser");
      const users = response.data;

      const { monthlyRegistered, monthlyActive, monthlyDeactivated } =
        calculateMonthlyData(users);

      setState((prevState) => ({
        ...prevState,
        series: [
          { name: "Active Customers", data: monthlyActive },
          { name: "Deactivated Customers", data: monthlyDeactivated },
          { name: "Registered Customers", data: monthlyRegistered },
        ],
        options: {
          ...prevState.options,
          xaxis: {
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
        },
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">Customer Overview</h2>
          <select
            value={state.timeRange}
            onChange={(e) => setState({ ...state, timeRange: e.target.value })}
            className="p-2 border rounded-md"
          >
            <option value="monthly">Monthly</option>
            {/* Additional ranges like weekly/yearly can be implemented */}
          </select>
        </div>
        <div id="chart" className="mb-6">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ActiveCustomerChart;
