import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const ItemsChart = () => {
  const [timePeriod, setTimePeriod] = useState("month"); // Default to 'month'
  const [chartData, setChartData] = useState({
    series: [],
    labels: [],
    title: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Helper function to filter items based on type and time period
  const filterData = (items) => {
    const filteredItems = items.filter(
      (item) => item.userId == userId && (item.type === "Goods" || item.type === "Service")
    );

    const typeCounts = filteredItems.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      },
      { Goods: 0, Service: 0 }
    );

    const total = Object.values(typeCounts).reduce((sum, val) => sum + val, 0);
    const percentages = Object.keys(typeCounts).map(
      (type) => (typeCounts[type] / total) * 100
    );

    return {
      series: percentages,
      labels: Object.keys(typeCounts),
      title:
        timePeriod === "week"
          ? "This Week"
          : timePeriod === "month"
          ? "This Month"
          : "This Year",
    };
  };

  // Fetch items data from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/item/getallitem", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const result = await response.json();
          const filteredData = filterData(result);
          setChartData(filteredData);
        } else {
          setError("Failed to fetch items data");
        }
      } catch (error) {
        setError("An error occurred while fetching items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [timePeriod, token, userId]);

  const options = {
    series: chartData.series, // Use series from API data
    chart: {
      width: "100%",
      type: "donut",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: "70%",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(2)}%`,
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 3,
        opacity: 0.75,
      },
    },
    fill: {
      type: "solid",
      colors: ["#397568", "#285249"], 
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5,
      },
      formatter: (val, opts) => {
        return `${val} - ${opts.w.globals.series[opts.seriesIndex].toFixed(2)}%`;
      },
    },
    title: {
      text: chartData.title,
      align: "center",
      margin: 10,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
      },
    },
    tooltip: {
      enabled: true,
      formatter: (val, opts) => {
        return `${opts.w.globals.labels[opts.seriesIndex]}: ${val.toFixed(2)}%`;
      },
    },
    labels: chartData.labels, // Labels for Goods and Services
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "200",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Items Overview</h2>

        {/* Dropdown for selecting Time Period */}
        <div className="flex items-center w-full sm:w-auto">
          <label className="block font-medium mr-4">Select:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="w-full sm:w-48 px-2 py-2 border rounded-lg"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex justify-center items-center">
        <div id="chart" className="w-full md:w-80">
          <ApexCharts
            options={options}
            series={options.series}
            type="donut"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemsChart;
